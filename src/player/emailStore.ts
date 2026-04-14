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
  switch (action.type) {
    case ADD_EMAIL:
      // Prevent duplicates
      if (state.emails.some(e => e.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        emails: [...state.emails, action.payload]
      };
    
    case MARK_EMAIL_READ:
      return {
        ...state,
        emails: state.emails.map(e =>
          e.id === action.payload ? { ...e, read: true } : e
        )
      };
    
    case ARCHIVE_EMAIL:
      return {
        ...state,
        emails: state.emails.filter(e => e.id !== action.payload)
      };
    
    default:
      return state;
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
