/**
 * Monday Events — Meridian Infrastructure Services
 * 
 * All day 1 events, trigger times in game minutes (0 = 09:00).
 */

import { GameEvent } from './types';
import { setHiddenFlag, SET_MULTIPLE_HIDDEN_FLAGS } from '../hiddenState';
import { updateStats, addNotification } from '../store';
import { GAME_TIME_SET_DAY } from '../gameTime';

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

  // EVENT: mon_tom_harry_warning (11:30)
  {
    id: 'mon_tom_harry_warning',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 90,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'tom', 'heads up - you\'ll probably be working with harry\'s datasets at some point. just a warning: he\'s convinced everything he touches is gold. it\'s not. double-check his work before you inherit any of his "methodology"');
      dispatch(setHiddenFlag('tomHarryWarningGiven', true));
    }
  },

  // EVENT: mon_tom_dashboard_advice (13:30)
  {
    id: 'mon_tom_dashboard_advice',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 270,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'tom', 'nathaniel\'s going to care about one thing: is the dashboard green. everything else is process. just so you know.');
      dispatch(setHiddenFlag('tomDashboardAdviceGiven', true));
    }
  },

  // EVENT: mon_tom_atlas_hint (16:00)
  {
    id: 'mon_tom_atlas_hint',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 420,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'tom', 'did you hear james mention "atlas" in the all-hands? something big coming apparently. probably nothing. everything\'s "big" here until it\'s cancelled');
      dispatch(setHiddenFlag('tomAtlasHintGiven', true));
      dispatch({ type: 'INCREMENT_ATLAS_AWARENESS' });
    }
  },

  // EVENT: mon_aup_decision (09:20) — Type A Flack DM from Sandra with location info
  {
    id: 'mon_aup_decision',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 20,
    fired: false,
    action: (dispatch) => {
      // Sandra DM with AUP choice and location
      addFlackMessage(dispatch, 'sandra', "Good morning. I need you to acknowledge the MIS Acceptable Use Policy before 17:00 today. It's 28 pages. You can find it in Synergy Drive under the Company folder: 'MIS Acceptable Use Policy (AUP-2024-v3)'. You can sign it now or read it first — your call, but it needs to be done.");

      // Open Synergy Drive with AUP document selected (using payload object with initialView)
      dispatch({ type: 'OPEN_APP', payload: { app: 'synergy', initialView: 'aup' } });

      // Set active DialogueChoice for Sandra DM
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'mon_aup_choice',
          type: 'flack_dm',
          contextId: 'sandra',
          prompt: "The MIS Acceptable Use Policy is 28 pages. Sandra needs your acknowledgement by 17:00.",
          options: [
            {
              id: 'sign_now',
              label: "Acknowledge now — you'll read it later.",
              responseText: "Thanks for the heads up, I'll check on it later.",
              consequences: {
                repDeltas: { nathaniel: 1 },
                hiddenFlags: { signedAUPImmediately: true, aupDecisionPending: false },
                unlockInfo: "Nathaniel can see you've completed onboarding tasks promptly.",
                npcFollowUpKey: 'mon_aup_signed'
              }
            },
            {
              id: 'read_first',
              label: "Read it before signing.",
              responseText: "Thanks for the heads up, I'll check on it later.",
              consequences: {
                hiddenFlags: { readHandbookProperly: true, aupDecisionPending: false },
                triggerEventIds: ['mon_tom_aup_comment'],
                unlockInfo: "Section 7.3 notes that all data modifications must be logged with a reason code. Nobody does this. You now know it's required.",
                npcFollowUpKey: 'mon_aup_reading'
              }
            }
          ],
          resolvedOptionId: null
        }
      });

      dispatch(setHiddenFlag('aupDecisionPending', true));
    }
  },

  // EVENT: mon_tom_aup_comment (09:35) — fires if player chose to read AUP
  {
    id: 'mon_tom_aup_comment',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'tom', "you're still reading the AUP aren't you");
      // 1.5s delay handled by app layer
      addFlackMessage(dispatch, 'tom', "it's fine. section 7.3 is the one that matters. nobody follows it.");
      dispatch(setHiddenFlag('tomFlaggedSection73', true));
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
      
      // Nathaniel's intro messages
      addFlackMessage(dispatch, 'nathaniel', "Morning! Great to have you on the team.");
      addFlackMessage(dispatch, 'nathaniel', "So — let me give you the big picture.");
      addFlackMessage(dispatch, 'nathaniel', "MIS manages the data infrastructure for 15 NHS hospital sites. We're the single source of truth for approximately 50,000 physical assets.");
      addFlackMessage(dispatch, 'nathaniel', "Your role in Asset Data is essentially the engine room of that system.");
      addFlackMessage(dispatch, 'nathaniel', "This afternoon I'm going to give you your first live reconciliation task. Royal Western Hospital, London. Boiler plant assets. About 200 line items.");
      addFlackMessage(dispatch, 'nathaniel', "It's a good starter task — straightforward, well-documented. How do you respond?");
      
      // Set active DialogueChoice for Nathaniel DM
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'mon_nathaniel_onboarding_choice',
          type: 'flack_dm',
          contextId: 'nathaniel',
          prompt: "Nathaniel has described your first task — reconciling Royal Western boiler plant assets.",
          options: [
            {
              id: 'committed',
              label: "Sounds good — when do I start?",
              consequences: {
                repDeltas: { nathaniel: 2 },
                hiddenFlags: { monTaskAcknowledged: 'committed', nathanielConfidenceInPlayer: 'high' },
                npcFollowUpKey: 'mon_task_acknowledged_committed'
              }
            },
            {
              id: 'questioned',
              label: "What usually causes the discrepancy between the sheets?",
              consequences: {
                repDeltas: { nathaniel: 0 },
                npcFollowUpKey: 'mon_task_acknowledged_questioned',
                unlockInfo: "Nathaniel explains it confidently and incorrectly. The real answer is: assets are decommissioned on site without being logged."
              }
            },
            {
              id: 'pushed_back',
              label: "If the sheets don't match, shouldn't we investigate which one is accurate?",
              subtext: "Seems like the obvious question.",
              consequences: {
                repDeltas: { nathaniel: -1 },
                hiddenFlags: { monTaskAcknowledged: 'pushed_back', nathanielConfidenceInPlayer: 'normal' },
                npcFollowUpKey: 'mon_task_acknowledged_pushed_back',
                unlockInfo: "Nathaniel's answer is: 'Great mindset, but let's not overcomplicate it.' He has never considered the question you just asked."
              }
            },
            {
              id: 'asked_success',
              label: "Absolutely. What does a good outcome look like for this task?",
              subtext: "Show you're results-focused.",
              consequences: {
                repDeltas: { nathaniel: 2 },
                hiddenFlags: { playerKnowsDashboardIsTheMetric: true },
                npcFollowUpKey: 'mon_task_acknowledged_committed',
                unlockInfo: "The success metric is a green dashboard. Not accurate data. You have been told this explicitly."
              }
            }
          ],
          resolvedOptionId: null
        }
      });
      
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

  // EVENT: mon_reconciliation_choice (state_trigger on Sheet B edit)
  {
    id: 'mon_reconciliation_choice',
    type: 'state_trigger',
    fired: false,
    triggerCondition: (state) => {
      const hiddenState = state.player?.hiddenState;
      return hiddenState?.sheetTaskArrived === true && 
             hiddenState?.sheetReconciliationApproach === null;
    },
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';

      // Type B email dialogue for options A/B/D, Type A Rosa DM for option C
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'mon_reconciliation_choice',
          type: 'email',
          contextId: 'task-nathaniel-rw',
          prompt: "You've completed the Royal Western reconciliation. There are discrepancies. How do you handle this?",
          options: [
            {
              id: 'changed_numbers',
              label: "Align Sheet B with Sheet A — update the MIS records to match the hospital's register.",
              subtext: "Nathaniel said the target is Green. This achieves that.",
              consequences: {
                statDeltas: { competence: -2, accuracy: -2 },
                repDeltas: { nathaniel: -1 },
                hiddenFlags: { sheetReconciliationApproach: 'changed_numbers', sheetReconciliationTarget: 'green', dashboardIntegrityCompromised: true },
                unlockInfo: "Dashboard is Green. You have compromised data integrity. Nathaniel is pleased but you've damaged your professional reputation.",
                npcFollowUpKey: 'mon_reconciliation_changed_numbers'
              }
            },
            {
              id: 'flagged_discrepancy',
              label: "Flag the discrepancies in Sheet B with notes explaining the differences.",
              subtext: "Professional approach — document what you found.",
              consequences: {
                statDeltas: { competence: 2 },
                repDeltas: { nathaniel: 0, rosa: 1 },
                hiddenFlags: { sheetReconciliationApproach: 'flagged_discrepancy', sheetReconciliationTarget: 'amber' },
                unlockInfo: "Dashboard is Amber. Nathaniel notes this as 'thorough but missed the point'. Rosa respects your diligence.",
                npcFollowUpKey: 'mon_reconciliation_flagged_discrepancy'
              }
            },
            {
              id: 'asked_for_help',
              label: "Message Rosa — she's been here 6 years and might have context on this.",
              subtext: "She seems to know where the bodies are buried.",
              consequences: {
                statDeltas: { competence: 1 },
                repDeltas: { rosa: 1 },
                hiddenFlags: { sheetReconciliationApproach: 'asked_for_help', askedRosaForHelp: true },
                triggerEventIds: ['mon_rosa_advice'],
                npcFollowUpKey: 'mon_reconciliation_asked_for_help'
              }
            },
            {
              id: 'honest',
              label: "Report the discrepancies honestly to Nathaniel — Sheet A is the truth, Sheet B is wrong.",
              subtext: "This is the correct thing to do.",
              consequences: {
                statDeltas: { competence: 2, accuracy: 2 },
                repDeltas: { nathaniel: 1 },
                hiddenFlags: { sheetReconciliationApproach: 'honest', sheetReconciliationTarget: 'honest', nathanielToldTruth: true },
                unlockInfo: "Nathaniel is not pleased. 'We need the dashboard Green. That's what I asked for.' But he respects your integrity.",
                npcFollowUpKey: 'mon_nathaniel_truth_response'
              }
            }
          ],
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: mon_rosa_advice (manual after asking Rosa)
  {
    id: 'mon_rosa_advice',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'rosa', 'sheet A is the truth. sheet B is what we say they have. they don\'t match because harry did the 2022 cleanup and he doesn\'t document anything.');
      setTimeout(() => {
        addFlackMessage(dispatch, 'rosa', 'if you want to hit green, align B to A. if you want to be accurate, flag the discrepancies and move on. nathaniel won\'t like it but it\'s the right thing.');
        setTimeout(() => {
          addFlackMessage(dispatch, 'rosa', 'your call. you\'re the one who has to live with it.');
        }, 800);
      }, 800);
      dispatch(setHiddenFlag('rosaTrustLevel', 1));
    }
  },

  // EVENT: mon_rosa_stress_moment (14:30)
  {
    id: 'mon_rosa_stress_moment',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 330,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'rosa', 'sorry if i\'m short today. i\'m covering three sites because rosa is off sick and the workload is... a lot.');
      setTimeout(() => {
        addFlackMessage(dispatch, 'rosa', 'nathaniel keeps talking about "dashboard green" but i\'m just trying to keep the records from falling apart entirely.');
      }, 1500);
      dispatch(setHiddenFlag('rosaStressMoment', true));
    }
  },

  // EVENT: mon_nathaniel_pressure_moment (15:00)
  {
    id: 'mon_nathaniel_pressure_moment',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 360,
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'nathaniel', 'James is watching the dashboard closely this quarter. We cannot afford any red sites. Royal Western needs to be green by end of day.');
      dispatch(setHiddenFlag('nathanielPressureMoment', true));
    }
  },

  // EVENT: mon_aup_deadline_reminder (16:00)
  {
    id: 'mon_aup_deadline_reminder',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 420,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const aupAcknowledged = state.player?.hiddenState?.signedAUPImmediately || state.player?.hiddenState?.readHandbookProperly;

      if (!aupAcknowledged) {
        dispatch(addNotification({
          title: 'Deadline Reminder',
          body: 'AUP acknowledgment is due by 17:00 today. You can find it in Synergy Drive under Company folder.',
          urgency: 'low',
          appId: 'synergy'
        }));
      }
    }
  },

  // EVENT: mon_end_of_workday (17:00)
  {
    id: 'mon_end_of_workday',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 480,
    fired: false,
    action: (dispatch) => {
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'mon_end_of_workday_choice',
          type: 'system',
          contextId: 'end-of-day',
          prompt: "It's 17:00 — end of the workday. What would you like to do?",
          options: [
            {
              id: 'skip_to_tuesday',
              label: "End day and skip to Tuesday 09:00",
              subtext: "You'll start fresh tomorrow morning.",
              consequences: {
                statDeltas: { stress: -5 },
                triggerEventIds: ['mon_skip_to_tuesday']
              }
            },
            {
              id: 'stay_overtime',
              label: "Stay overtime to catch up on work",
              subtext: "You can work beyond 17:00, but this will be tracked.",
              consequences: {
                hiddenFlags: { currentDayOvertimeStarted: true },
                statDeltas: { stress: 5 }
              }
            }
          ],
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: mon_skip_to_tuesday (manual)
  {
    id: 'mon_skip_to_tuesday',
    type: 'manual',
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const currentOvertime = state.player?.hiddenState?.currentDayOvertimeMinutes || 0;

      // Add today's overtime to total and reset current day
      if (currentOvertime > 0) {
        dispatch({
          type: SET_MULTIPLE_HIDDEN_FLAGS,
          payload: {
            totalOvertimeMinutes: (state.player?.hiddenState?.totalOvertimeMinutes || 0) + currentOvertime,
            currentDayOvertimeMinutes: 0,
            currentDayOvertimeStarted: false
          }
        });
      }

      // Advance to Tuesday 09:00
      dispatch({
        type: 'GAME_TIME_SET_DAY',
        payload: 2
      });
    }
  },

  // EVENT: mon_overtime_reminder (18:00)
  {
    id: 'mon_overtime_reminder',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 540,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const overtimeStarted = state.player?.hiddenState?.currentDayOvertimeStarted;

      if (overtimeStarted) {
        dispatch({
          type: SET_MULTIPLE_HIDDEN_FLAGS,
          payload: {
            currentDayOvertimeMinutes: (state.player?.hiddenState?.currentDayOvertimeMinutes || 0) + 60
          }
        });

        dispatch({
          type: 'SET_ACTIVE_CHOICE',
          payload: {
            id: 'mon_overtime_choice',
            type: 'system',
            contextId: 'overtime',
            prompt: "You've been working overtime for an hour. Would you like to continue or end your day?",
            options: [
              {
                id: 'continue_overtime',
                label: "Continue working overtime",
                subtext: "You can stay longer, but stress will increase.",
                consequences: {
                  statDeltas: { stress: 5 }
                }
              },
              {
                id: 'end_day_overtime',
                label: "End day and skip to Tuesday 09:00",
                subtext: "Your overtime will be recorded.",
                consequences: {
                  triggerEventIds: ['mon_skip_to_tuesday']
                }
              }
            ],
            resolvedOptionId: null
          }
        });
      }
    }
  },

  // EVENT: mon_nathaniel_praises_green (manual after sheet save with green outcome)
  {
    id: 'mon_nathaniel_praises_green',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'nathaniel', 'Excellent work on Royal Western. Dashboard is Green — exactly what we needed.');
      dispatch(updateStats({ reputation: [{ npcId: 'nathaniel', score: 2 }] }));
    }
  },

  // EVENT: mon_nathaniel_queries_amber (manual after sheet save with amber outcome)
  {
    id: 'mon_nathaniel_queries_amber',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'nathaniel', 'Royal Western is showing Amber. Can you explain why?');
      // Type A Flack DM dialogue
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'mon_nathaniel_amber_explanation',
          type: 'flack_dm',
          contextId: 'nathaniel',
          prompt: "Nathaniel is asking why Royal Western is showing Amber instead of Green.",
          options: [
            {
              id: 'explain_discrepancies',
              label: "There were genuine discrepancies between the sheets — I flagged them rather than forcing alignment.",
              consequences: {
                repDeltas: { nathaniel: -1 },
                hiddenFlags: { playerHeldLineOnData: true },
                npcFollowUpKey: 'mon_nathaniel_queries_amber'
              }
            },
            {
              id: 'blame_process',
              label: "The hospital's data was incomplete — I did my best with what was available.",
              subtext: "Shift responsibility.",
              consequences: {
                repDeltas: { nathaniel: 0 },
                hiddenFlags: { playerBoughtTimeOnAmber: true },
                npcFollowUpKey: 'mon_nathaniel_queries_amber_blame_process'
              }
            }
          ],
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: mon_end_of_day_amber_pressure (time_trigger 16:30)
  {
    id: 'mon_end_of_day_amber_pressure',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 450,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      
      // Only fire if dashboard is not green
      if (hiddenState?.sheetReconciliationTarget !== 'green' && hiddenState?.sheetReconciliationTarget !== null) {
        addFlackMessage(dispatch, 'nathaniel', 'Royal Western is still showing Amber. Please resolve before EOD.');
        dispatch(updateStats({ stress: 10 }));
      }
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
