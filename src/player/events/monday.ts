/**
 * Monday Events
 * Part 6 — Monday Events
 * 
 * All day 1 events, trigger times in game minutes (0 = 09:00).
 */

import { GameEvent } from './types';
import { setHiddenFlag, setMultipleHiddenFlags } from '../hiddenState';
import { updateStats } from '../store';
import { addNotification } from '../store';
import { setActiveDialogue } from '../dialogueStore';
import { pauseGameTime, resumeGameTime } from '../gameTime';

// Helper to create dialogue options
const createDialogue = (npcId: string, prompt: string, options: any[], context: 'outbox' | 'flack' = 'flack') => {
  return {
    npcId,
    prompt,
    options,
    context,
    onResolved: (chosenId: string) => {
      console.log(`[Monday] Dialogue resolved: ${chosenId}`);
    }
  };
};

export const mondayEvents: GameEvent[] = [
  // EVENT: mon_synergy_delay
  {
    id: 'mon_synergy_delay',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 15,    // 09:15
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'IT Update',
        body: 'Synergy Drive access delayed. Carl is on it. ETA 10:00.',
        urgency: 'normal',
        appId: 'synergy'
      }));
      dispatch(setHiddenFlag('synergyCarlDelayed', true));
    }
  },

  // EVENT: mon_hr_email_choice
  {
    id: 'mon_hr_email_choice',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 30,    // 09:30
    fired: false,
    action: (dispatch) => {
      // Open Outbox and highlight Sandra's onboarding email
      dispatch({ type: 'OPEN_APP', payload: 'outbox' });
      
      // Attach DialogueChoice for handbook decision
      const dialogue = createDialogue(
        'sandra',
        "Sandra's email asks you to read and sign the Employee Handbook before proceeding. The handbook is 34 pages.",
        [
          {
            id: 'sign_now',
            label: "Sign it now — you'll read it later.",
            consequences: {
              repDeltas: { derek: 1 },
              hiddenFlags: { signedHandbookImmediately: true },
              unlockInfo: "Derek can see you've completed onboarding tasks promptly."
            }
          },
          {
            id: 'read_first',
            label: "Read the whole thing first.",
            consequences: {
              triggerEventId: 'mon_handbook_reward',
              hiddenFlags: { readHandbook: true }
            }
          }
        ],
        'outbox'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: mon_handbook_reward
  {
    id: 'mon_handbook_reward',
    type: 'manual',   // only fires if option B chosen above
    fired: false,
    action: (dispatch) => {
      // At game minute 60 (10:00): Synergy Drive access notification arrives 10 mins early
      dispatch(addNotification({
        title: 'IT Update',
        body: "Access sorted. Found a quick route.",
        urgency: 'normal',
        senderId: 'carl'
      }));
      dispatch(setHiddenFlag('readHandbook', true));
    }
  },

  // EVENT: mon_derek_1to1
  {
    id: 'mon_derek_1to1',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 90,    // 10:30
    fired: false,
    cancelledBy: ['mon_hr_email_choice'],  // Delayed if handbook being read
    action: (dispatch) => {
      // Open Flack, navigate to Derek DM
      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'dm-derek' });

      const dialogue = createDialogue(
        'derek',
        `Morning — glad you're in. I'll keep this brief.

We've got a project called Vantage — NHS Digital contract, data analytics platform for patient cohort management. It's been running about 8 months. Good project, good client, just a few timeline pressures at the moment.

There's a schema sign-off we need from the NHS Digital side — it's been sitting for a bit. Previous PM had it in hand but... anyway. I'd like you to send a chaser today. Just a friendly nudge — their contact is Claire Talker, Programme Lead. Her email is c.talker@nhsdigital.nhs.uk.

How do you respond?`,
        [
          {
            id: 'committed',
            label: "Of course — I'll send it this morning.",
            consequences: {
              repDeltas: { derek: 2 },
              hiddenFlags: { derekFirstTaskApproach: 'committed' }
            }
          },
          {
            id: 'ask_context',
            label: "Happy to. Any context I should know first?",
            consequences: {
              repDeltas: { derek: 1 },
              hiddenFlags: { derekFirstTaskApproach: 'asked_context' },
              unlockInfo: "Derek explains the previous PM left 3 weeks ago. Nobody has chased since. He doesn't frame this as a problem.",
              triggerEventId: 'mon_jess_flagged_as_resource'
            }
          },
          {
            id: 'looped_jess',
            label: "Sure. Is Jess looped in on this one too?",
            consequences: {
              repDeltas: { derek: 0, jess: 1 },
              hiddenFlags: { derekFirstTaskApproach: 'looped_jess' }
            }
          }
        ],
        'flack'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: mon_jess_flagged_as_resource
  {
    id: 'mon_jess_flagged_as_resource',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // After derek_1to1 resolves with option B:
      // Jess sends DM unprompted 5 game minutes later
      dispatch(addNotification({
        title: 'Flack Message',
        body: "Hey! Derek mentioned you might have questions about Vantage. Happy to help — been on it since the start. What do you need?",
        urgency: 'normal',
        senderId: 'jess',
        appId: 'flack',
        deepLink: 'dm-jess'
      }));
      dispatch(setHiddenFlag('jessOfferedContext', true));
    }
  },

  // EVENT: mon_standup
  {
    id: 'mon_standup',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 120,   // 11:00
    fired: false,
    action: (dispatch) => {
      // Open Flack, navigate to #vantage-project
      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'channel-vantage-project' });

      // Add standup messages (these would be added to the channel state)
      dispatch({
        type: 'FLACK_ADD_MESSAGE',
        payload: {
          channel: 'vantage-project',
          senderId: 'derek',
          content: 'Standup. Quick one today.'
        }
      });

      const dialogue = createDialogue(
        'derek',
        'Do you say anything?',
        [
          {
            id: 'introduce',
            label: "Thanks everyone — looking forward to getting stuck in.",
            consequences: {
              repDeltas: { jess: 1 }
            }
          },
          {
            id: 'observe',
            label: "[Stay quiet]",
            consequences: {
              hiddenFlags: { observedMarcusDerekDynamic: true },
              unlockInfo: "You notice Marcus checks Derek's reaction before speaking. Derek doesn't acknowledge it."
            }
          },
          {
            id: 'ask_timeline',
            label: "Quick question — what's the current state of the timeline?",
            consequences: {
              repDeltas: { derek: -1 },
              unlockInfo: "Derek says 'a few weeks behind but manageable.' Marcus says nothing. You've been told less than the risk register shows."
            }
          },
          {
            id: 'raise_risk',
            label: "I had a look at the risk register — should we talk about the schedule gap? Seems like there are a few open items.",
            subtext: "You've done your homework. Surely that's good?",
            consequences: {
              repDeltas: { derek: -2, marcus: -2, jess: 1 },
              hiddenFlags: { raisedSegmentationPublicly: true },
              unlockInfo: "Derek says 'let's park that.' Marcus goes quiet. Jess sends you a DM 2 minutes later: 'Brave. Derek hates surprises in standups.'"
            }
          }
        ],
        'flack'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: mon_synergy_wrong_access
  {
    id: 'mon_synergy_wrong_access',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 180,   // 12:00 — start of lunch
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Synergy Drive',
        body: 'Synergy Drive access provisioned — view only. Edit access pending approval.',
        urgency: 'low',
        appId: 'synergy'
      }));

      // Toast from Carl 30 seconds later (real time)
      setTimeout(() => {
        dispatch(addNotification({
          title: 'Carl Briggs',
          body: "Hi, view access is live. Edit access needs sign-off from Derek. Should be today.",
          urgency: 'low',
          senderId: 'carl'
        }));
      }, 30000);
    }
  },

  // EVENT: mon_lunch_start
  {
    id: 'mon_lunch_start',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 180,   // 12:00
    fired: false,
    action: (dispatch) => {
      // Lunch start notification
      dispatch(addNotification({
        title: 'Lunch Break',
        body: "It's 12:00. Time for lunch!",
        urgency: 'low',
        appId: 'calendar'
      }));

      // Jess DM arrives
      dispatch(addNotification({
        title: 'Flack Message',
        body: "Good first morning! Fair warning — the schema thing is a bit of a hot potato. Buy me a coffee sometime and I'll explain 😬",
        urgency: 'low',
        senderId: 'jess',
        appId: 'flack',
        deepLink: 'dm-jess'
      }));
      dispatch(updateStats({
        reputation: [{ npcId: 'jess', score: 1 }]
      }));
    }
  },

  // EVENT: mon_email_compose
  {
    id: 'mon_email_compose',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 240,   // 13:00
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const derekFirstTaskApproach = hiddenState?.derekFirstTaskApproach;

      // If Synergy Drive NOT yet opened AND derekFirstTaskApproach = 'committed'
      if (derekFirstTaskApproach === 'committed') {
        dispatch(addNotification({
          title: 'Derek Holt',
          body: "Just checking — chaser gone yet? Want to get it done before end of day.",
          urgency: 'normal',
          senderId: 'derek'
        }));
      }

      // Open a DialogueChoice in Outbox as a pre-compose decision
      const dialogue = createDialogue(
        'player',
        "You need to email Claire Talker at NHS Digital (c.talker@nhsdigital.nhs.uk) chasing the schema sign-off. How do you get her contact details?",
        [
          {
            id: 'ask_derek',
            label: "Ask Derek.",
            consequences: {
              repDeltas: { derek: -1 },
              unlockInfo: "Derek sends the details. His reply has a faint 'should have been in the handover' energy to it."
            }
          },
          {
            id: 'ask_jess',
            label: "Ask Jess.",
            consequences: {
              repDeltas: { jess: 1 },
              unlockInfo: "Jess replies immediately: 'Here you go. Heads up — last email to her was 6 weeks ago.'",
              hiddenFlags: { jessProvidedNHSContext: true, nhsContactSource: 'jess' }
            }
          },
          {
            id: 'search_intranet',
            label: "Search the intranet.",
            consequences: {
              hiddenFlags: { foundNHSContactIndependently: true },
              unlockInfo: "You find a project folder reference with her email. No rep change. Small competence signal stored."
            }
          }
        ],
        'outbox'
      );
      dispatch(setActiveDialogue(dialogue));

      // Then open Outbox compose window pre-populated
      dispatch({ type: 'OPEN_APP', payload: 'outbox' });
      dispatch({
        type: 'OUTBOX_COMPOSE',
        payload: {
          to: 'c.talker@nhsdigital.nhs.uk',
          subject: 'Vantage Programme — Data Schema Sign-Off'
        }
      });
    }
  },

  // EVENT: mon_marcus_dm
  {
    id: 'mon_marcus_dm',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 300,   // 14:00
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Flack Message',
        body: "Morning [Player First Name]! Good weekend? Did you get my email btw",
        urgency: 'normal',
        senderId: 'marcus',
        appId: 'flack',
        deepLink: 'dm-marcus'
      }));

      // [pause 2 real seconds] - handled by sequential messages
      setTimeout(() => {
        dispatch(addNotification({
          title: 'Flack Message',
          body: "Quick one — did Derek mention the cohort segmentation thing? Just want to make sure everyone's aligned 😊",
          urgency: 'normal',
          senderId: 'marcus',
          appId: 'flack',
          deepLink: 'dm-marcus'
        }));

        const dialogue = createDialogue(
          'marcus',
          "Did Derek mention the cohort segmentation thing? Just want to make sure everyone's aligned.",
          [
            {
              id: 'ask_what',
              label: "Not yet — what's the segmentation view?",
              consequences: {
                repDeltas: { marcus: 1 },
                hiddenFlags: { knowsAboutSegmentation: true },
                unlockInfo: "Marcus explains the client 'loves the idea' of a cohort segmentation dashboard. He's careful not to say he promised it. You now know more than Derek thinks you know."
              }
            },
            {
              id: 'play_dumb',
              label: "Not yet — still getting up to speed!",
              consequences: {
                triggerEventId: 'mon_marcus_retry_tomorrow'
              }
            },
            {
              id: 'signal_attention',
              label: "Derek mentioned timeline pressure — is the segmentation view part of that?",
              consequences: {
                hiddenFlags: { marcusKnowsYoureSharp: true },
                unlockInfo: "Marcus pivots. 'Ha — just making sure we're all singing from the same hymn sheet.' He knows you're paying attention."
              }
            },
            {
              id: 'bluff',
              label: "Yeah, Derek walked me through it — sounds like it's in hand.",
              subtext: "Seems easier than admitting you don't know.",
              consequences: {
                hiddenFlags: { bluffedMarcusSegmentation: true },
                repDeltas: { marcus: 1 },
                unlockInfo: "Marcus seems relieved. But you've both just agreed on something neither of you actually said. This will come up again."
              }
            }
          ],
          'flack'
        );
        dispatch(setActiveDialogue(dialogue));
      }, 2000);
    }
  },

  // EVENT: mon_email_tone_choice
  // This event fires after the player sends the email to Claire
  {
    id: 'mon_email_tone_choice',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // Set flag that email was sent
      dispatch(setHiddenFlag('nhsEmailSent', true));

      // DialogueChoice for email tone characterization
      const dialogue = createDialogue(
        'player',
        "How would you characterise the tone of your email?",
        [
          {
            id: 'formal',
            label: "Formal and professional.",
            consequences: {
              hiddenFlags: { nhsEmailTone: 'formal' }
            }
          },
          {
            id: 'warm',
            label: "Warm — acknowledged the delay, apologetic.",
            consequences: {
              hiddenFlags: { nhsEmailTone: 'warm' }
            }
          },
          {
            id: 'vague',
            label: "Vague — didn't commit to anything specific.",
            consequences: {
              hiddenFlags: { nhsEmailTone: 'vague' }
            }
          },
          {
            id: 'cc_chaos',
            label: "CC'd Derek and Marcus to show I'm on top of it.",
            subtext: "Keeps everyone in the loop.",
            consequences: {
              hiddenFlags: { nhsEmailTone: 'cc_chaos', internalConfusionSignalled: true },
              repDeltas: { derek: -2, marcus: -1 },
              unlockInfo: "Keeping people in the loop is good. Copying your manager and sales director on a first contact with a client you've never spoken to signals that nobody is in charge."
            }
          }
        ],
        'outbox'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: mon_carl_edit_access
  {
    id: 'mon_carl_edit_access',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 390,   // 15:30
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      
      // If Derek was asked to chase Carl (would need tracking state)
      const askedDerekToChase = false; // Placeholder - would check actual state

      if (askedDerekToChase) {
        dispatch(addNotification({
          title: 'Synergy Drive',
          body: 'Synergy Drive edit access granted.',
          urgency: 'low',
          appId: 'synergy'
        }));
        dispatch(setHiddenFlag('synergyEditAccess', true));
      } else {
        // No notification. Edit access not granted today.
        // State: synergyEditAccess = false going into Tuesday
        dispatch(setHiddenFlag('synergyEditAccess', false));
      }
    }
  },

  // EVENT: mon_derek_closeout
  {
    id: 'mon_derek_closeout',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 420,   // 16:00
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const nhsEmailSent = hiddenState?.nhsEmailSent ?? false;

      if (nhsEmailSent) {
        // Email was sent - automatic positive response
        dispatch(addNotification({
          title: 'Flack Message',
          body: "Great. Speak tomorrow.",
          urgency: 'normal',
          senderId: 'derek',
          appId: 'flack',
          deepLink: 'dm-derek'
        }));
        dispatch(updateStats({
          reputation: [{ npcId: 'derek', score: 1 }]
        }));
      } else {
        // Email was NOT sent - player must choose
        const dialogue = createDialogue(
          'derek',
          "Did the chaser go? All good?",
          [
            {
              id: 'admit',
              label: "Admit it hasn't gone yet.",
              consequences: {
                repDeltas: { derek: -2 },
                statDeltas: { stress: 10 },
                triggerEventId: 'tue_derek_chaser_morning'
              }
            },
            {
              id: 'lie',
              label: "Say it's in progress.",
              consequences: {
                hiddenFlags: { liedToDerekDay1: true },
                triggerEventId: 'tue_derek_finds_out'
              }
            }
          ],
          'flack'
        );
        dispatch(setActiveDialogue(dialogue));
      }
    }
  },

  // EVENT: mon_end_of_day
  {
    id: 'mon_end_of_day',
    type: 'time_trigger',
    triggerDay: 1,
    triggerGameMinute: 480,   // 17:00
    fired: false,
    action: (dispatch) => {
      // Game clock pauses
      dispatch(pauseGameTime());

      // Show end-of-day summary screen
      dispatch({
        type: 'SHOW_DAY_SUMMARY',
        payload: {
          day: 1,
          title: 'Monday complete.',
          tomorrowCalendar: [
            { time: '09:30', title: 'Sprint Planning, Vantage team, #vantage-project' },
            { time: '11:00', title: 'Quick sync with Derek (no agenda)' }
          ],
          finalMessage: {
            senderId: 'jess',
            body: "Survived day one then. It gets more interesting, I promise."
          }
        }
      });
    }
  }
];

export default mondayEvents;
