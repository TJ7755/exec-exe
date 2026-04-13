/**
 * Constrained Document Editor
 * Part 8 — Constrained Document Editor
 * 
 * A minimal document editor component used for the status update
 * (and later for other game documents). Not a general-purpose Word clone.
 * 
 * AI_HOOK: document fields will later optionally be AI-assisted.
 * A small "✨" button beside each field will trigger an AI suggestion
 * based on current game state.
 */

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setHiddenFlag } from '../../player/hiddenState';
import { updateStats } from '../../player/store';
import './constrained-document.scss';

export interface DocumentField {
  id: string;
  label: string;
  type: 'dropdown' | 'bullet_list' | 'freetext';
  options?: string[];          // for dropdown
  maxItems?: number;           // for bullet_list
  maxLength?: number;          // for freetext
  value: string | string[];
  placeholder?: string;
}

export interface ConstrainedDocumentProps {
  id: string;
  title: string;
  fields: DocumentField[];
  onSave?: (documentId: string, values: Record<string, string | string[]>) => void;
  aiAssistEnabled?: boolean;     // AI_HOOK: enable AI assistance
}

export const ConstrainedDocument: React.FC<ConstrainedDocumentProps> = ({
  id,
  title,
  fields: initialFields,
  onSave,
  aiAssistEnabled = false
}) => {
  const dispatch = useDispatch();
  const [fields, setFields] = useState<DocumentField[]>(initialFields);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback((fieldId: string, value: string | string[]) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ));
    setIsDirty(true);
  }, []);

  const handleDropdownChange = (fieldId: string, value: string) => {
    updateField(fieldId, value);
  };

  const handleBulletAdd = (fieldId: string, maxItems: number = 3) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const currentValues = Array.isArray(field.value) ? field.value : [];
    if (currentValues.length >= maxItems) return;

    updateField(fieldId, [...currentValues, '']);
  };

  const handleBulletChange = (fieldId: string, index: number, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const currentValues = Array.isArray(field.value) ? [...field.value] : [];
    currentValues[index] = value;
    updateField(fieldId, currentValues);
  };

  const handleBulletRemove = (fieldId: string, index: number) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const currentValues = Array.isArray(field.value) ? [...field.value] : [];
    currentValues.splice(index, 1);
    updateField(fieldId, currentValues);
  };

  const handleSave = useCallback(() => {
    const values: Record<string, string | string[]> = {};
    fields.forEach(field => {
      values[field.id] = field.value;
    });

    // Call onSave callback
    onSave?.(id, values);

    // Mark status update as started in hidden state
    if (id.includes('status') || id.includes('weekly')) {
      dispatch(setHiddenFlag('statusUpdateStarted', true));
      dispatch(updateStats({ stress: -10 }));
    }

    setIsDirty(false);

    // Show success notification
    dispatch({
      type: 'NOTIFICATION_ADD',
      payload: {
        title: 'Document Saved',
        body: `${title} has been saved.`,
        urgency: 'low'
      }
    });
  }, [dispatch, fields, id, onSave, title]);

  // AI_HOOK: Request AI suggestion for a field
  const requestAiSuggestion = (fieldId: string) => {
    // This will be implemented when AI is integrated
    console.log(`[AI_HOOK] Requesting AI suggestion for field: ${fieldId}`);
    dispatch({
      type: 'AI_SUGGESTION_REQUEST',
      payload: { documentId: id, fieldId }
    });
  };

  const renderField = (field: DocumentField) => {
    switch (field.type) {
      case 'dropdown':
        return (
          <div key={field.id} className="document-field">
            <label className="field-label">
              {field.label}
              {aiAssistEnabled && (
                <button 
                  className="ai-suggest-btn"
                  onClick={() => requestAiSuggestion(field.id)}
                  title="Get AI suggestion"
                >
                  ✨
                </button>
              )}
            </label>
            <select
              value={field.value as string}
              onChange={(e) => handleDropdownChange(field.id, e.target.value)}
              className="field-dropdown"
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'bullet_list':
        const bulletValues = Array.isArray(field.value) ? field.value : [];
        const canAddMore = bulletValues.length < (field.maxItems || 3);

        return (
          <div key={field.id} className="document-field">
            <label className="field-label">
              {field.label}
              {aiAssistEnabled && (
                <button 
                  className="ai-suggest-btn"
                  onClick={() => requestAiSuggestion(field.id)}
                  title="Get AI suggestion"
                >
                  ✨
                </button>
              )}
            </label>
            <div className="bullet-list">
              {bulletValues.map((value, index) => (
                <div key={index} className="bullet-item">
                  <span className="bullet-marker">•</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleBulletChange(field.id, index, e.target.value)}
                    placeholder={field.placeholder}
                    className="bullet-input"
                  />
                  <button
                    className="bullet-remove"
                    onClick={() => handleBulletRemove(field.id, index)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              {canAddMore && (
                <button
                  className="bullet-add"
                  onClick={() => handleBulletAdd(field.id, field.maxItems)}
                >
                  + Add bullet point
                </button>
              )}
            </div>
          </div>
        );

      case 'freetext':
        return (
          <div key={field.id} className="document-field">
            <label className="field-label">
              {field.label}
              {aiAssistEnabled && (
                <button 
                  className="ai-suggest-btn"
                  onClick={() => requestAiSuggestion(field.id)}
                  title="Get AI suggestion"
                >
                  ✨
                </button>
              )}
            </label>
            <textarea
              value={field.value as string}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              className="field-textarea"
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="constrained-document">
      <div className="document-header">
        <h2 className="document-title">{title}</h2>
        <div className="document-actions">
          {isDirty && <span className="unsaved-indicator">Unsaved changes</span>}
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={!isDirty}
          >
            Save
          </button>
        </div>
      </div>

      <div className="document-body">
        {fields.map(renderField)}
      </div>

      <div className="document-footer">
        <button 
          className="save-btn primary"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save Document
        </button>
      </div>
    </div>
  );
};

// Predefined document templates
export const WeeklyStatusUpdateTemplate: ConstrainedDocumentProps = {
  id: 'weekly-status-update',
  title: 'Weekly Status Update',
  fields: [
    {
      id: 'status',
      label: 'Current Status',
      type: 'dropdown',
      options: ['Green', 'Amber', 'Red'],
      value: ''
    },
    {
      id: 'risks',
      label: 'Key Risks',
      type: 'bullet_list',
      maxItems: 3,
      placeholder: 'Describe a risk...',
      value: []
    },
    {
      id: 'actions',
      label: 'Actions This Week',
      type: 'bullet_list',
      maxItems: 3,
      placeholder: 'Describe an action...',
      value: []
    }
  ]
};

export default ConstrainedDocument;
