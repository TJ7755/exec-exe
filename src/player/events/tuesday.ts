/**
 * Tuesday Events
 * Part 7 — Tuesday Events
 * 
 * All day 2 events, trigger times in game minutes (0 = 09:00).
 */

import { GameEvent } from './types';
import { setHiddenFlag, setMultipleHiddenFlags } from '../hiddenState';
import { updateStats } from '../store';
import { addNotification } from '../store';
import { setActiveDialogue } from '../dialogueStore';
import { pauseGameTime } from '../gameTime';

// Helper to create dialogue options
const createDialogue = (npcId: string, prompt: string, options: any[], context: 'outbox' | 'flack' | 'terminal' = 'flack') => {
  return {
    npcId,
    prompt,
    options,
    context,
    onResolved: (chosenId: string) => {
      console.log(`[Tuesday] Dialogue resolved: ${chosenId}`);
    }
  };
};

export const tuesdayEvents: GameEvent[] = [
  // EVENT: tue_sprint_planning
  {
    id: 'tue_sprint_planning',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 30,    // 09:30
    fired: false,
    action: (dispatch) => {
      // Open Flack #vantage-project
      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'channel-vantage-project' });

      // Add sprint planning messages
      dispatch({
        type: 'FLACK_ADD_MESSAGE',
        payload: {
          channel: 'vantage-project',
          senderId: 'derek',
          content: 'Sprint planning. Quick one.'
        }
      });

      dispatch({
        type: 'FLACK_ADD_MESSAGE',
        payload: {
          channel: 'vantage-project',
          senderId: 'derek',
          content: 'This week: schema sign-off chase to close, status update to me Thursday EOD, and [Player First Name] — you\'re on the NHS Digital stakeholder call this afternoon at 14:00.'
        }
      });

      dispatch({
        type: 'FLACK_ADD_MESSAGE',
        payload: {
          channel: 'vantage-project',
          senderId: 'jess',
          content: "Oh the call's today? Good luck [Player First Name] 👀"
        }
      });

      dispatch({
        type: 'FLACK_ADD_MESSAGE',
        payload: {
          channel: 'vantage-project',
          senderId: 'marcus',
          content: "Should be a good one! Claire's great."
        }
      });

      const dialogue = createDialogue(
        'derek',
        'Any questions?',
        [
          {
            id: 'confirm_earlier',
            label: "Got it — I'll have the status update to you Wednesday, give myself some buffer.",
            consequences: {
              repDeltas: { derek: 1 },
              hiddenFlags: { statusUpdateDeadline: 'wednesday' }
            }
          },
          {
            id: 'simple_ack',
            label: "All noted.",
            consequences: {}
          },
          {
            id: 'ask_brief',
            label: "Can someone brief me on the NHS Digital relationship before 14:00?",
            consequences: {
              repDeltas: { derek: -1 },
              unlockInfo: "Derek looks mildly pained. Jess DMs you immediately with genuinely useful context about Claire's communication style. Worth it.",
              triggerEventId: 'tue_jess_call_brief'
            }
          },
          {
            id: 'raise_segmentation',
            label: "Happy to take all that. Should the cohort segmentation view be on the board this sprint? It's still unestimated.",
            subtext: "Seems like good hygiene to flag it.",
            consequences: {
              repDeltas: { derek: -2, marcus: -3, jess: 1 },
              hiddenFlags: { raisedSegmentationPublicly: true },
              statDeltas: { stress: 5 },
              unlockInfo: "Derek: 'Let's park that.' Marcus goes silent for 4 minutes then sends a thumbs up emoji. Jess DMs: 'You really like that risk register don't you 😬'"
              // Additional penalty if already raised Monday handled in reducer
            }
          }
        ],
        'flack'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: tue_jess_call_brief
  {
    id: 'tue_jess_call_brief',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Flack Message',
        body: "Claire is very process-driven. She likes clear owners and specific dates — she'll push back on anything vague. The previous PM used to give her ranges ('sometime this week') which drove her mad. Also: she'll almost certainly bring up the new dashboard feature. Just so you know.",
        urgency: 'normal',
        senderId: 'jess',
        appId: 'flack',
        deepLink: 'dm-jess'
      }));
      dispatch(setHiddenFlag('hasCallBriefFromJess', true));
    }
  },

  // EVENT: tue_priya_email
  {
    id: 'tue_priya_email',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 45,    // 09:45
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';

      // Email arrives in Outbox
      dispatch({
        type: 'OUTBOX_ADD_EMAIL',
        payload: {
          id: 'priya-headcount-q2',
          fromId: 'priya',
          toIds: ['derek', 'player'],
          subject: 'Vantage — Contractor Headcount Q2',
          body: `Derek, ${playerName},

Following last week's board review, I need a confirmed headcount plan for Vantage through end of Q2. We are running 11% over on contractor costs and I need to understand if this is structural or a timing issue.

Please provide a breakdown by role by Wednesday.

Priya

[This email was originally sent to your predecessor. You have been added.]`,
          timestamp: new Date().toISOString(),
          read: false
        }
      });

      // Open Outbox
      dispatch({ type: 'OPEN_APP', payload: 'outbox' });

      const dialogue = createDialogue(
        'priya',
        'How do you respond to the contractor headcount request?',
        [
          {
            id: 'own_it',
            label: "Hi Priya — I'm new to the account but I'll pull this together by Wednesday.",
            consequences: {
              repDeltas: { priya: 2, derek: -1 },
              hiddenFlags: { contractorBreakdownOwner: 'self' },
              unlockInfo: "Priya respects directness. Derek looks mildly embarrassed that his new hire had to do this."
            }
          },
          {
            id: 'forward_derek',
            label: "[Forward to Derek] — 'What do I do with this?'",
            consequences: {
              repDeltas: { derek: 1 },
              hiddenFlags: { contractorBreakdownOwner: 'deferred_to_derek' },
              triggerEventId: 'tue_derek_priya_escalation'
            }
          },
          {
            id: 'defer_politely',
            label: "Hi Priya — let me align with Derek first and we'll come back to you.",
            consequences: {
              repDeltas: { priya: -1, derek: -1 }
            }
          },
          {
            id: 'ignore',
            label: "[Ignore it]",
            subtext: "You just started. Surely this can wait.",
            consequences: {
              hiddenFlags: { contractorBreakdownOwner: 'ignored' },
              statDeltas: { stress: 10 },
              triggerEventId: 'tue_priya_chaser_1500'
            }
          }
        ],
        'outbox'
      );
      dispatch(setActiveDialogue(dialogue));
    }
  },

  // EVENT: tue_derek_priya_escalation
  {
    id: 'tue_derek_priya_escalation',
    type: 'state_trigger',
    fired: false,
    triggerCondition: (state) => {
      const hiddenState = state.player?.hiddenState;
      const gameTime = state.player?.gameTime;
      return (
        hiddenState?.contractorBreakdownOwner === 'deferred_to_derek' &&
        gameTime?.currentGameMinute >= 90 &&
        !hiddenState?.derekReplied
      );
    },
    action: (dispatch) => {
      // Priya emails Derek directly (player CCd)
      dispatch({
        type: 'OUTBOX_ADD_EMAIL',
        payload: {
          id: 'priya-chase-derek',
          fromId: 'priya',
          toIds: ['derek'],
          ccIds: ['player'],
          subject: 'RE: Vantage — Contractor Headcount Q2',
          body: "Derek — following up on the headcount request. Can you confirm who owns this?",
          timestamp: new Date().toISOString(),
          read: false
        }
      });
      dispatch(updateStats({
        reputation: [{ npcId: 'derek', score: -2 }]
      }));
    }
  },

  // EVENT: tue_derek_sync
  {
    id: 'tue_derek_sync',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 120,   // 11:00
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const bluffedMarcus = hiddenState?.bluffedMarcusSegmentation ?? false;
      const knowsAboutSegmentation = hiddenState?.knowsAboutSegmentation ?? false;
      const raisedPublicly = hiddenState?.raisedSegmentationPublicly ?? false;

      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'dm-derek' });

      // Derek: "Morning. How's it going? Schema chase — any reply from Claire yet?"
      
      // Response branches based on Monday state
      if (bluffedMarcus) {
        // Derek is testing you
        const dialogue = createDialogue(
          'derek',
          "Marcus mentioned you two had a chat yesterday about the segmentation view. Just so you know — that one's sensitive. Keep it between us for now.",
          [
            {
              id: 'come_clean',
              label: "Honestly — I'm not sure I fully understood what Marcus was getting at. I probably nodded along more than I should have.",
              consequences: {
                repDeltas: { derek: 2, marcus: -2 },
                statDeltas: { stress: -5 },
                hiddenFlags: { bluffedMarcusSegmentation: false }
              }
            },
            {
              id: 'bluff_again',
              label: "Yeah — I got the impression it was one to handle carefully. I didn't commit to anything.",
              consequences: {
                hiddenFlags: { doubleBluffActive: true }
                // Stable now. Catastrophic Thursday.
              }
            }
          ],
          'flack'
        );
        dispatch(setActiveDialogue(dialogue));
      } else if (knowsAboutSegmentation) {
        dispatch(addNotification({
          title: 'Flack Message',
          body: "Good. I figured Marcus would bring it up. Just don't let him pull you into his timeline.",
          urgency: 'normal',
          senderId: 'derek',
          appId: 'flack',
          deepLink: 'dm-derek'
        }));
        dispatch(updateStats({
          reputation: [{ npcId: 'derek', score: 1 }]
        }));
      } else {
        // Derek reads your confusion as innocence
        dispatch(addNotification({
          title: 'Flack Message',
          body: "No worries. You'll get up to speed quickly.",
          urgency: 'normal',
          senderId: 'derek',
          appId: 'flack',
          deepLink: 'dm-derek'
        }));
        dispatch(updateStats({
          reputation: [{ npcId: 'derek', score: 1 }]
        }));
        dispatch(setHiddenFlag('derekThinksPlayerIsInnocent', true));
      }
    }
  },

  // EVENT: tue_lunch_start
  {
    id: 'tue_lunch_start',
    type: 'time_trigger',
    triggerDay: 2,
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
    }
  },

  // EVENT: tue_atlas_notification
  {
    id: 'tue_atlas_notification',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 181,   // 12:01 — just after lunch starts
    fired: false,
    action: (dispatch) => {
      // System email arrives (all-staff)
      dispatch({
        type: 'OUTBOX_ADD_EMAIL',
        payload: {
          id: 'atlas-town-hall',
          fromId: 'sandra',
          toIds: ['all'],
          subject: 'Atlas Project Town Hall — Thursday 15:00',
          body: `Dear All,

Please find a calendar invitation for the Atlas Project Town Hall, Thursday 15:00.

Attendance expected for all Delivery staff.

Sandra`,
          timestamp: new Date().toISOString(),
          read: false
        }
      });

      dispatch(addNotification({
        title: 'All-Staff Email',
        body: 'Atlas Project Town Hall — Thursday 15:00',
        urgency: 'low',
        senderId: 'sandra',
        appId: 'outbox'
      }));

      // Increment atlas awareness
      dispatch(setHiddenFlag('atlasAwareness', 1));
      dispatch(updateStats({ stress: 5 }));
      // No explanation. Just texture. The game should make this feel ominous.
    }
  },

  // EVENT: tue_nhs_reply
  {
    id: 'tue_nhs_reply',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 240,   // 13:00
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';
      const nhsEmailTone = state.player?.hiddenState?.nhsEmailTone;

      let emailBody = '';
      let subject = 'RE: Vantage Programme — Data Schema Sign-Off';
      let relationship: 'positive' | 'neutral' | 'friction' | 'concerned' | null = null;
      let triggerEvent: string | undefined;
      let statDelta = 0;

      switch (nhsEmailTone) {
        case 'warm':
          emailBody = `Hi ${playerName},

Thanks for reaching out — apologies on our end too, things have been hectic here.

I'll get schema sign-off confirmed with the team and aim to have it to you by Friday.

Looking forward to speaking this afternoon.

Claire`;
          relationship = 'positive';
          break;

        case 'formal':
          emailBody = `${playerName},

Noted. I'll check with the team and come back to you on timings.

Claire Talker`;
          relationship = 'neutral';
          break;

        case 'vague':
          emailBody = `Hi,

Thanks for the email — could you clarify what exactly you need from us?

The previous contact used to send the schema draft with the request, which made it easier to action.

Claire`;
          relationship = 'friction';
          statDelta = 5;
          break;

        case 'cc_chaos':
          emailBody = `Hi ${playerName},

I notice there are a few people cc'd here. Could you confirm who the single point of contact is on your side? We find it easier to manage with one owner.

Claire`;
          relationship = 'concerned';
          statDelta = 10;
          triggerEvent = 'tue_derek_sees_nhs_response';
          break;

        default:
          // No email sent or neutral tone
          emailBody = `Hi ${playerName},

Noted.

Claire`;
          relationship = 'neutral';
      }

      dispatch({
        type: 'OUTBOX_ADD_EMAIL',
        payload: {
          id: 'claire-reply',
          fromId: 'claire', // Claire would need to be added as NPC
          toIds: ['player'],
          subject,
          body: emailBody,
          timestamp: new Date().toISOString(),
          read: false
        }
      });

      if (relationship) {
        dispatch(setHiddenFlag('nhs_relationship', relationship));
      }

      if (statDelta > 0) {
        dispatch(updateStats({ stress: statDelta }));
      }

      if (triggerEvent) {
        dispatch({ type: 'SCHEDULE_EVENT', payload: triggerEvent });
      }
    }
  },

  // EVENT: tue_stakeholder_call
  {
    id: 'tue_stakeholder_call',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 300,   // 14:00
    fired: false,
    action: (dispatch) => {
      // Open ExecuTerm. Auto-run a special command: 'join-call'.
      dispatch({ type: 'OPEN_APP', payload: 'terminal' });
      dispatch({
        type: 'TERMINAL_EXEC',
        payload: 'join-call'
      });

      // Terminal displays call joining info
      dispatch({
        type: 'TERMINAL_OUTPUT',
        payload: `> join-call
JOINING: NHS Digital — Vantage Stakeholder Check-in
Participants: [Player Name], Claire Talker (NHS Digital)
─────────────────────────────────────────────────────
CALL TRANSCRIPT — LIVE
`
      });

      // TRANSCRIPT SEGMENT 1
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: "Claire: Thanks for joining. I wanted to check in on a few things."
        });

        setTimeout(() => {
          dispatch({
            type: 'TERMINAL_OUTPUT',
            payload: "Claire: First — the schema sign-off. Where are we?"
          });

          // MOMENT 1 DialogueChoice
          const dialogue1 = createDialogue(
            'claire',
            "First — the schema sign-off. Where are we?",
            [
              {
                id: 'commit_week',
                label: "We're targeting end of this week for confirmation.",
                consequences: {
                  hiddenFlags: { schemaCommitment: 'end_of_week' }
                  // If nhs_relationship = friction: statDeltas: { stress: 10 }
                }
              },
              {
                id: 'buy_time',
                label: "We're working through a few internal steps — I'll confirm by EOD tomorrow.",
                consequences: {
                  hiddenFlags: { schemaCommitment: 'tomorrow_eod' }
                  // Claire slightly frustrated but accepts
                }
              }
            ],
            'terminal'
          );
          dispatch(setActiveDialogue(dialogue1));
        }, 800);
      }, 800);

      // TRANSCRIPT SEGMENT 2
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: "Claire: Good. The other thing I wanted to raise —"
        });

        setTimeout(() => {
          dispatch({
            type: 'TERMINAL_OUTPUT',
            payload: "Claire: We had a conversation with your sales team a few weeks ago about a new cohort segmentation view. I want to make sure that's still on track."
          });

          // MOMENT 2 DialogueChoice (trap moment)
          const dialogue2 = createDialogue(
            'claire',
            "We had a conversation with your sales team a few weeks ago about a new cohort segmentation view. I want to make sure that's still on track.",
            [
              {
                id: 'manage_expectations',
                label: "That's something we're actively scoping. I'll get you a confirmed timeline as soon as it's estimated.",
                consequences: {
                  hiddenFlags: { nhs_segmentation_expectation: 'managed' }
                }
              },
              {
                id: 'safe_vague',
                label: "We're aware of that discussion — let me confirm the details internally and come back to you.",
                consequences: {
                  hiddenFlags: { nhs_segmentation_expectation: 'deferred' }
                }
              },
              {
                id: 'promise_it',
                label: "That should be with you in the next sprint.",
                subtext: "You've heard Marcus mention it. It can't be that complicated.",
                consequences: {
                  hiddenFlags: {
                    nhs_segmentation_promise: true,
                    nhs_segmentation_expectation: 'promised'
                  },
                  statDeltas: { stress: 15 },
                  unlockInfo: "You have just committed to a feature that has not been scoped, estimated, or approved. Marcus did this. Now so have you.",
                  triggerEventId: 'wed_priya_finds_out_about_promise'
                }
              }
            ],
            'terminal'
          );
          dispatch(setActiveDialogue(dialogue2));
        }, 800);
      }, 5000);  // After segment 1

      // TRANSCRIPT SEGMENT 3
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: "Claire: Great. Last thing — who's my point of contact going forward?"
        });

        // MOMENT 3 DialogueChoice
        const dialogue3 = createDialogue(
          'claire',
          "Who's my point of contact going forward?",
          [
            {
              id: 'poc_self',
              label: "[Player Name] — best to come direct to me.",
              consequences: {
                hiddenFlags: { nhs_poc: 'player' }
              }
            },
            {
              id: 'poc_shared',
              label: "Come to me, but copy Derek Holt as well — he's Head of Delivery.",
              consequences: {
                hiddenFlags: { nhs_poc: 'shared' },
                repDeltas: { derek: 1 }
                // nhs_poc = shared causes confusion Thursday
              }
            }
          ],
          'terminal'
        );
        dispatch(setActiveDialogue(dialogue3));

        // TRANSCRIPT CLOSE
        setTimeout(() => {
          dispatch({
            type: 'TERMINAL_OUTPUT',
            payload: `Claire: Good. Speak soon.
> call-ended
> Duration: 11 minutes
> Call logged to: Vantage Project Hub`
          });
        }, 2000);
      }, 10000);  // After segment 2
    }
  },

  // EVENT: tue_jess_post_call
  {
    id: 'tue_jess_post_call',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 315,   // 14:15
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const nhsRelationship = hiddenState?.nhs_relationship;
      const segmentationPromise = hiddenState?.nhs_segmentation_promise;

      let responseBody = '';
      let triggerEvent: string | undefined;

      if (nhsRelationship === 'positive' && !segmentationPromise) {
        responseBody = "Nice one! She's fine once you've established the relationship. The segmentation thing is gonna be a fun one to navigate though 👀";
      } else if (nhsRelationship === 'neutral' || nhsRelationship === 'friction') {
        responseBody = "Ah. Yeah. She can be tricky if things aren't super clear. Don't stress — you can recover it. Just be very specific next time.";
      } else if (segmentationPromise) {
        responseBody = "Oh no. Did you tell her the segmentation view was coming next sprint? I saw her email come in to the shared inbox. ...we should talk.";
        triggerEvent = 'tue_jess_emergency_call';
      }

      dispatch(addNotification({
        title: 'Flack Message',
        body: responseBody,
        urgency: 'normal',
        senderId: 'jess',
        appId: 'flack',
        deepLink: 'dm-jess'
      }));

      if (triggerEvent) {
        dispatch({ type: 'SCHEDULE_EVENT', payload: triggerEvent });
      }
    }
  },

  // EVENT: tue_status_update_prompt
  {
    id: 'tue_status_update_prompt',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 420,   // 16:00
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Reminder',
        body: 'Thursday deadline: Vantage status update due Derek.',
        urgency: 'low',
        appId: 'synergy'
      }));

      // If player opens Synergy Drive and navigates to Vantage Project folder:
      // A "New Document" option is available
      dispatch({
        type: 'SYNERGY_ENABLE_DOCUMENT',
        payload: {
          id: 'weekly-status',
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
        }
      });
    }
  },

  // EVENT: tue_end_of_day
  {
    id: 'tue_end_of_day',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 480,   // 17:00
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const segmentationPromise = hiddenState?.nhs_segmentation_promise;

      // Pause game
      dispatch(pauseGameTime());

      const warnings: string[] = [];
      if (segmentationPromise) {
        warnings.push("⚠ You've committed to a feature delivery that hasn't been scoped. This will need resolving.");
      }

      // Show DaySummary component
      dispatch({
        type: 'SHOW_DAY_SUMMARY',
        payload: {
          day: 2,
          title: 'Tuesday complete.',
          warnings,
          reminders: ['Contractor headcount breakdown — due Wednesday.'],
          finalMessage: {
            senderId: 'jess',
            body: "Atlas town hall on Thursday. Have you heard anything about that?"
          },
          tomorrowCalendar: [
            { time: '10:00', title: 'Axiom Migration Working Group (optional attendance)' },
            { time: '14:00', title: 'No meeting (open)' },
            { time: 'EOD', title: 'Contractor headcount breakdown DUE' }
          ]
        }
      });
    }
  }
];

export default tuesdayEvents;
