/**
 * Email Store
 * 
 * Global email state management for the Outbox app.
 * Handles incoming emails and dispatches notifications.
 */

import { Email } from '../scenarios/types';

// Action types
export const ADD_EMAIL = 'ADD_EMAIL';
export const MARK_EMAIL_READ = 'MARK_EMAIL_READ';
export const ARCHIVE_EMAIL = 'ARCHIVE_EMAIL';

// Email state
export interface EmailState {
  emails: Email[];
}

// Initial state
export const initialEmailState: EmailState = {
  emails: []
};

// Reducer
export const emailReducer = (state = initialEmailState, action: any): EmailState => {
  try {
    // Ensure state is valid
    const safeState = state && typeof state === 'object' ? state : initialEmailState;
    const safeEmails = Array.isArray(safeState.emails) ? safeState.emails : [];

    switch (action.type) {
      case ADD_EMAIL:
        // Prevent duplicates
        if (safeEmails.some(e => e.id === action.payload.id)) {
          return safeState;
        }
        return {
          ...safeState,
          emails: [...safeEmails, action.payload]
        };

      case MARK_EMAIL_READ:
        return {
          ...safeState,
          emails: safeEmails.map(e =>
            e.id === action.payload ? { ...e, read: true } : e
          )
        };

      case ARCHIVE_EMAIL:
        return {
          ...safeState,
          emails: safeEmails.filter(e => e.id !== action.payload)
        };

      default:
        return safeState;
    }
  } catch (e) {
    console.error('[emailReducer] Error:', e);
    return initialEmailState;
  }
};

// Selectors
export const selectEmails = (state: { emails: EmailState }) => state.emails.emails;
export const selectUnreadEmails = (state: { emails: EmailState }) => 
  state.emails.emails.filter(e => !e.read);

// Action creators
export const addEmail = (email: Email) => ({
  type: ADD_EMAIL,
  payload: email
});

export const markEmailRead = (emailId: string) => ({
  type: MARK_EMAIL_READ,
  payload: emailId
});

export const archiveEmail = (emailId: string) => ({
  type: ARCHIVE_EMAIL,
  payload: emailId
});
