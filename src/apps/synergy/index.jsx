import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar, Icon } from "../../utils/general";
import { useScenario } from "../../scenarios/engine";
import { TaskBoard } from "./TaskBoard";
import { ConstrainedDocument } from "../../components/documents/ConstrainedDocument";
import "./synergy.scss";

// Build file tree from scenario - helper to flatten folder structure
const buildFileTreeFromScenario = (fileTree) => {
  return fileTree.map(folder => ({
    id: folder.id,
    name: folder.name,
    type: "folder",
    children: folder.items.map(item => {
      if ('items' in item) {
        // Nested folder
        return { id: item.id, name: item.name, type: "folder", children: [] };
      } else {
        // Document
        const docType = item.icon === 'board' ? 'board' : item.icon === 'spreadsheet' ? 'risk' : 'document';
        return { id: item.id, name: item.name, type: docType };
      }
    })
  }));
};

// Static data is now loaded from scenario via useScenario() hook

const STATUS_CYCLE = ["Open", "In Progress", "Closed"];

const getFileIcon = (type) => {
  switch (type) {
    case "folder": return "faFolder";
    case "document": return "faFileAlt";
    case "risk": return "faExclamationTriangle";
    case "board": return "faColumns";
    default: return "faFile";
  }
};

const RiskRegister = ({ risks, onStatusChange }) => {
  return (
    <div className="synergy-risk-register">
      <h2>Risk Register — Vantage Project</h2>
      <div className="synergy-risk-table-container">
        <table className="synergy-risk-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(risk => (
              <tr key={risk.id}>
                <td className="risk-id">{risk.id}</td>
                <td>{risk.description}</td>
                <td>{risk.owner}</td>
                <td className={`likelihood-${risk.likelihood.toLowerCase()}`}>{risk.likelihood}</td>
                <td className={`impact-${risk.impact.toLowerCase()}`}>{risk.impact}</td>
                <td>
                  <button 
                    className={`risk-status-btn status-${risk.status.toLowerCase().replace(" ", "-")}`}
                    onClick={() => onStatusChange(risk.id)}
                  >
                    {risk.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Synergy = ({ initialView = null }) => {
  const wnapp = useSelector((state) => state.apps.synergy);
  const constrainedDocument = useSelector((state) => state.player?.constrainedDocument);
  const dispatch = useDispatch();
  const { scenario, getNPC, getPlayerName } = useScenario();
  
  // Build file tree and documents from scenario
  const fileTree = useMemo(() => buildFileTreeFromScenario(scenario.fileTree), [scenario.fileTree]);
  
  // Build documents map from scenario
  const documents = useMemo(() => {
    const docs = {};
    const traverse = (items) => {
      items.forEach(item => {
        if ('items' in item) {
          traverse(item.items);
        } else if ('content' in item && item.content.type === 'prose') {
          const playerName = getPlayerName();
          docs[item.id] = {
            title: item.name,
            content: item.content.body.replace(/\[Player name\]/g, playerName)
          };
        }
      });
    };
    traverse(scenario.fileTree);
    return docs;
  }, [scenario.fileTree, getPlayerName]);
  
  const [selectedFile, setSelectedFile] = useState(initialView || null);
  const [expandedFolders, setExpandedFolders] = useState(() => {
    const expanded = {};
    scenario.fileTree.forEach(folder => { expanded[folder.id] = true; });
    return expanded;
  });
  const [risks, setRisks] = useState(() => {
    const playerName = getPlayerName();
    return scenario.riskRegister.map(r => ({
      ...r,
      owner: r.ownerId === 'player' ? playerName : getNPC(r.ownerId)?.name || r.ownerId
    }));
  });

  useEffect(() => {
    if (initialView) {
      setSelectedFile(initialView);
    }
  }, [initialView]);

  if (!wnapp) return null;

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleStatusChange = (riskId) => {
    setRisks(prev => prev.map(risk => {
      if (risk.id === riskId) {
        const currentIndex = STATUS_CYCLE.indexOf(risk.status);
        const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
        return { ...risk, status: nextStatus };
      }
      return risk;
    }));
  };

  const renderContent = () => {
    // Show ConstrainedDocument if one is active
    if (constrainedDocument) {
      return (
        <ConstrainedDocument
          id={constrainedDocument.id}
          title={constrainedDocument.title}
          fields={constrainedDocument.fields}
          onSave={() => {
            dispatch({ type: 'CLOSE_CONSTRAINED_DOCUMENT' });
          }}
        />
      );
    }

    if (!selectedFile) {
      return (
        <div className="synergy-empty">
          <Icon fafa="faFolderOpen" width={48} />
          <p>Select a file to view</p>
        </div>
      );
    }

    if (selectedFile === "tasks") {
      return <TaskBoard />;
    }

    if (selectedFile === "risk") {
      return <RiskRegister risks={risks} onStatusChange={handleStatusChange} />;
    }

    const doc = documents[selectedFile];
    if (doc) {
      return (
        <div className="synergy-document">
          <h1>{doc.title}</h1>
          <div className="synergy-document-content">
            {doc.content.split("\n").map((line, idx) => {
              if (line.trim() === "") return <br key={idx} />;
              if (line.toUpperCase() === line && line.length > 3) {
                return <h2 key={idx}>{line}</h2>;
              }
              if (line.startsWith("- ")) {
                return <li key={idx}>{line.substring(2)}</li>;
              }
              if (/^\d+\./.test(line)) {
                return <h3 key={idx}>{line}</h3>;
              }
              return <p key={idx}>{line}</p>;
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="synergy-empty">
        <p>File not found</p>
      </div>
    );
  };

  return (
    <div
      className="synergy floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
    >
      <ToolBar
        app={wnapp?.action}
        icon={wnapp?.icon}
        size={wnapp?.size}
        name="Synergy Drive"
      />
      <div className="windowScreen flex" data-dock="true">
        {/* File tree sidebar */}
        <div className="synergy-sidebar">
          <div className="synergy-tree">
            {fileTree.map(folder => (
              <div key={folder.id} className="synergy-tree-folder">
                <div 
                  className="synergy-tree-item folder"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <Icon 
                    fafa={expandedFolders[folder.id] ? "faChevronDown" : "faChevronRight"} 
                    width={12} 
                  />
                  <Icon fafa="faFolder" width={16} />
                  <span>{folder.name}</span>
                </div>
                {expandedFolders[folder.id] && (
                  <div className="synergy-tree-children">
                    {folder.children.map(child => (
                      <div
                        key={child.id}
                        className={`synergy-tree-item file ${selectedFile === child.id ? "active" : ""}`}
                        onClick={() => setSelectedFile(child.id)}
                      >
                        <Icon fafa={getFileIcon(child.type)} width={16} />
                        <span>{child.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="synergy-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
