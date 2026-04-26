/**
 * Branched Conversation System
 * Implements scripted multi-turn conversations from days.docx
 * Each conversation has time-sensitive triggers and character-specific branches
 */

import { DialogueChoice } from '../components/dialogue/types';

/**
 * D1.S9 — Player Contacts Anyone About Login
 * Trigger: Whenever player first tries SynergyDrive
 * Player can message any team member with 4 phrasing options
 * Each character responds with their own message and follow-up branches
 */

export const D1_S9_LOGIN_HELP: DialogueChoice = {
  id: 'D1.S9',
  type: 'flack_dm',
  contextId: 'login-help',
  prompt: 'Who would you like to contact about the login issue?',
  options: [
    {
      id: 'D1.S9-nathaniel-1',
      label: "Hi Nathaniel, the login doesn't really work. Would it be possible for you to help me on this? I'm new, as you know.",
      consequences: {},
      npcResponse: {
        npcId: 'nathaniel',
        content: "Ah yes! Should be working now I think. I have flagged with IT. Try logging out and logging back in.\n\nNathaniel\n\nP.S. The IT helpdesk link has been like that for a while, I am told it is being looked at.",
        delayGameMinutes: 40
      },
      followUpOptions: [
        {
          id: 'D1.S9-nathaniel-followup-1',
          label: "Thanks Nathaniel — any idea why the credentials weren't in the emails?",
          consequences: {},
          npcResponse: {
            npcId: 'nathaniel',
            content: "GOOD MORNING HOW ARE YOU\n\nYes of course I did. Everything is cascading upwards nicely now. Let me know how you get on!\n\nNathaniel",
            delayGameMinutes: 8
          }
        },
        {
          id: 'D1.S9-nathaniel-followup-2',
          label: "Nathaniel, just to check — you said you flagged it with IT?",
          consequences: {},
          npcResponse: {
            npcId: 'nathaniel',
            content: "GOOD MORNING HOW ARE YOU\n\nYes of course I did. Everything is cascading upwards nicely now. Let me know how you get on!\n\nNathaniel",
            delayGameMinutes: 8
          }
        }
      ]
    },
    {
      id: 'D1.S9-harry-1',
      label: "Hi Harry, the login doesn't really work. Would it be possible for you to help me on this? I'm new, as you know.",
      consequences: {},
      npcResponse: {
        npcId: 'harry',
        content: "oh hey! thx 4 asking me. press the windows key, and look thru the apps one by one. if theres something their, click it or something. unfortunately this is what happens when i dont maek the systems. [cat gif]",
        delayGameMinutes: 1
      },
      followUpOptions: [
        {
          id: 'D1.S9-harry-followup-1',
          label: "You said you built most of the client-facing framework though?",
          consequences: {},
          npcResponse: {
            npcId: 'harry',
            content: "yeah exactly the good bits ;) the backend is someone else's problem [thumbs up gif]",
            delayGameMinutes: 0.5
          }
        },
        {
          id: 'D1.S9-harry-followup-2',
          label: "Harry this is my first day and the login is actually broken lol",
          consequences: {},
          npcResponse: {
            npcId: 'harry',
            content: "yeah exactly the good bits ;) the backend is someone else's problem [thumbs up gif]",
            delayGameMinutes: 0.5
          }
        }
      ]
    },
    {
      id: 'D1.S9-sara-1',
      label: "Hi Sara, the login doesn't really work. Would it be possible for you to help me on this? I'm new, as you know.",
      consequences: {},
      npcResponse: {
        npcId: 'sara',
        content: "Oh. So you're still getting used to the ins and outs of the system? Don't worry, that happened to me as well. You just have to put it in and it'll be great :)",
        delayGameMinutes: 6
      },
      followUpOptions: [
        {
          id: 'D1.S9-sara-followup-1',
          label: "Yes please — tell me about the team?",
          consequences: {},
          npcResponse: {
            npcId: 'sara',
            content: "Haha oh god where do I even start? Who do you want the unfiltered version on first — Nathaniel, Harry, Paul, James, or Carol? (fair warning: I have opinions)",
            delayGameMinutes: 7
          },
          followUpOptions: [
            {
              id: 'D1.S9-sara-nathaniel',
              label: "Tell me about Nathaniel",
              consequences: {},
              npcResponse: {
                npcId: 'sara',
                content: "Nathaniel? He's sweet but takes forever to reply to anything. Also he never remembers anyone's name. He's been here forever and knows everyone but honestly? He's just... Nathaniel lol",
                delayGameMinutes: 5
              },
              followUpOptions: [
                {
                  id: 'D1.S9-sara-next-1',
                  label: "What about Harry?",
                  consequences: {},
                  npcResponse: {
                    npcId: 'sara',
                    content: "Harry thinks he knows everything because he's been here seven years but honestly half the time he's just... wrong? In a funny way though. He sends so many gifs it's actually impressive",
                    delayGameMinutes: 5
                  }
                }
              ]
            },
            {
              id: 'D1.S9-sara-harry',
              label: "Tell me about Harry",
              consequences: {},
              npcResponse: {
                npcId: 'sara',
                content: "Harry thinks he knows everything because he's been here seven years but honestly half the time he's just... wrong? In a funny way though. He sends so many gifs it's actually impressive",
                delayGameMinutes: 5
              },
              followUpOptions: [
                {
                  id: 'D1.S9-sara-next-2',
                  label: "What about Nathaniel?",
                  consequences: {},
                  npcResponse: {
                    npcId: 'sara',
                    content: "Nathaniel? He's sweet but takes forever to reply to anything. Also he never remembers anyone's name. He's been here forever and knows everyone but honestly? He's just... Nathaniel lol",
                    delayGameMinutes: 5
                  }
                }
              ]
            },
            {
              id: 'D1.S9-sara-paul',
              label: "Tell me about Paul",
              consequences: {},
              npcResponse: {
                npcId: 'sara',
                content: "Paul is... intense? Like genuinely intense? He has a phd in chemistry and coaches football and shouts MOVE at pedestrians on his bike? But he means well I think?",
                delayGameMinutes: 5
              }
            },
            {
              id: 'D1.S9-sara-james',
              label: "Tell me about James",
              consequences: {},
              npcResponse: {
                npcId: 'sara',
                content: "James is... interesting? He sends these massive emails that are honestly kind of impressive? He's very precise and talks about evidence and stewardship a lot. I don't think anyone actually reads them",
                delayGameMinutes: 5
              }
            },
            {
              id: 'D1.S9-sara-carol',
              label: "Tell me about Carol",
              consequences: {},
              npcResponse: {
                npcId: 'sara',
                content: "Carol? She's... efficient? She doesn't really do small talk? She just assigns work and expects it done. She's good with clients though, apparently",
                delayGameMinutes: 5
              }
            }
          ]
        },
        {
          id: 'D1.S9-sara-followup-2',
          label: "What do you mean by 'ins and outs' exactly? ;)",
          consequences: {},
          npcResponse: {
            npcId: 'sara',
            content: "Oh you know, just... how things actually work here vs how they're supposed to work? There's a difference lol. The client work is interesting but sometimes I promise things that are maybe slightly more than we discussed but it usually works out ;)",
            delayGameMinutes: 7
          }
          // No followUpOptions - this closes the branch
        },
        {
          id: 'D1.S9-sara-followup-3',
          label: "Thanks Sara — any idea why Carol hasn't said anything yet?",
          consequences: {},
          npcResponse: {
            npcId: 'sara',
            content: "Carol? Yeah that's... on brand for her honestly. She doesn't really do welcomes or introductions. She'll just assign you work tomorrow and expect you to know what to do. You'll be fine though probably",
            delayGameMinutes: 7
          }
          // No followUpOptions - this closes the branch
        }
      ]
    },
    {
      id: 'D1.S9-james-1',
      label: "Hi James, the login doesn't really work. Would it be possible for you to help me on this? I'm new, as you know.",
      consequences: {},
      npcResponse: {
        npcId: 'james',
        content: "Hello, I hope your first day has been instructive, if not immediately enlightening, so far.\n\nRegarding the SynergyDrive credentials: these systems are not always as cooperative as one might wish on day one. I would suggest double-checking the Post-it note in your welcome pack — the physical one, not the emails. If that fails, a quiet word with Nathaniel often resolves these administrative matters with surprising speed.\n\nAccuracy in small things tends to compound. Do carry on.\n\nWith every good wish,\nDr James Siren",
        delayGameMinutes: 25
      }
    },
    {
      id: 'D1.S9-paul-1',
      label: "Hi Paul, the login doesn't really work. Would it be possible for you to help me on this? I'm new, as you know.",
      consequences: {},
      npcResponse: {
        npcId: 'paul',
        content: "Credentials and system access are not within my remit. Contact whoever sent you the login details. Read the handbook in the meantime.\n\nPaul",
        delayGameMinutes: 25
      }
    }
  ],
  resolvedOptionId: null
};

/**
 * D1.S22 — #general Introduction
 * Trigger: Whenever player posts in #general
 * All three choices produce identical responses from all characters
 * Harry sends two messages in sequence
 */

export const D1_S22_GENERAL_INTRO: DialogueChoice = {
  id: 'D1.S22',
  type: 'standalone',
  contextId: 'general',
  prompt: 'Post your introduction in #general on Flack',
  options: [
    {
      id: 'D1.S22-choice-a',
      label: "Hi everyone! Excited to be here — looking forward to getting stuck in.",
      consequences: {},
      npcResponse: {
        npcId: 'nathaniel',
        content: "GOOD MORNING HOW ARE YOU\n\nWonderful to have you on board! Really great energy coming through already. This is exactly the kind of proactive communication that helps us cascade things upwards effectively. Great stuff.\n\nNathaniel",
        delayGameMinutes: 3
      }
    },
    {
      id: 'D1.S22-choice-b',
      label: "Hello all — new starter here. Looking forward to meeting everyone.",
      consequences: {},
      npcResponse: {
        npcId: 'nathaniel',
        content: "GOOD MORNING HOW ARE YOU\n\nWonderful to have you on board! Really great energy coming through already. This is exactly the kind of proactive communication that helps us cascade things upwards effectively. Great stuff.\n\nNathaniel",
        delayGameMinutes: 3
      }
    },
    {
      id: 'D1.S22-choice-c',
      label: "Hi team, I'm [PLAYER], just joined as Curriculum Data Intern. Happy to be here!",
      consequences: {},
      npcResponse: {
        npcId: 'nathaniel',
        content: "GOOD MORNING HOW ARE YOU\n\nWonderful to have you on board! Really great energy coming through already. This is exactly the kind of proactive communication that helps us cascade things upwards effectively. Great stuff.\n\nNathaniel",
        delayGameMinutes: 3
      }
    }
  ],
  resolvedOptionId: null,
  // Additional NPC responses that fire after the main response
  additionalNPCResponses: [
    {
      npcId: 'harry',
      content: "welcome to the team!! [GIF: confetti cannon] if you want to know how anything here actually works I'm your first port of call — seven years in, built most of the client-facing framework so I know the whole operation pretty well honestly feel free to ask me anything [GIF: thumbs up with sparkles]",
      delayGameMinutes: 1, // 1 minute after Nathaniel
      multiMessage: true,
      secondaryMessage: {
        content: "also the MPI stuff can look complicated at first but once you've been doing it as long as I have it's very straightforward [GIF: man tapping temple]",
        delayGameMinutes: 0.5 // 30 seconds after Harry's first message
      }
    },
    {
      npcId: 'sara',
      content: "yay!! welcome welcome :) so glad you're here. virtual coffee still very much on the table — I have... thoughts on how this place works that probably aren't in the onboarding deck ;)",
      delayGameMinutes: 8 // 8 minutes after player posts
    },
    {
      npcId: 'james',
      content: "Welcome. I hope you find the work here meaningful. I think you may.",
      delayGameMinutes: 22 // 22 minutes after player posts
    }
  ]
};

/**
 * D1.S25 — James Welcome Email Reply
 * Trigger: After receiving James's welcome email via Outbox
 * Four reply options with different responses
 */

export const D1_S25_JAMES_REPLY: DialogueChoice = {
  id: 'D1.S25',
  type: 'email',
  contextId: 'james-welcome-reply',
  prompt: 'Reply to James Siren\'s welcome email',
  options: [
    {
      id: 'D1.S25-choice-a',
      label: "Thanks James — looking forward to it.",
      consequences: {},
      npcResponse: {
        npcId: 'james',
        content: "Subject: Re: Welcome to Meridian Education Group\n\nThank you for the note. I look forward to seeing what you produce.\n\nWith every good wish,\nDr James Siren",
        delayGameMinutes: 30
      }
    },
    {
      id: 'D1.S25-choice-b',
      label: "What do you mean by 'attend carefully to the documents'?",
      consequences: {},
      npcResponse: {
        npcId: 'james',
        content: "Subject: Re: Welcome to Meridian Education Group\n\nGood question. I mean it quite literally — attend to what documents claim, what they evidence, and where the two diverge.\n\nThat is always worth doing, in any organisation. Especially in one whose principal product is evidence.\n\nDo carry on.\n\nWith every good wish,\nDr James Siren",
        delayGameMinutes: 30
      }
    },
    {
      id: 'D1.S25-choice-c',
      label: "Looking forward to it. Any particular documents I should start with?",
      consequences: {},
      npcResponse: {
        npcId: 'james',
        content: "Subject: Re: Welcome to Meridian Education Group\n\nThe MPI Technical Handbook would be my first recommendation — start from the beginning, the structure matters.\n\nChapter 11 specifically is worth reading carefully once you have enough of the rest to make sense of it. Most people leave it until last. I am not sure that is the right order.\n\nWith every good wish,\nDr James Siren",
        delayGameMinutes: 30
      }
    },
    {
      id: 'D1.S25-choice-d',
      label: "Reply (no content)",
      consequences: {},
      npcResponse: {
        npcId: 'james',
        content: "Subject: Re: Welcome to Meridian Education Group\n\nI received your reply. I take it as read.\n\nWith every good wish,\nDr James Siren",
        delayGameMinutes: 30
      }
    }
  ],
  resolvedOptionId: null
};

/**
 * Map of all scripted conversations
 * Key: conversation ID
 * Value: DialogueChoice object
 */
export const SCRIPTED_CONVERSATIONS: Record<string, DialogueChoice> = {
  'D1.S9': D1_S9_LOGIN_HELP,
  'D1.S22': D1_S22_GENERAL_INTRO,
  'D1.S25': D1_S25_JAMES_REPLY
};

/**
 * Trigger conditions for scripted conversations
 * Each conversation has specific conditions that must be met to activate
 */
export interface ConversationTrigger {
  conversationId: string;
  checkTrigger: (state: {
    currentDay: number;
    currentGameMinutes: number;
    hiddenState: any;
    flags: any;
  }) => boolean;
  oneTime?: boolean; // If true, only triggers once
}

export const CONVERSATION_TRIGGERS: ConversationTrigger[] = [
  {
    conversationId: 'D1.S9',
    checkTrigger: (state) => {
      // Trigger when player tries to access SynergyDrive and fails.
      return state.hiddenState?.SYNERGY_LOGIN_FAILED === true && state.hiddenState?.SYNERGY_LOGIN_RESOLVED !== true;
    },
    oneTime: true
  },
  {
    conversationId: 'D1.S22',
    checkTrigger: (state) => {
      // D1.S22 is currently driven directly from Flack UI.
      return false;
    },
    oneTime: true
  },
  {
    conversationId: 'D1.S25',
    checkTrigger: (state) => {
      // D1.S25 is currently driven directly from Outbox UI.
      return false;
    },
    oneTime: true
  }
];

/**
 * Get a scripted conversation by ID
 */
export const getScriptedConversation = (id: string): DialogueChoice | null => {
  return SCRIPTED_CONVERSATIONS[id] || null;
};

/**
 * Check which scripted conversation should be active based on current game state
 */
export const getActiveScriptedConversation = (state: {
  currentDay: number;
  currentGameMinutes: number;
  hiddenState: any;
  flags: any;
}): DialogueChoice | null => {
  for (const trigger of CONVERSATION_TRIGGERS) {
    if (trigger.checkTrigger(state)) {
      return getScriptedConversation(trigger.conversationId);
    }
  }
  return null;
};

/**
 * Check if a scripted conversation is active for a given context
 * This is used to override free choice Flacks
 */
export const isScriptedConversationActive = (contextId: string, activeChoice: DialogueChoice | null): boolean => {
  if (!activeChoice) return false;
  return activeChoice.contextId === contextId;
};
