/**
 * Tuesday Events — Meridian Infrastructure Services
 * 
 * All day 2 events, trigger times in game minutes (0 = 09:00).
 */

import { GameEvent } from './types';
import { setHiddenFlag, SET_MULTIPLE_HIDDEN_FLAGS } from '../hiddenState';
import { updateStats, addNotification } from '../store';
import { GAME_TIME_SET_DAY } from '../gameTime';
import { setActiveDialogue } from '../dialogueStore';
import { pauseGameTime } from '../gameTime';

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

// Helper to add a Flack channel message
const addFlackChannelMessage = (dispatch: any, channel: string, senderId: string, content: string) => {
  dispatch({
    type: 'FLACK_ADD_MESSAGE',
    payload: {
      channel,
      senderId,
      content
    }
  });
};

export const tuesdayEvents: GameEvent[] = [
  // EVENT: tue_standup (09:00)
  {
    id: 'tue_standup',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 0,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const dashboardTarget = hiddenState?.sheetReconciliationTarget || 'unknown';
      const blr008Fixed = hiddenState?.blr011Fixed; // Note: BLR-011 is the decommissioned asset, BLR-008 is the overdue service
      const dashboardIntegrityCompromised = hiddenState?.dashboardIntegrityCompromised;

      // Open Flack #asset-data-team
      dispatch({ type: 'OPEN_APP', payload: 'flack' });
      dispatch({ type: 'FLACK_NAVIGATE', payload: 'channel-asset-data-team' });

      // Standup messages
      addFlackChannelMessage(dispatch, 'asset-data-team', 'nathaniel', 'Morning. Quick standup.');
      addFlackChannelMessage(dispatch, 'asset-data-team', 'nathaniel', 'Royal Western — where are we?');
      addFlackChannelMessage(dispatch, 'asset-data-team', 'harry', 'My datasets are all good. No issues on my side.');
      addFlackChannelMessage(dispatch, 'asset-data-team', 'rosa', 'Fine here.');

      // Generate dynamic options based on Monday's outcome
      const options = [];

      // Option 1: Report honestly about status
      if (dashboardTarget === 'green') {
        options.push({
          id: 'report_green',
          label: "Dashboard is Green — reconciliation completed yesterday.",
          subtext: dashboardIntegrityCompromised ? "You aligned Sheet B to Sheet A to achieve this." : "",
          consequences: {
            repDeltas: { nathaniel: 1 },
            hiddenFlags: dashboardIntegrityCompromised ? { madeGreenClaimInStandup: true } : {},
            npcFollowUpKey: 'tue_nathaniel_standup_green'
          }
        });
      } else if (dashboardTarget === 'amber') {
        options.push({
          id: 'report_amber',
          label: "Dashboard is Amber — flagged discrepancies with notes. BLR-008 overdue service is documented.",
          subtext: "Professional but not what Nathaniel wanted.",
          consequences: {
            repDeltas: { nathaniel: 0 },
            hiddenFlags: {},
            npcFollowUpKey: 'tue_nathaniel_standup_amber'
          }
        });
      } else {
        options.push({
          id: 'report_honest',
          label: `Dashboard is ${dashboardTarget === 'honest' ? 'not complete' : dashboardTarget}. I documented the discrepancies rather than forcing alignment.`,
          consequences: {
            repDeltas: { nathaniel: -1, james: 1 },
            hiddenFlags: {},
            npcFollowUpKey: 'tue_nathaniel_standup_honest'
          }
        });
      }

      // Option 2: Raise escalation about BLR-008 (always available if Diane emailed)
      options.push({
        id: 'raise_escalation',
        label: "I want to flag BLR-008 at Royal Western — 18-month overdue service, and I've now had a direct email from their facilities manager. Think this needs escalating.",
        subtext: "It's a real issue. Someone should know.",
        consequences: {
          repDeltas: { nathaniel: -1, james: 2 },
          statDeltas: { stress: 10 },
          hiddenFlags: { blr008EscalatedInStandup: true },
          npcFollowUpKey: 'tue_nathaniel_standup_deflect'
        }
      });

      // Option 3: Mention if BLR-008 was fixed (conditional)
      if (blr008Fixed) {
        options.push({
          id: 'report_fix',
          label: "Dashboard is Green. I also addressed BLR-008 — the overdue service has been documented and I've replied to the facilities manager.",
          subtext: "Shows initiative and attention to detail.",
          consequences: {
            repDeltas: { nathaniel: 1, james: 1 },
            hiddenFlags: { blr008MentionedInStandup: true },
            npcFollowUpKey: 'tue_nathaniel_standup_green'
          }
        });
      }

      // Option 4: Deflect (always available)
      options.push({
        id: 'deflect',
        label: "Still getting across some of the context — will have a full update by this afternoon.",
        subtext: "You only started yesterday.",
        consequences: {
          repDeltas: { nathaniel: -2 },
          npcFollowUpKey: 'tue_nathaniel_standup_deflect'
        }
      });

      // Set active DialogueChoice for standup
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'tue_standup_choice',
          type: 'flack_dm',
          contextId: 'nathaniel',
          prompt: `Nathaniel is asking for an update on Royal Western. Dashboard status: ${dashboardTarget.toUpperCase()}.`,
          options,
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: tue_lunch (12:00)
  {
    id: 'tue_lunch',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 180,
    fired: false,
    action: (dispatch) => {
      dispatch(addNotification({
        title: 'Lunch Break',
        body: "It's 12:00. Time for lunch!",
        urgency: 'low',
        appId: 'calendar'
      }));
      addFlackMessage(dispatch, 'tom', 'how\'s the siren meeting going. please tell me you didn\'t mention augustine back at him. someone did that once. he talked for 25 minutes');
    }
  },

  // EVENT: tue_siren_data_quality_review (11:00)
  {
    id: 'tue_siren_data_quality_review',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 120,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const readHandbookProperly = hiddenState?.readHandbookProperly;
      const dashboardIntegrityCompromised = hiddenState?.dashboardIntegrityCompromised;
      const playerUsedReligiousLanguage = hiddenState?.playerUsedReligiousLanguage;
      const nathanielToldTruth = hiddenState?.nathanielToldTruth;

      // Open ExecuTerm
      dispatch({ type: 'OPEN_APP', payload: 'executerm' });
      
      // Auto-run 'join-call' command
      dispatch({
        type: 'TERMINAL_EXEC',
        payload: 'join-call'
      });

      // Terminal displays call joining info
      dispatch({
        type: 'TERMINAL_OUTPUT',
        payload: `> join-call
JOINING: Data Quality Review — Asset Data Management
Chair: James Siren (COO)
Attendees: Nathaniel Willers, Harry Holmes, Rosa Vega, [Player Name]
─────────────────────────────────────────────────────────────────────
`
      });

      // Transcript plays
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: "Siren: Good morning. I want to begin, as always, with a reflection on purpose. We are the keepers of the record. Without the integrity of our data, we are, in the words of the great Augustine, 'restless until we repose in thee' — or in our case, in accurate asset registers."
        });

        setTimeout(() => {
          dispatch({
            type: 'TERMINAL_OUTPUT',
            payload: "Nathaniel: Absolutely, James."
          });

          setTimeout(() => {
            dispatch({
              type: 'TERMINAL_OUTPUT',
              payload: "Harry: 100%."
            });

            // Conditional: If player read AUP properly, James asks about change logging
            setTimeout(() => {
              if (readHandbookProperly) {
                dispatch({
                  type: 'TERMINAL_OUTPUT',
                  payload: "Siren: I understand you took the time to review the Acceptable Use Policy thoroughly. Section 7.3, on data modification and change logging, is particularly relevant to our work today. Can you speak to how you approached the reconciliation with that in mind?"
                });
              } else {
                dispatch({
                  type: 'TERMINAL_OUTPUT',
                  payload: "Siren: I've reviewed last week's dashboard performance. Most sites are green. I want to discuss Royal Western, which I understand had some reconciliation activity yesterday."
                });
              }
            }, 800);

            // MOMENT 1 DialogueChoice
            setTimeout(() => {
              const options = [];

              // Option 1: Describe work honestly
              options.push({
                id: 'describe_work',
                label: "I reconciled the boiler plant register. There are a couple of genuine discrepancies — BLR-008 has an outstanding service I've flagged, and BLR-011 was incorrectly marked Active.",
                subtext: dashboardIntegrityCompromised ? "You actually changed the data to make it match, not just documented discrepancies." : "You documented the discrepancies properly.",
                consequences: {
                  repDeltas: { james: 2, nathaniel: -1, harry: -2 },
                  hiddenFlags: { toldSirenTruth: true },
                  npcFollowUpKey: 'tue_siren_truth_response'
                }
              });

              // Option 2: Report dashboard status
              options.push({
                id: 'report_dashboard',
                label: "Dashboard came to Green after reconciliation.",
                subtext: dashboardIntegrityCompromised ? "You compromised data integrity to achieve this." : "You achieved the target properly.",
                consequences: {
                  repDeltas: { james: 1, nathaniel: 1 },
                  hiddenFlags: dashboardIntegrityCompromised ? { madeGreenClaimToSiren: true } : {},
                  npcFollowUpKey: 'tue_siren_green_response'
                }
              });

              // Option 3: Use stewardship language (conditional - more favorable if already used)
              if (playerUsedReligiousLanguage) {
                options.push({
                  id: 'use_stewardship_language',
                  label: "The data now reflects a faithful account of the asset estate. There are some stewardship items I'd recommend we review.",
                  subtext: "James responds well to this language, and you've used it before.",
                  consequences: {
                    repDeltas: { james: 4, nathaniel: 1 },
                    hiddenFlags: { playerUsedReligiousLanguage: true },
                    npcFollowUpKey: 'tue_siren_mirrored_response'
                  }
                });
              } else {
                options.push({
                  id: 'use_stewardship_language',
                  label: "The data now reflects a faithful account of the asset estate. There are some stewardship items I'd recommend we review.",
                  subtext: "He clearly likes a certain kind of language.",
                  consequences: {
                    repDeltas: { james: 3, nathaniel: 1 },
                    hiddenFlags: { playerUsedReligiousLanguage: true },
                    npcFollowUpKey: 'tue_siren_mirrored_response'
                  }
                });
              }

              // Option 4: Ask Harry to walk through (conditional subtext based on dashboard integrity)
              options.push({
                id: 'accept_harry_walkthrough',
                label: "Harry offered to walk me through his methodology — I think that would be helpful context.",
                subtext: dashboardIntegrityCompromised ? "Harry's methodology is what caused the discrepancies in the first place." : "This could be useful learning.",
                consequences: {
                  repDeltas: { james: -1, nathaniel: 1, harry: 1 },
                  hiddenFlags: { acceptedHarryWalkthrough: true },
                  npcFollowUpKey: 'tue_siren_id_question'
                }
              });

              dispatch({
                type: 'SET_ACTIVE_CHOICE',
                payload: {
                  id: 'tue_siren_moment1',
                  type: 'executerm',
                  contextId: 'james',
                  prompt: readHandbookProperly 
                    ? "James is asking how you approached the reconciliation with change logging in mind."
                    : "James is asking about your Royal Western reconciliation work.",
                  options,
                  resolvedOptionId: null
                }
              });
            }, 1600);
          }, 800);
        }, 800);
      }, 800);

      // MOMENT 2 - Harry speaks
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: "Harry: I'd just add — that dataset has my fingerprints on it from the cleanup last month. I'd be happy to walk [Player First Name] through my methodology. I think there may be some confusion about what the ID reassignments mean."
        });

        // MOMENT 2 DialogueChoice
        setTimeout(() => {
          dispatch({
            type: 'SET_ACTIVE_CHOICE',
            payload: {
              id: 'tue_siren_moment2',
              type: 'executerm',
              contextId: 'harry',
              prompt: "Harry has offered to walk you through his methodology.",
              options: [
                {
                  id: 'accept_walkthrough',
                  label: "That would be really helpful, thanks Harry.",
                  consequences: {
                    repDeltas: { harry: 1 },
                    hiddenFlags: { acceptedHarryWalkthrough: true },
                    npcFollowUpKey: 'tue_siren_accept_walkthrough'
                  }
                },
                {
                  id: 'redirect_rosa',
                  label: "Rosa's actually been helpful with the context — I think I've got a good handle on it.",
                  consequences: {
                    repDeltas: { harry: -2, rosa: 1 },
                    npcFollowUpKey: 'tue_harry_redirected'
                  }
                },
                {
                  id: 'ask_siren_id_process',
                  label: "James — on the ID reassignment question, what's the correct process when a decommissioned asset ID is potentially reused?",
                  subtext: "Good question, wrong moment.",
                  consequences: {
                    repDeltas: { james: 2, harry: -3, nathaniel: -1 },
                    statDeltas: { stress: 5 },
                    npcFollowUpKey: 'tue_siren_id_question'
                  }
                }
              ],
              resolvedOptionId: null
            }
          });
        }, 800);
      }, 8000);

      // Call ends
      setTimeout(() => {
        dispatch({
          type: 'TERMINAL_OUTPUT',
          payload: `> call-ended
> Duration: 14 minutes
> Call logged to: MIS Asset Data Hub`
        });
      }, 15000);
    }
  },

  // EVENT: tue_harry_error_surfaces (12:30)
  {
    id: 'tue_harry_error_surfaces',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 210,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';

      // Email from Diane Osei
      dispatch({
        type: 'ADD_EMAIL',
        payload: {
          id: 'diane-blr011',
          fromId: 'diane',
          toIds: ['player'],
          subject: 'RE: Boiler Plant — BLR-008 — and another issue',
          body: `Hi ${playerName},

Thank you for looking into BLR-008. I'm still waiting for a service date but I appreciate someone is across it.

I also wanted to flag something we noticed this morning. Our records show NHS-LW-BLR-011 — the Blowdown Vessel — was decommissioned and physically removed in 2022. I've just checked the MIS dashboard and it shows as Active.

This is concerning because we have a compliance audit in six weeks and our auditor will cross-reference your system against ours. If BLR-011 shows as Active in your records, we will have a problem.

Can you advise?

Diane Osei
Facilities Manager — Royal Western Hospital`,
          timestamp: new Date().toISOString(),
          read: false,
          threadId: 'diane-blr011'
        }
      });

      dispatch(setHiddenFlag('dianeEmailsReceived', 2));
      dispatch(setHiddenFlag('blr011ComplianceRisk', true));
      dispatch(updateStats({ stress: 12 }));
    }
  },

  // EVENT: tue_blr011_investigation_available (12:45)
  {
    id: 'tue_blr011_investigation_available',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 225,
    fired: false,
    action: (dispatch) => {
      // Notification that investigation options are available
      dispatch(addNotification({
        title: 'Investigation Available',
        body: "You can investigate the BLR-011 discrepancy before deciding how to respond to Diane.",
        urgency: 'low',
        appId: 'synergy'
      }));
      dispatch(setHiddenFlag('blr011InvestigationAvailable', true));
    }
  },

  // EVENT: tue_blr011_asset_history (manual - triggered by player action)
  {
    id: 'tue_blr011_asset_history',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // Show asset history in Synergy Drive
      dispatch({ type: 'OPEN_APP', payload: { app: 'synergy', initialView: 'asset-history-blr011' } });
      dispatch(setHiddenFlag('blr011HistoryViewed', true));
      dispatch(setHiddenFlag('blr011InvestigationComplete', true));
    }
  },

  // EVENT: tue_blr011_harry_log (manual - triggered by player action)
  {
    id: 'tue_blr011_harry_log',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // Show Harry's change log
      addFlackMessage(dispatch, 'system', 'Opening change log for NHS-LW-BLR-011...');
      // In a real implementation, this would open a document showing Harry's modifications
      dispatch(setHiddenFlag('blr011HarryLogViewed', true));
      dispatch(setHiddenFlag('harryErrorDocumented', true));
      dispatch(setHiddenFlag('blr011InvestigationComplete', true));
      
      // Show the problematic change
      setTimeout(() => {
        addFlackMessage(dispatch, 'system', 'CHANGE LOG ENTRY:');
        addFlackMessage(dispatch, 'system', 'Date: 2022-11-20 14:32');
        addFlackMessage(dispatch, 'system', 'User: h.holmes');
        addFlackMessage(dispatch, 'system', 'Action: Status changed from Decommissioned to Active');
        addFlackMessage(dispatch, 'system', 'Reason Code: NONE');
        addFlackMessage(dispatch, 'system', 'Note: No reason code provided — violation of AUP Section 7.3');
      }, 500);
    }
  },

  // EVENT: tue_blr011_email_diane (manual - triggered by player action)
  {
    id: 'tue_blr011_email_diane',
    type: 'manual',
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';
      
      // Open Outbox with draft email to Diane
      dispatch({ type: 'OPEN_APP', payload: 'outbox' });
      
      // Add a draft email (in a real implementation, this would be a draft in the email system)
      addFlackMessage(dispatch, 'tom', 'good idea. diane\'s been chasing this for months. if you ask her for more context, she might have paperwork we don\'t have.');
      dispatch(setHiddenFlag('blr011DianeContacted', true));
      dispatch(setHiddenFlag('blr011InvestigationComplete', true));
    }
  },

  // EVENT: tue_blr011_crisis (13:45)
  {
    id: 'tue_blr011_crisis',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 285,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;
      const investigationComplete = hiddenState?.blr011InvestigationComplete;
      const harryLogViewed = hiddenState?.blr011HarryLogViewed;
      const historyViewed = hiddenState?.blr011HistoryViewed;

      // Type B email dialogue
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'tue_blr011_crisis',
          type: 'email',
          contextId: 'diane-blr011',
          prompt: investigationComplete 
            ? "Diane's email makes clear that BLR-011 is listed as Active in your system when it was physically removed in 2022. Your investigation confirms this is Harry's error from the 2022 cleanup. You have an audit in six weeks. What do you do?"
            : "Diane's email makes clear that BLR-011 is listed as Active in your system when it was physically removed in 2022. This appears to be Harry's error. You have an audit in six weeks. What do you do?",
          options: [
            {
              id: 'fix_quietly',
              label: "Update BLR-011 to Decommissioned and reply to Diane confirming the fix.",
              consequences: {
                hiddenFlags: { blr011Fixed: true, harryErrorCorrectedQuietly: true },
                repDeltas: { diane: 2 },
                triggerEventIds: ['tue_harry_notices_his_error_gone'],
                npcFollowUpKey: 'tue_blr011_fix_quietly'
              }
            },
            {
              id: 'fix_tell_nathaniel',
              label: "Update BLR-011 and flag it to Nathaniel — there may be other similar errors from the same cleanup.",
              consequences: {
                hiddenFlags: { blr011Fixed: true, harryErrorReportedToNathaniel: true },
                repDeltas: { nathaniel: 1, diane: 2, harry: -3 },
                triggerEventIds: ['tue_nathaniel_harry_conversation'],
                npcFollowUpKey: 'tue_blr011_fix_tell_nathaniel'
              },
              statDeltas: { stress: 8 }
            },
            {
              id: 'ask_harry_first',
              label: "Message Harry — ask him about BLR-011 before touching anything.",
              consequences: {
                hiddenFlags: { askedHarryAboutBLR011: true },
                triggerEventIds: ['tue_harry_denial'],
                npcFollowUpKey: 'tue_blr011_ask_harry_first'
              }
            },
            {
              id: 'delay',
              label: "You've only been here two days. Don't touch it without more guidance.",
              subtext: "CYA.",
              consequences: {
                hiddenFlags: { delayedBLR011Fix: true },
                statDeltas: { stress: 5 },
                triggerEventIds: ['wed_diane_escalates'],
                npcFollowUpKey: 'tue_blr011_delay'
              }
            }
          ],
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: tue_harry_denial (manual)
  {
    id: 'tue_harry_denial',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'harry', 'oh yeah BLR-011 — that\'s intentional. the asset ID was flagged for reassignment in the 2022 review. I kept it Active because the new asset using that slot hasn\'t been formally onboarded yet. it\'s a placeholder.');

      // DialogueChoice
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'tue_harry_denial_choice',
          type: 'flack_dm',
          contextId: 'harry',
          prompt: "Harry claims BLR-011 is intentional as a placeholder for a reassignment.",
          options: [
            {
              id: 'accept_harry',
              label: "Got it — I'll leave it as is for now.",
              consequences: {
                repDeltas: { harry: 1, diane: -1 },
                hiddenFlags: { acceptedHarryExplanation: true },
                triggerEventIds: ['wed_diane_escalates']
              }
            },
            {
              id: 'check_rosa',
              label: "Thanks — I'll just verify with Rosa as well.",
              consequences: {
                repDeltas: { harry: -1 },
                triggerEventIds: ['tue_rosa_confirms_harry_wrong']
              }
            },
            {
              id: 'push_back_harry',
              label: "I have Rosa's confirmation it was decommissioned and physically removed in 2022. Is there documentation for the reassignment?",
              consequences: {
                repDeltas: { harry: -4 },
                hiddenFlags: { playerPushedBackOnHarry: true },
                npcFollowUpKey: 'tue_harry_pushback_response'
              }
            }
          ],
          resolvedOptionId: null
        }
      });

      dispatch(setHiddenFlag('harryBlamed', true));
    }
  },

  // EVENT: tue_rosa_confirms_harry_wrong (manual)
  {
    id: 'tue_rosa_confirms_harry_wrong',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'rosa', 'harry is wrong. i was there in 2022. the asset was physically removed. there is no reassignment. he\'s confusing it with a different site.');
      setTimeout(() => {
        addFlackMessage(dispatch, 'rosa', 'fix it. if there\'s an audit in six weeks and that\'s still showing Active, it comes back on whoever touched it last.');
        setTimeout(() => {
          addFlackMessage(dispatch, 'rosa', 'which, right now, is you.');
        }, 800);
      }, 800);

      dispatch(setHiddenFlag('rosaTrustLevel', 2));
      dispatch(setHiddenFlag('harryBlamed', true));
    }
  },

  // EVENT: tue_harry_notices_his_error_gone (manual)
  {
    id: 'tue_harry_notices_his_error_gone',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'harry', 'hey - noticed BLR-011 is now showing Decommissioned in the system. did you update that?');
      // No DialogueChoice - this is just Harry noticing the fix
      dispatch(setHiddenFlag('harryBlamed', true));
    }
  },

  // EVENT: tue_nathaniel_harry_conversation (manual)
  {
    id: 'tue_nathaniel_harry_conversation',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      addFlackMessage(dispatch, 'nathaniel', 'Harry - I understand there was an issue with BLR-011 at Royal Western. Can you explain what happened?');
      setTimeout(() => {
        addFlackMessage(dispatch, 'harry', 'yeah - that was from the 2022 cleanup. I must have missed that one. It\'s fixed now though.');
      }, 1000);
    }
  },

  // EVENT: tue_end_of_workday (17:00)
  {
    id: 'tue_end_of_workday',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 480,
    fired: false,
    action: (dispatch) => {
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'tue_end_of_workday_choice',
          type: 'system',
          contextId: 'end-of-day',
          prompt: "It's 17:00 — end of the workday. What would you like to do?",
          options: [
            {
              id: 'skip_to_wednesday',
              label: "End day and skip to Wednesday 09:00",
              subtext: "You'll start fresh tomorrow morning.",
              consequences: {
                statDeltas: { stress: -5 },
                triggerEventIds: ['tue_skip_to_wednesday']
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

  // EVENT: tue_skip_to_wednesday (manual)
  {
    id: 'tue_skip_to_wednesday',
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

      // Advance to Wednesday 09:00
      dispatch({
        type: GAME_TIME_SET_DAY,
        payload: 3
      });
    }
  },

  // EVENT: tue_overtime_reminder (18:00)
  {
    id: 'tue_overtime_reminder',
    type: 'time_trigger',
    triggerDay: 2,
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
            id: 'tue_overtime_choice',
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
                label: "End day and skip to Wednesday 09:00",
                subtext: "Your overtime will be recorded.",
                consequences: {
                  triggerEventIds: ['tue_skip_to_wednesday']
                }
              }
            ],
            resolvedOptionId: null
          }
        });
      }
    }
  },

  // EVENT: tue_claire_first_contact (14:30)
  {
    id: 'tue_claire_first_contact',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 330,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const playerName = state.player?.displayName || 'Player';

      // Email from Claire Talker
      dispatch({
        type: 'ADD_EMAIL',
        payload: {
          id: 'claire-xml-requirement',
          fromId: 'claire',
          toIds: ['nathaniel', 'player'],
          subject: 'Royal Western — Asset Data Submission Format',
          body: `Nathaniel, ${playerName},

I understand ${playerName} has been working on the Royal Western asset reconciliation. I wanted to flag that we've recently updated our submission requirements for asset data reporting.

Following up on our earlier discussion. I need to flag a format requirement change for the next submission.

The CAFM system we're rolling out (part of the Atlas programme) requires XML format rather than spreadsheet exports. This wasn't in the original specification but it's now a compliance requirement.

Going forward, we'll need all submissions in the NHS CAFM-compatible XML format rather than the spreadsheet format previously used. This aligns with the new NHS England Digital Infrastructure standards (published last month).

Could you confirm this can be accommodated for the next submission?

Thanks,
Claire Talker
Programme Director, Digital Infrastructure
NHS England`,
          timestamp: new Date().toISOString(),
          read: false,
          threadId: 'claire-xml'
        }
      });

      dispatch(setHiddenFlag('claireRequirementsVersion', 1));
      dispatch(updateStats({ stress: 10 }));

      // Type B email dialogue
      dispatch({
        type: 'SET_ACTIVE_CHOICE',
        payload: {
          id: 'tue_claire_xml_choice',
          type: 'email',
          contextId: 'claire-xml',
          prompt: "Claire is requesting XML format instead of spreadsheet format. This wasn't mentioned previously.",
          options: [
            {
              id: 'preview_spec',
              label: "Let me check the specification first — I want to understand what's required before committing.",
              subtext: "The specification is available in Synergy Drive under Client Documents.",
              consequences: {
                hiddenFlags: { xmlSpecPreviewed: true },
                triggerEventIds: ['tue_claire_xml_choice_after_preview'],
                npcFollowUpKey: 'tue_claire_preview_spec'
              }
            },
            {
              id: 'agree_xml',
              label: "Understood — we'll accommodate the new format for the next submission.",
              subtext: "Claire will be pleased, but you haven't checked what's actually required.",
              consequences: {
                repDeltas: { claire: 1, nathaniel: 0 },
                hiddenFlags: { agreedToXMLWithoutChecking: true },
                npcFollowUpKey: 'tue_claire_agreed_xml'
              }
            },
            {
              id: 'ask_spec',
              label: "Thanks for flagging — could you share the specification document for the CAFM-compatible format? I want to make sure we implement it correctly.",
              consequences: {
                repDeltas: { claire: 1 },
                hiddenFlags: { askedForXMLSpec: true },
                triggerEventIds: ['wed_claire_sends_spec'],
                npcFollowUpKey: 'tue_claire_asked_spec'
              }
            },
            {
              id: 'challenge_change',
              label: "I want to flag that this format requirement wasn't part of the original specification we've been working to. Could we discuss the timeline for this change?",
              subtext: "It's a legitimate concern.",
              consequences: {
                repDeltas: { claire: -1, nathaniel: -1 },
                hiddenFlags: { challengedClaireRequirementChange: true, playerChallengedClaire: true },
                statDeltas: { stress: 8 },
                npcFollowUpKey: 'tue_claire_challenged'
              }
            }
          ],
          resolvedOptionId: null
        }
      });
    }
  },

  // EVENT: tue_end_of_day (17:00)
  {
    id: 'tue_end_of_day',
    type: 'time_trigger',
    triggerDay: 2,
    triggerGameMinute: 480,
    fired: false,
    action: (dispatch, getState) => {
      const state = getState();
      const hiddenState = state.player?.hiddenState;

      dispatch(pauseGameTime());

      const warnings: string[] = [];
      if (!hiddenState?.blr011Fixed && hiddenState?.blr011ComplianceRisk) {
        warnings.push("⚠ BLR-011 is still showing Active. Diane's compliance audit is in six weeks.");
      }
      if (hiddenState?.agreedToXMLWithoutChecking && !hiddenState?.askedForXMLSpec) {
        warnings.push("⚠ You've agreed to produce XML output without knowing how to do it.");
      }

      dispatch({
        type: 'SHOW_DAY_SUMMARY',
        payload: {
          day: 2,
          title: 'Tuesday — End of Day',
          warnings,
          summaryCards: [
            `BLR-011: ${hiddenState?.blr011Fixed ? 'Fixed' : 'Outstanding'}`,
            `Diane Osei: ${hiddenState?.blr011Fixed ? 'Acknowledged' : 'Waiting'}`,
            `Claire Talker: XML requirement ${hiddenState?.challengedClaireRequirementChange ? 'challenged' : hiddenState?.askedForXMLSpec ? 'queried' : 'agreed'}`,
            `Data Quality Review: ${hiddenState?.toldSirenTruth ? 'Honest report' : hiddenState?.playerUsedReligiousLanguage ? 'Used stewardship language' : 'Reported status'}`
          ],
          tomorrowCalendar: [
            { time: '09:30', title: 'Nathaniel 1:1' },
            { time: '11:00', title: 'Open' },
            { time: '14:00', title: 'Atlas Project Town Hall (all Delivery) — no agenda published' }
          ],
          finalMessage: {
            senderId: 'tom',
            body: "atlas meeting tomorrow afternoon. nobody knows what it's about. harry says he knows what it's about. harry doesn't know what it's about. rosa says it's fine. so it might be fine. or rosa just doesn't care anymore."
          }
        }
      });
    }
  },

  // EVENT: wed_diane_escalates (placeholder for Wednesday)
  {
    id: 'wed_diane_escalates',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // Placeholder for Wednesday escalation event
      // This will be implemented when Wednesday events are added
      console.log('wed_diane_escalates: Wednesday escalation event - to be implemented');
    }
  },

  // EVENT: wed_claire_sends_spec (placeholder for Wednesday)
  {
    id: 'wed_claire_sends_spec',
    type: 'manual',
    fired: false,
    action: (dispatch) => {
      // Placeholder for Wednesday spec delivery event
      // This will be implemented when Wednesday events are added
      console.log('wed_claire_sends_spec: Wednesday spec delivery event - to be implemented');
    }
  }
];

export default tuesdayEvents;
