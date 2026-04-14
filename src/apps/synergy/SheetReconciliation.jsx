import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../../utils/general';

const SheetReconciliation = ({ content, onSave }) => {
  const [editableSheetB, setEditableSheetB] = useState(
    content.sheetB.rows.map(row => ({ ...row, notes: row.notes || '' }))
  );
  const [investigatingRow, setInvestigatingRow] = useState(null);
  const dispatch = useDispatch();

  // Calculate dashboard status automatically
  const dashboardStatus = useMemo(() => {
    const discrepancies = content.sheetA.rows.filter(rowA => {
      const rowB = editableSheetB.find(r => r.id === rowA.id);
      if (!rowB) return true;
      return rowA.status !== rowB.status || rowA.location !== rowB.location;
    });

    const overdueServices = content.sheetA.rows.filter(row => {
      const lastService = row.lastService;
      if (!lastService) return false;
      const serviceDate = new Date(lastService);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - serviceDate.getFullYear()) * 12 + (now.getMonth() - serviceDate.getMonth());
      return monthsDiff > 12; // Overdue if more than 12 months
    });

    if (discrepancies.length === 0 && overdueServices.length === 0) {
      return 'Green';
    } else if (discrepancies.length <= 2 && overdueServices.length <= 1) {
      return 'Amber';
    } else {
      return 'Red';
    }
  }, [content.sheetA.rows, editableSheetB]);

  // Find discrepancies between Sheet A and Sheet B
  const discrepancies = content.sheetA.rows.filter(rowA => {
    const rowB = editableSheetB.find(r => r.id === rowA.id);
    if (!rowB) return true;
    return rowA.status !== rowB.status || rowA.location !== rowB.location;
  });

  const handleSheetBEdit = (rowId, field, value) => {
    setEditableSheetB(prev => 
      prev.map(row => 
        row.id === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  const handleInvestigate = (rowId) => {
    const rowA = content.sheetA.rows.find(r => r.id === rowId);
    const rowB = editableSheetB.find(r => r.id === rowId);
    setInvestigatingRow({
      id: rowId,
      name: rowA?.name || rowId,
      sheetA: rowA,
      sheetB: rowB,
      history: [
        { date: '2022-06-15', action: 'Asset added to register', user: 'System' },
        { date: '2022-11-20', action: 'Status changed to Decommissioned', user: 'h.holmes' },
        { date: '2024-01-10', action: 'Status changed back to Active', user: 'h.holmes', note: 'No reason code provided' }
      ]
    });
  };

  const handleSubmit = () => {
    // Trigger the reconciliation dialogue choice
    dispatch({
      type: 'SET_ACTIVE_CHOICE',
      payload: {
        id: 'mon_reconciliation_choice',
        type: 'email',
        contextId: 'task-nathaniel-rw',
        prompt: `You've completed the Royal Western reconciliation. Dashboard status: ${dashboardStatus}. There ${discrepancies.length === 1 ? 'is' : 'are'} ${discrepancies.length} discrepanc${discrepancies.length === 1 ? 'y' : 'ies'}. How do you handle this?`,
        options: [
          {
            id: 'changed_numbers',
            label: "Align Sheet B with Sheet A — update the MIS records to match the hospital's register.",
            subtext: dashboardStatus === 'Green' ? "Dashboard is Green. Nathaniel will be pleased." : "This will achieve Green status.",
            consequences: {
              repDeltas: { nathaniel: 2 },
              hiddenFlags: { sheetReconciliationApproach: 'changed_numbers', sheetReconciliationTarget: dashboardStatus.toLowerCase(), dashboardIntegrityCompromised: dashboardStatus !== 'Green' },
              unlockInfo: dashboardStatus === 'Green' ? "Dashboard is Green. You have compromised data integrity. Nathaniel is pleased." : "Dashboard is now Green. Data integrity may be compromised."
            }
          },
          {
            id: 'flagged_discrepancy',
            label: "Flag the discrepancies in Sheet B with notes explaining the differences.",
            subtext: "Professional approach — document what you found.",
            consequences: {
              repDeltas: { nathaniel: 0 },
              hiddenFlags: { sheetReconciliationApproach: 'flagged_discrepancy', sheetReconciliationTarget: dashboardStatus === 'Green' ? 'green' : 'amber' },
              unlockInfo: dashboardStatus === 'Green' ? "Dashboard is Green with flagged discrepancies. Nathaniel notes this as 'thorough but missed the point'." : "Dashboard is Amber with flagged discrepancies. Nathaniel notes this as 'thorough but missed the point'."
            }
          },
          {
            id: 'asked_for_help',
            label: "Message Rosa — she's been here 6 years and might have context on this.",
            subtext: "She seems to know where the bodies are buried.",
            consequences: {
              repDeltas: { rosa: 1 },
              hiddenFlags: { sheetReconciliationApproach: 'asked_for_help', askedRosaForHelp: true },
              triggerEventIds: ['mon_rosa_advice']
            }
          },
          {
            id: 'honest',
            label: "Report the discrepancies honestly to Nathaniel — Sheet A is the truth, Sheet B is wrong.",
            subtext: "This is the correct thing to do.",
            consequences: {
              repDeltas: { nathaniel: -1 },
              hiddenFlags: { sheetReconciliationApproach: 'honest', sheetReconciliationTarget: 'honest', nathanielToldTruth: true },
              unlockInfo: "Nathaniel is not pleased. 'We need the dashboard Green. That's what I asked for.'",
              npcFollowUpKey: 'mon_nathaniel_truth_response'
            }
          }
        ],
        resolvedOptionId: null
      }
    });

    dispatch({
      type: 'SHEET_RECONCILIATION_SUBMITTED',
      payload: {
        target: dashboardStatus,
        sheetB: editableSheetB,
        discrepancyCount: discrepancies.length
      }
    });
    
    if (onSave) onSave();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Green': return 'green';
      case 'Amber': return 'amber';
      case 'Red': return 'red';
      default: return '';
    }
  };

  return (
    <div className="sheet-reconciliation">
      <div className="sheet-reconciliation-header">
        <h1>{content.sheetA.name} — Reconciliation</h1>
        <p className="sheet-reconciliation-description">
          Compare the hospital register (Sheet A) with the MIS system record (Sheet B).
          Identify discrepancies and reconcile them.
        </p>
      </div>

      <div className="sheet-reconciliation-target">
        <h3>Dashboard Status (Auto-calculated)</h3>
        <div className="target-options">
          <div className={`target-status-indicator ${getStatusColor(dashboardStatus)}`}>
            <Icon 
              fafa={
                dashboardStatus === 'Green' ? 'faCheckCircle' :
                dashboardStatus === 'Amber' ? 'faExclamationTriangle' :
                'faTimesCircle'
              } 
              width={20} 
            />
            <span className="status-text">
              {dashboardStatus} — {
                dashboardStatus === 'Green' ? 'All assets match, no overdue services' :
                dashboardStatus === 'Amber' ? 'Minor discrepancies or 1–2 overdue services' :
                'Significant discrepancies or critical overdue items'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="sheet-reconciliation-tables">
        <div className="sheet-table">
          <h3>{content.sheetA.name}</h3>
          <p className="sheet-description">{content.sheetA.description} (Read-only)</p>
          <table className="reconciliation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Location</th>
                <th>Last Service</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {content.sheetA.rows.map(row => (
                <tr key={row.id} className={discrepancies.find(d => d.id === row.id) ? 'discrepancy' : ''}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.status}</td>
                  <td>{row.location}</td>
                  <td>{row.lastService || '-'}</td>
                  <td>{row.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sheet-table">
          <h3>{content.sheetB.name}</h3>
          <p className="sheet-description">{content.sheetB.description} (Editable)</p>
          <table className="reconciliation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Location</th>
                <th>Last Service</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {editableSheetB.map(row => (
                <tr key={row.id} className={discrepancies.find(d => d.id === row.id) ? 'discrepancy' : ''}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>
                    <select
                      value={row.status}
                      onChange={(e) => handleSheetBEdit(row.id, 'status', e.target.value)}
                      className="table-input"
                    >
                      <option value="Active">Active</option>
                      <option value="Decommissioned">Decommissioned</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.location}
                      onChange={(e) => handleSheetBEdit(row.id, 'location', e.target.value)}
                      className="table-input"
                    />
                  </td>
                  <td>{row.lastService || '-'}</td>
                  <td>
                    <input
                      type="text"
                      value={row.notes || ''}
                      onChange={(e) => handleSheetBEdit(row.id, 'notes', e.target.value)}
                      className="table-input"
                      placeholder="Add notes..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {discrepancies.length > 0 && (
        <div className="sheet-reconciliation-discrepancies">
          <h3>Discrepancies Found ({discrepancies.length})</h3>
          <div className="discrepancies-list">
            {discrepancies.map(disc => {
              const rowB = editableSheetB.find(r => r.id === disc.id);
              return (
                <div key={disc.id} className="discrepancy-item">
                  <div className="discrepancy-header">
                    <div className="discrepancy-id">{disc.id}</div>
                    <button
                      className="investigate-btn"
                      onClick={() => handleInvestigate(disc.id)}
                      title="View asset history"
                    >
                      <Icon fafa="faSearch" width={14} />
                      Investigate
                    </button>
                  </div>
                  <div className="discrepancy-name">{disc.name}</div>
                  <div className="discrepancy-diff">
                    <span className="diff-label">Sheet A:</span>
                    <span className="diff-value">{disc.status} / {disc.location}</span>
                  </div>
                  <div className="discrepancy-diff">
                    <span className="diff-label">Sheet B:</span>
                    <span className="diff-value diff-highlight">
                      {rowB ? `${rowB.status} / ${rowB.location}` : 'Not found'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {investigatingRow && (
        <div className="investigation-modal">
          <div className="investigation-modal-content">
            <div className="investigation-modal-header">
              <h3>Asset History: {investigatingRow.name}</h3>
              <button className="close-btn" onClick={() => setInvestigatingRow(null)}>×</button>
            </div>
            <div className="investigation-modal-body">
              <div className="asset-details">
                <div className="detail-row">
                  <span className="detail-label">Asset ID:</span>
                  <span className="detail-value">{investigatingRow.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Current Status (Sheet A):</span>
                  <span className="detail-value">{investigatingRow.sheetA?.status}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Current Status (Sheet B):</span>
                  <span className="detail-value">{investigatingRow.sheetB?.status}</span>
                </div>
              </div>
              <h4>Change History</h4>
              <div className="history-list">
                {investigatingRow.history.map((entry, idx) => (
                  <div key={idx} className="history-entry">
                    <div className="history-date">{entry.date}</div>
                    <div className="history-action">{entry.action}</div>
                    <div className="history-user">by {entry.user}</div>
                    {entry.note && <div className="history-note">{entry.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="sheet-reconciliation-actions">
        <button
          className="btn-primary"
          onClick={handleSubmit}
        >
          Submit Reconciliation
        </button>
        <button className="btn-secondary" onClick={onSave}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SheetReconciliation;
