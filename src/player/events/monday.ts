/**
 * Monday Events — Meridian Infrastructure Services
 * 
 * All day 1 events, trigger times in game minutes (0 = 09:00).
 */

import { GameEvent } from './types';
import { setHiddenFlag } from '../hiddenState';
import { updateStats, addNotification } from '../store';

// Helper to add a Flack message
const addFlackMessage = (dispatch: any, participantId: string, content: string) => {
  dispatch({
    type: 'FLACK_ADD_DM_MESSAGE',
    payload: {
      participantId,
      message: {
        id: `msg-${Date.now()}`,
        senderId: participantId,
        content,
        timestamp: new Date().toISOString(),
        edited: false
      }
    }
  });
};

export const mondayEvents: GameEvent[] = [
  // EVENT: mon_tom_welcome (09:10)
  {
    id: 'mon_tom_welcome',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 10,
    fired: false,
    action: (dispatch) => {
      // Sequential messages with delays handled by the app layer
      addFlackMessage(dispatch, 'tom', 'hey! welcome to the asylum 🙃');
      // Subsequent messages triggered by app with 1.5s delays
      dispatch(setHiddenFlag('tomWelcomeSent', true));
    }
  },

  // EVENT: mon_aup_decision (09:20)
  {
    id: 'mon_aup_decision',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 20,
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Synergy Drive',
        body: 'MIS Acceptable Use Policy available. Acknowledgement required by 17:00.',
        urgency: 'normal',
        appId: 'synergy'
      }));
      // Type C DialogueChoice triggered by UI layer when AUP is opened
      dispatch(setHiddenFlag('aupDecisionPending', true));
    }
  },

  // EVENT: mon_nathaniel_onboarding (10:00)
  {
    id: 'mon_nathaniel_onboarding',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 60,
    fired: false,
    action: (dispatch) => {
      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'dm-nathaniel' });
      
      // Nathaniel's intro messages (sequential, app handles delays)
      addFlackMessage(dispatch, 'nathaniel', "Morning! Great to have you on the team.");
      dispatch(setHiddenFlag('nathanielOnboardingStarted', true));
    }
  },

  // EVENT: mon_harry_introduces_himself (10:30)
  {
    id: 'mon_harry_introduces_himself',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 90,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'harry', `Hey! Harry Holmes — Senior Data Analyst, been here 3 years.`);
      dispatch(setHiddenFlag('harryClaimedOwnershipOfDataset', true));
    }
  },

  // EVENT: mon_rosa_introduction (10:50)
  {
    id: 'mon_rosa_introduction',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 110,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'rosa', 'Hi. Rosa. Contractor, Asset Data.');
      dispatch(setHiddenFlag('rosaIntroductionSent', true));
    }
  },

  // EVENT: mon_lunch (12:00)
  {
    id: 'mon_lunch',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 180,
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Lunch Break',
        body: "It's 12:00. Time for lunch!",
        urgency: 'low',
        appId: 'calendar'
      }));
      addFlackMessage(dispatch, 'tom', 'lunch. the canteen is fine. avoid the soup. that\'s all i\'ll say.');
    }
  },

  // EVENT: mon_sheet_task_arrives (13:00)
  {
    id: 'mon_sheet_task_arrives',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 240,
    fired: false,
    action: (dispatch) => {
      // Email arrives via Outbox
      dispatch({
        type: 'ADD_EMAIL',
        payload: {
          id: 'task-nathaniel-rw',
          fromId: 'nathaniel',
          toIds: ['player'],
          subject: 'Task — Royal Western Boiler Plant Reconciliation',
          body: `Your first reconciliation task. See Synergy Drive.

Sheet A = hospital's register (what they say they have)
Sheet B = MIS system of record (what we say they have)

Task: Align them. Target: Dashboard status Green by EOB.

Shout if you have any questions.

Nathaniel`,
          timestamp: new Date().toISOString(),
          read: false,
          threadId: 'task-rw-boiler'
        }
      });
      dispatch(setHiddenFlag('sheetTaskArrived', true));
    }
  },

  // EVENT: mon_diane_email (15:50)
  {
    id: 'mon_diane_email',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 410,
    fired: false,
    action: (dispatch) => {
      dispatch({
        type: 'ADD_EMAIL',
        payload: {
          id: 'diane-blr008',
          fromId: 'diane',
          toIds: ['it'],
          ccIds: ['player'],
          subject: 'Boiler Plant — BLR-008 Service Outstanding',
          body: `Hi,

I'm chasing for the third time on BLR-008 — the Flue Gas Heat Exchanger in our boiler plant. According to our records this was due a full service in October 2022. It is now April 2024 and we have had no service visit and no update from MIS.

We have flagged this internally as a potential compliance issue. Can someone please confirm the service status and provide a date for the overdue work?

I am copying in the new contact on the MIS side in case it helps move things forward.

Diane Osei
Facilities Manager — Royal Western Hospital`,
          timestamp: new Date().toISOString(),
          read: false,
          threadId: 'diane-blr008'
        }
      });
      dispatch(setHiddenFlag('dianeEmailsReceived', 1));
      dispatch(updateStats({ stress: 8 }));
    }
  },

  // EVENT: mon_end_of_day (17:00)
  {
    id: 'mon_end_of_day',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 480,
    fired: false,
    action: (dispatch) => {
      dispatch({ type: 'PAUSE_GAME_TIME' });
      dispatch({
        type: 'SHOW_DAY_SUMMARY',
        payload: {
          day: 1,
          title: 'Monday — End of Day',
          tomorrowCalendar: [
            { time: '09:00', title: 'Team standup, #asset-data-team' },
            { time: '11:00', title: 'Data Quality Review — James Siren' }
          ],
          finalMessage: {
            senderId: 'tom',
            body: "survived? day two is when nathaniel introduces you to the master spreadsheet. it has 47 tabs. one of them is just called 'OLD - DO NOT USE'. there are 6 of those. good luck"
          }
        }
      });
    }
  }
];

export default mondayEvents;
