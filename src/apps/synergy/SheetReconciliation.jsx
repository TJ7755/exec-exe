import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '../../utils/general';

const SheetReconciliation = ({ content, onSave }) => {
  const [editableSheetB, setEditableSheetB] = useState(
    content.sheetB.rows.map(row => ({ ...row }))
  );
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

  const handleSubmit = () => {
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
                  <td>-</td>
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
                  <div className="discrepancy-id">{disc.id}</div>
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
