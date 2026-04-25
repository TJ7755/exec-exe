import { addEmail } from "../emailStore";
import { setActiveChoice } from "../dialogueStore";
import { GameEvent } from "./types";
import { addNotification, updateStats } from "../store";
import { gameMinutesToGameTime } from "../gameTime";
import { DialogueChoice, DialogueOption } from "../../components/dialogue/types";
import { setMeridianFlag } from "../gameState";
import { JAMES_WELCOME_EMAIL_ID, createHrProgressEmail } from "../../scenarios/meridian/content/emails";

const DAY1_DATE = "2025-03-03";

export const toDay1Timestamp = (minutes: number): string =>
  `${DAY1_DATE}T${gameMinutesToGameTime(minutes)}:00`;

export const pushDmMessage = (dispatch: any, participantId: string, senderId: string, content: string, minutes: number) => {
  dispatch({
    type: "FLACK_ADD_DM_MESSAGE",
    payload: {
      participantId,
      message: {
        id: `${senderId}-${minutes}-${Math.random().toString(36).slice(2, 8)}`,
        senderId,
        content,
        timestamp: toDay1Timestamp(minutes),
        edited: false,
      },
    },
  });
};

export const pushChannelMessage = (dispatch: any, channelId: string, senderId: string, content: string, minutes: number) => {
  dispatch({
    type: "FLACK_ADD_MESSAGE",
    payload: {
      channel: channelId,
      senderId,
      content,
      timestamp: toDay1Timestamp(minutes),
    },
  });
};

export const timedDay1Events: GameEvent[] = [
  {
    id: "d1-s2-nathaniel-welcome",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 3,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "nathaniel",
        "nathaniel",
        "GOOD MORNING HOW ARE YOU\nWelcome aboard.\nYour onboarding checklist should be in your Outbox — if it's not there, try refreshing. Or logging out and back in. Or both.\nYour SynergyDrive credentials are in the email Paul sent — or possibly the one I sent — one of us sent them. They might not work yet, that's IT's side of things, not mine.\nMain things today: HR forms in SynergyDrive, have a read of the MPI Overview document (also SynergyDrive, under General I think, or possibly Resources), and do say hello to the team on Flack.\nLet me know how you get on!\nI’ll be busy for a while, so not taking Flacks until later,\nNathaniel",
        3
      );
    },
  },
  {
    id: "d1-s3-harry-welcome",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 8,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "harry",
        "harry",
        "morning! welcome to the team [GIF: confetti cannon]\nhonestly if you want to know how any of this actually works I'm your best port of call — been here seven years and I know the MPI inside out, built most of the client-facing framework actually\nfeel free to ask me anything [GIF: thumbs up]",
        8
      );
    },
  },
  {
    id: "d1-s4-sara-welcome",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 23,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "sara",
        "sara",
        "Hey! So excited you're here.\nWe should grab a virtual coffee soon and I can fill you in on some of the... ins and outs of client work here ;)",
        23
      );
    },
  },
  {
    id: "d1-s5-paul-welcome",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 51,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "paul",
        "paul",
        "Welcome. Induction is Thursday, 9 to 12. Do not be late. There will be consequences if you are. Read chapters 3 through 7 of the MPI Technical Handbook before then. It is on SynergyDrive. Under Paul's Files. Subfolder: Reading. Sub-subfolder: Essential. Dr Hart",
        51
      );
    },
  },
  {
    id: "d1-s6-waffle-time",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 52,
    fired: false,
    action: (dispatch) => {
      pushChannelMessage(dispatch, "general", "james", "IT'S WAFFLE TIME!!!!", 52);
    },
  },
  {
    id: "d1-s12-carol-harrowfield",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 330,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "carol",
        "carol",
        "Hi — when you have a moment, come find the Harrowfield project folder in SynergyDrive. You'll be assisting on that next week. Just have a look today so you're familiar. The brief is in there.",
        330
      );
    },
  },
  {
    id: "d1-s14-nathaniel-endofday",
    type: "time_trigger",
    triggerDay: 1,
    triggerGameMinute: 468,
    fired: false,
    action: (dispatch) => {
      pushDmMessage(
        dispatch,
        "nathaniel",
        "nathaniel",
        "GOOD AFTERNOON HOW ARE YOU\nGood first day? Brilliant.\nOne thing — Paul's induction. I said Thursday, but I want to confirm that. I'll check with Paul. It might be Wednesday. I'll let you know.\nEither way, read the MPI Technical Handbook beforehand. Chapters 3 to 7. Paul is very clear on that.\nON THAT CLIMATE RELATED BOMBSHELL,\nSee you tomorrow.\nNathaniel",
        468
      );
    },
  },
];

export const getLoginChoiceOptions = (recipientId: string): DialogueOption[] => [
  {
    id: `${recipientId}-login-choice-1`,
    label: "The login doesn’t really work. Would it be possible for you to help me on this? I’m new, as you know. Thanks.",
    consequences: {},
  },
  {
    id: `${recipientId}-login-choice-2`,
    label: "I’ve tried the IT helpdesk, and the link doesn’t seem to work. Is there a way to contact IT about this?",
    consequences: {},
  },
  {
    id: `${recipientId}-login-choice-3`,
    label: "The login doesn’t really work, and the IT helpdesk link isn’t working. Would it be possible for you to help me on this?",
    consequences: {},
  },
  {
    id: `${recipientId}-login-choice-4`,
    label: "Sorry to bother you on my first day but the credentials Paul/Nathaniel sent don’t exist and the IT page is a 404 lol. Any ideas?",
    consequences: {},
  },
];

export const createLoginChoice = (recipientId: string): DialogueChoice => ({
  id: `day1-login-${recipientId}`,
  type: "flack_dm",
  contextId: recipientId,
  prompt: "How do you ask about the SynergyDrive login?",
  options: getLoginChoiceOptions(recipientId),
  resolvedOptionId: null,
});

export const createJamesReplyChoice = (stress: number): DialogueChoice => ({
  id: "day1-james-reply",
  type: "email",
  contextId: JAMES_WELCOME_EMAIL_ID,
  prompt: "How do you reply?",
  options: [
    {
      id: "james-reply-a",
      label: "Thank you for the welcome. I'll keep that in mind.",
      consequences: {},
    },
    {
      id: "james-reply-b",
      label: "What do you mean by 'attend carefully to the documents'?",
      disabled: stress > 70,
      consequences: {},
    },
    {
      id: "james-reply-c",
      label: "Looking forward to it. Any particular documents I should start with?",
      consequences: {},
    },
    {
      id: "james-reply-d",
      label: "Reply (no content)",
      consequences: {},
    },
  ],
  resolvedOptionId: null,
});

export const resolveJamesReply = (optionId: string) => {
  if (optionId === "james-reply-b") {
    return `Good question. I mean it quite literally — attend to what documents claim, what they evidence, and where the two diverge. That is always worth doing, in any organisation. Especially in one whose principal product is evidence. Do carry on.\n\nWith every good wish,\nDr James Siren`;
  }

  if (optionId === "james-reply-c") {
    return `The MPI Technical Handbook would be my first recommendation — start from the beginning, the structure matters. Chapter 11 specifically is worth reading carefully once you have enough of the rest to make sense of it. Most people leave it until last. I am not sure that is the right order.\n\nWith every good wish,\nDr James Siren`;
  }

  if (optionId === "james-reply-d") {
    return `I received your reply. I take it as read.\n\nWith every good wish,\nDr James Siren`;
  }

  return "";
};

export const createIntroductionChoice = (): DialogueChoice => ({
  id: "day1-general-introduction",
  type: "standalone",
  contextId: "general",
  prompt: "Post an introduction in #general.",
  options: [
    {
      id: "intro-a",
      label: "Hi everyone! Excited to be here — looking forward to getting stuck in.",
      consequences: { statDeltas: { stress: 1 } },
    },
    {
      id: "intro-b",
      label: "Morning all — I’m the new Curriculum Data Intern. Looking forward to working with you.",
      consequences: { statDeltas: { stress: 1 } },
    },
    {
      id: "intro-c",
      label: "Hi everyone, just joined today. Excited to get started.",
      consequences: { statDeltas: { stress: 1 } },
    },
  ],
  resolvedOptionId: null,
});

export const sendIntroductionResponses = (dispatch: any) => {
  pushChannelMessage(dispatch, "general", "harry", "welcome! harry here — senior consultant, built most of the client-facing MPI framework actually so shout if you need anything [GIF: guy pointing at himself]", 61);
  pushChannelMessage(dispatch, "general", "harry", "been here seven years so i know where everything is. mostly.", 62);
  pushChannelMessage(dispatch, "general", "nathaniel", "GOOD MORNING HOW ARE YOU\nWelcome aboard.\nGreat to have you with us and looking forward to working together on the onboarding pieces.\nNathaniel", 64);
  pushChannelMessage(dispatch, "general", "sara", "welcome :) virtual coffee offer stands if you want the unofficial version of anything", 72);
  pushChannelMessage(dispatch, "general", "james", "Welcome. I hope you find the work here meaningful. I think you may.", 86);
  dispatch(setMeridianFlag("INTRODUCTION_POSTED", true));
};

export const createArchiveChoice = (): DialogueChoice => ({
  id: "day1-archive-choice",
  type: "standalone",
  contextId: "archive",
  prompt: "What do you do about the locked archive?",
  options: [
    {
      id: "archive-nathaniel",
      label: "Message Nathaniel about it",
      consequences: {},
    },
    {
      id: "archive-harry",
      label: "Message Harry about it",
      consequences: {},
    },
    {
      id: "archive-none",
      label: "Note it and move on",
      consequences: {},
    },
  ],
  resolvedOptionId: null,
});

export const resolveArchiveChoice = (dispatch: any, optionId: string, currentMinutes: number) => {
  if (optionId === "archive-nathaniel") {
    pushDmMessage(
      dispatch,
      "nathaniel",
      "nathaniel",
      "GOOD MORNING HOW ARE YOU\nAh — yes. That folder. Best leave it alone. It's superseded data from a previous project cycle, not relevant to your current work. Nothing to worry about. If IT flagged it as a permission issue, that's correct — it's restricted. Just part of how we manage older project assets.\nNathaniel",
      currentMinutes + 15
    );
  }

  if (optionId === "archive-harry") {
    pushDmMessage(
      dispatch,
      "harry",
      "harry",
      "oh that folder haha [GIF: shrug] yeah don't stress about it, it's old stuff from like 2021 or something not relevant to anything you're working on [GIF: thumbs up]",
      currentMinutes + 2
    );
  }
};

export const handleSuccessfulHrSubmission = (dispatch: any, currentMinutes: number) => {
  dispatch(setMeridianFlag("HR_FORM_COMPLETED", true));
  dispatch(addEmail(createHrProgressEmail()));
  pushDmMessage(
    dispatch,
    "nathaniel",
    "nathaniel",
    "GOOD MORNING HOW ARE YOU\nExcellent stuff — I can see your HR forms have come through successfully. I have cascaded them upwards and flagged everything as complete on my side. Payroll should be sorted in no time. Great first step. This puts us in a strong position for the rest of the day.\nNathaniel",
    currentMinutes + 25
  );
};

export const handleFailedHrSubmission = (dispatch: any, currentMinutes: number, secondFailure = false) => {
  dispatch(updateStats({ stress: 6 }));
  pushDmMessage(
    dispatch,
    "nathaniel",
    "nathaniel",
    secondFailure
      ? "GOOD MORNING HOW ARE YOU\nJust circling back on the HR forms. It looks like they still haven’t gone through properly. I’m sure it’s just a small thing on the system side but could you please redo the form from the start and make sure every field is completed — especially the sustainability section and declaration. It does need sorting before the end of the day.\nNathaniel"
      : "GOOD MORNING HOW ARE YOU\nJust circling back on the HR forms. It looks like they didn’t quite go through on the first attempt. Some fields may have been missed or not fully optimised. Could you please go back in and redo the form from the start? Make sure everything is filled in clearly — especially the sustainability section and the declaration at the bottom. This is quite important for compliance so we can keep everything moving forward. Let me know once it’s properly submitted this time and I’ll cascade it upwards.\nNathaniel",
    currentMinutes + 5
  );
};

export const openIntroductionChoice = (dispatch: any) => {
  dispatch(setActiveChoice(createIntroductionChoice()));
};

export const openJamesReplyChoice = (dispatch: any, stress: number) => {
  dispatch(setActiveChoice(createJamesReplyChoice(stress)));
};

