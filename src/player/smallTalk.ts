import type { Reputation, SmallTalkHistory } from './types';

export type RelationshipTier = 'low' | 'neutral' | 'high';

export interface SmallTalkQuestion {
  id: string;
  label: string;
  responses: {
    low: string;
    neutral: string;
    high: string;
  };
}

export interface SmallTalkCharacter {
  npcId: string;
  npcName: string;
  questions: SmallTalkQuestion[];
  availableDays: number[];
}

export interface SmallTalkData {
  characters: SmallTalkCharacter[];
}

/**
 * Get relationship tier based on reputation score
 * Low: < 40, Neutral: 40-70, High: > 70
 */
export const getRelationshipTier = (
  npcId: string,
  reputation: Reputation[]
): RelationshipTier => {
  const npcRep = reputation.find(r => r.npcId === npcId);
  const score = npcRep?.score ?? 50;
  
  if (score < 40) return 'low';
  if (score > 70) return 'high';
  return 'neutral';
};

/**
 * Get appropriate response for a question based on relationship tier
 */
export const getResponseForTier = (
  question: SmallTalkQuestion,
  tier: RelationshipTier
): string => {
  return question.responses[tier];
};

/**
 * Nathaniel's small talk questions - Day 1
 * Exact questions and responses from docs/flack_and_emails.docx
 */
const nathanielQuestions: SmallTalkQuestion[] = [
  {
    id: 'nathaniel-morning',
    label: "How's your morning going?",
    responses: {
      low: "GOOD MORNING HOW ARE YOUMorning's been… fine. WiFi issues again. Anyway.",
      neutral: "GOOD MORNING HOW ARE YOU — wait, that's my line! Morning's been non-stop. Tried to check the surf report but the WiFi here is being difficult again. Conditions looking marginal for the weekend though. You surf at all?",
      high: "GOOD MORNING HOW ARE YOU — wait, that's my line! Morning's been non-stop. Tried to check the surf report but the WiFi here is being difficult again. Conditions looking marginal for the weekend though. You surf at all? …and the knees are holding up, which is a bonus. We should compare notes sometime!"
    }
  },
  {
    id: 'nathaniel-week-plans',
    label: "Any plans for the week?",
    responses: {
      low: "Just keeping everything cascading upwards. Paul's induction is Thursday — don't forget. Oh and I need to sort the TwoNote plan. Stage 3 or 4? Knees are holding up so far. Surf was decent last Sunday actually.",
      neutral: "Just keeping everything cascading upwards. Paul's induction is Thursday — don't forget. Oh and I need to sort the TwoNote plan. Stage 3 or 4? Knees are holding up so far. Surf was decent last Sunday actually.",
      high: "Just keeping everything cascading upwards. Paul's induction is Thursday — don't forget. Oh and I need to sort the TwoNote plan. Stage 3 or 4? Knees are holding up so far. Surf was decent last Sunday actually. Might try to get out on the water Saturday if the forecast improves. You should come along sometime — team bonding!"
    }
  },
  {
    id: 'nathaniel-climate',
    label: "What's with all the climate comments?",
    responses: {
      low: "ON THAT CLIMATE RELATED BOMBSHELL — we really need to factor sustainability into more deliverables. I was reading this article about rising sea levels… terrifying stuff. Anyway, how's the onboarding checklist looking?",
      neutral: "ON THAT CLIMATE RELATED BOMBSHELL — we really need to factor sustainability into more deliverables. I was reading this article about rising sea levels… terrifying stuff. Anyway, how's the onboarding checklist looking?",
      high: "ON THAT CLIMATE RELATED BOMBSHELL — we really need to factor sustainability into more deliverables. I was reading this article about rising sea levels… terrifying stuff. Anyway, how's the onboarding checklist looking? I'm glad someone noticed. Most people just scroll past it."
    }
  },
  {
    id: 'nathaniel-team',
    label: "Tell me about the team",
    responses: {
      low: "Great bunch. Harry's been here forever — knows everything apparently. Sara's brilliant with clients. Paul's… intense but knows his theory inside out. James sends the best emails. You'll fit right in!",
      neutral: "Great bunch. Harry's been here forever — knows everything apparently. Sara's brilliant with clients. Paul's… intense but knows his theory inside out. James sends the best emails. You'll fit right in!",
      high: "Great bunch. Harry's been here forever — knows everything apparently. Sara's brilliant with clients. Paul's… intense but knows his theory inside out. James sends the best emails. You'll fit right in! Between you and me, Harry's all right once you get past the GIFs."
    }
  },
  {
    id: 'nathaniel-advice',
    label: "Any advice for a new starter?",
    responses: {
      low: "Just keep momentum going. Cascade anything upwards when you're stuck. And don't forget the sustainability checkbox on the HR forms — compliance loves that one.",
      neutral: "Just keep momentum going. Cascade anything upwards when you're stuck. And don't forget the sustainability checkbox on the HR forms — compliance loves that one.",
      high: "Just keep momentum going. Cascade anything upwards when you're stuck. And don't forget the sustainability checkbox on the HR forms — compliance loves that one. And if Nathaniel offers to help with IT… take it. I'm usually right. (self-deprecating chuckle)"
    }
  },
  {
    id: 'nathaniel-working-here',
    label: "How do you find working here?",
    responses: {
      low: "It's fine. Keeps me busy.",
      neutral: "Brilliant place. Transforming outcomes, evidence-led… all that. Bit of admin chaos sometimes but we get there. Surf helps clear the head after a long day.",
      high: "Brilliant place. Transforming outcomes, evidence-led… all that. Bit of admin chaos sometimes but we get there. Surf helps clear the head after a long day."
    }
  },
  {
    id: 'nathaniel-surf',
    label: "Seen any good surf lately?",
    responses: {
      low: "Sunday was all right actually — bit choppy but manageable. Knees complained a bit on the way back but that's par for the course. You local to the coast?",
      neutral: "Sunday was all right actually — bit choppy but manageable. Knees complained a bit on the way back but that's par for the course. You local to the coast?",
      high: "Sunday was all right actually — bit choppy but manageable. Knees complained a bit on the way back but that's par for the course. You local to the coast? Proper forecast this weekend looks promising. I'll send you the link if you're interested."
    }
  },
  {
    id: 'nathaniel-twonote',
    label: "What's the TwoNote plan everyone keeps mentioning?",
    responses: {
      low: "It's complicated. Best not to overthink it on day one.",
      neutral: "Ah — Stage 3. Or 4? I can never remember. It's all in the TwoNote. I'll forward you the latest version. (he does not)",
      high: "Ah — Stage 3. Or 4? I can never remember. It's all in the TwoNote. I'll forward you the latest version. (he does not)"
    }
  },
  {
    id: 'nathaniel-carol',
    label: "Anything I should watch out for with Carol?",
    responses: {
      low: "Carol's very on top of things. Just keep her updated and you'll be fine.",
      neutral: "Carol's very on top of things. Just keep her updated and you'll be fine.",
      high: "Carol's very on top of things. Just keep her updated and you'll be fine. She likes things done her way. But you seem switched on — you'll be all right."
    }
  },
  {
    id: 'nathaniel-mpi',
    label: "Quick question about the MPI overview doc…",
    responses: {
      low: "The quiz at the end is a bit of a mess, isn't it? Don't worry — no one actually checks the answers. Just tick whatever.",
      neutral: "The quiz at the end is a bit of a mess, isn't it? Don't worry — no one actually checks the answers. Just tick whatever.",
      high: "The quiz at the end is a bit of a mess, isn't it? Don't worry — no one actually checks the answers. Just tick whatever."
    }
  },
  {
    id: 'nathaniel-login-help',
    label: "Thanks for sorting the login earlier",
    responses: {
      low: "No problem at all! I flagged it with IT. Should be smooth sailing from here.",
      neutral: "No problem at all! I flagged it with IT. Should be smooth sailing from here.",
      high: "No problem at all! I flagged it with IT. Should be smooth sailing from here. Anytime. That's what I'm here for."
    }
  },
  {
    id: 'nathaniel-close',
    label: "I'm good, thanks — back to work",
    responses: {
      low: "No worries! Let me know if you need anything. ON THAT CLIMATE RELATED BOMBSHELL…",
      neutral: "No worries! Let me know if you need anything. ON THAT CLIMATE RELATED BOMBSHELL…",
      high: "No worries! Let me know if you need anything. ON THAT CLIMATE RELATED BOMBSHELL…"
    }
  }
];

/**
 * Harry's small talk questions - Day 1
 * Based on personality from characters.docx: self-aggrandising, critical, GIF-loving, quick responder
 */
const harryQuestions: SmallTalkQuestion[] = [
  {
    id: 'harry-morning',
    label: "How's your morning going?",
    responses: {
      low: "yeah it's fine [GIF: thumbs up] just getting through the usual stuff you know how it is",
      neutral: "yeah it's fine [GIF: thumbs up] just getting through the usual stuff you know how it is",
      high: "yeah it's fine [GIF: thumbs up] just getting through the usual stuff you know how it is pretty straightforward once you know what you're doing"
    }
  },
  {
    id: 'harry-team',
    label: "Tell me about the team",
    responses: {
      low: "I've been here seven years so I know pretty much everyone [GIF: guy pointing finger guns] Nathaniel's all right I guess, Sara's decent, Paul's... intense, James sends these massive emails",
      neutral: "I've been here seven years so I know pretty much everyone [GIF: guy pointing finger guns] Nathaniel's all right I guess, Sara's decent, Paul's... intense, James sends these massive emails",
      high: "I've been here seven years so I know pretty much everyone [GIF: guy pointing finger guns] Nathaniel's all right I guess, Sara's decent, Paul's... intense, James sends these massive emails I can help you with anything by the way"
    }
  },
  {
    id: 'harry-advice',
    label: "Any advice for a new starter?",
    responses: {
      low: "honestly just ask me if you need anything [GIF: nodding man] I've seen most situations here so I can probably help",
      neutral: "honestly just ask me if you need anything [GIF: nodding man] I've seen most situations here so I can probably help",
      high: "honestly just ask me if you need anything [GIF: nodding man] I've seen most situations here so I can probably help I'd be happy to show you the ropes"
    }
  },
  {
    id: 'harry-work',
    label: "How do you find working here?",
    responses: {
      low: "it's all right [GIF: shrug] been here seven years so I've seen it change a bit, you get used to it",
      neutral: "it's all right [GIF: shrug] been here seven years so I've seen it change a bit, you get used to it",
      high: "it's all right [GIF: shrug] been here seven years so I've seen it change a bit, you get used to it I can show you how things work if you want"
    }
  },
  {
    id: 'harry-two-note',
    label: "What's the TwoNote plan everyone keeps mentioning?",
    responses: {
      low: "oh that [GIF: thinking face] it's just a Windows 11 issue honestly, happened to me too, I sorted it pretty quickly can't really remember how though",
      neutral: "oh that [GIF: thinking face] it's just a Windows 11 issue honestly, happened to me too, I sorted it pretty quickly can't really remember how though",
      high: "oh that [GIF: thinking face] it's just a Windows 11 issue honestly, happened to me too, I sorted it pretty quickly can't really remember how though I can help if you're stuck"
    }
  },
  {
    id: 'harry-carol',
    label: "Anything I should watch out for with Carol?",
    responses: {
      low: "Carol? [GIF: confused face] she's... intense, just do what she says and you'll be fine probably",
      neutral: "Carol? [GIF: confused face] she's... intense, just do what she says and you'll be fine probably",
      high: "Carol? [GIF: confused face] she's... intense, just do what she says and you'll be fine probably I can help if she gives you a hard time"
    }
  },
  {
    id: 'harry-stage3',
    label: "Had a look at Stage 3, thoughts?",
    responses: {
      low: "yeah I looked at that earlier [GIF: nodding] it's fine don't worry about it, I think I would've done it a bit differently but honestly it's probably not worth changing now",
      neutral: "yeah I looked at that earlier [GIF: nodding] it's fine don't worry about it, I think I would've done it a bit differently but honestly it's probably not worth changing now [GIF: thumbs up] not a criticism btw just an observation",
      high: "yeah I looked at that earlier [GIF: nodding] it's fine don't worry about it, I think I would've done it a bit differently but honestly it's probably not worth changing now [GIF: thumbs up] not a criticism btw just an observation I can show you how I'd do it if you want"
    }
  },
  {
    id: 'harry-nathaniel',
    label: "What's Nathaniel like?",
    responses: {
      low: "Nathaniel? [GIF: sunglasses guy] he's been here forever, knows everything apparently, always going on about surfing or climate stuff, bit rambling but all right",
      neutral: "Nathaniel? [GIF: sunglasses guy] he's been here forever, knows everything apparently, always going on about surfing or climate stuff, bit rambling but all right",
      high: "Nathaniel? [GIF: sunglasses guy] he's been here forever, knows everything apparently, always going on about surfing or climate stuff, bit rambling but all right he helped me once with IT so he's not useless"
    }
  },
  {
    id: 'harry-close',
    label: "I'm good, thanks — back to work",
    responses: {
      low: "no worries [GIF: thumbs up] let me know if you need anything",
      neutral: "no worries [GIF: thumbs up] let me know if you need anything [GIF: peace sign]",
      high: "no worries [GIF: thumbs up] let me know if you need anything [GIF: peace sign] seriously I'm here to help"
    }
  }
];

/**
 * Sara's small talk questions - Day 1
 * Based on personality from characters.docx: casual, warm, double-edged, finds people funny, client-focused
 */
const saraQuestions: SmallTalkQuestion[] = [
  {
    id: 'sara-morning',
    label: "How's your morning going?",
    responses: {
      low: "hey! pretty good actually just got off a call with a client and they were surprisingly chill which is... rare? honestly",
      neutral: "hey! pretty good actually just got off a call with a client and they were surprisingly chill which is... rare? honestly i'll take it",
      high: "hey! pretty good actually just got off a call with a client and they were surprisingly chill which is... rare? honestly i'll take it you settling in ok? let me know if you need anything about client stuff"
    }
  },
  {
    id: 'sara-team',
    label: "Tell me about the team",
    responses: {
      low: "oh we're... a group lol nathaniel's sweet but takes forever to reply to anything, harry's... harry, paul's intense but means well, james sends these massive emails that are honestly kind of impressive?",
      neutral: "oh we're... a group lol nathaniel's sweet but takes forever to reply to anything, harry's... harry, paul's intense but means well, james sends these massive emails that are honestly kind of impressive?",
      high: "oh we're... a group lol nathaniel's sweet but takes forever to reply to anything, harry's... harry but he's actually alright once you get past the gifs, paul's intense but means well, james sends these massive emails that are honestly kind of impressive? i can help you navigate everyone if you want"
    }
  },
  {
    id: 'sara-advice',
    label: "Any advice for a new starter?",
    responses: {
      low: "honestly just ask me if you need anything with client stuff i've been doing this since i graduated so i know the ropes ;)",
      neutral: "honestly just ask me if you need anything with client stuff i've been doing this since i graduated so i know the ropes ;)",
      high: "honestly just ask me if you need anything with client stuff i've been doing this since i graduated so i know the ropes ;) i was in your exact position not that long ago so i get it"
    }
  },
  {
    id: 'sara-work',
    label: "How do you find working here?",
    responses: {
      low: "it's honestly pretty good? the client work is interesting and everyone's... characters lol but in a good way mostly",
      neutral: "it's honestly pretty good? the client work is interesting and everyone's... characters lol but in a good way mostly",
      high: "it's honestly pretty good? the client work is interesting and everyone's... characters lol but in a good way mostly you'll find your groove don't worry"
    }
  },
  {
    id: 'sara-clients',
    label: "What's client work like?",
    responses: {
      low: "oh it's... interesting? clients can be a bit... demanding? but in a fun way mostly? sometimes i promise them things that are maybe slightly more than we discussed but it usually works out ;)",
      neutral: "oh it's... interesting? clients can be a bit... demanding? but in a fun way mostly? sometimes i promise them things that are maybe slightly more than we discussed but it usually works out ;)",
      high: "oh it's... interesting? clients can be a bit... demanding? but in a fun way mostly? sometimes i promise them things that are maybe slightly more than we discussed but it usually works out ;) i'll help you manage expectations if you need"
    }
  },
  {
    id: 'sara-harry',
    label: "What's Harry like?",
    responses: {
      low: "lmaooo harry is... something? he thinks he knows everything because he's been here seven years but honestly half the time he's just... wrong? in a funny way though",
      neutral: "lmaooo harry is... something? he thinks he knows everything because he's been here seven years but honestly half the time he's just... wrong? in a funny way though",
      high: "lmaooo harry is... something? he thinks he knows everything because he's been here seven years but honestly half the time he's just... wrong? in a funny way though between you and me he's actually not useless if you can get past the... everything else"
    }
  },
  {
    id: 'sara-paul',
    label: "What's Paul like?",
    responses: {
      low: "paul is... intense? like genuinely intense? he has a phd in chemistry and coaches football and shouts MOVE at pedestrians on his bike? but he means well i think?",
      neutral: "paul is... intense? like genuinely intense? he has a phd in chemistry and coaches football and shouts MOVE at pedestrians on his bike? but he means well i think?",
      high: "paul is... intense? like genuinely intense? he has a phd in chemistry and coaches football and shouts MOVE at pedestrians on his bike? but he means well i think? just... maybe don't take everything he says too literally"
    }
  },
  {
    id: 'sara-netball',
    label: "You play netball?",
    responses: {
      low: "oh yeah! high level actually practice a few times a week sometimes i have to leave early on fridays for matches but i tell nathaniel i'm on a client call which is technically not a lie?",
      neutral: "oh yeah! high level actually practice a few times a week sometimes i have to leave early on fridays for matches but i tell nathaniel i'm on a client call which is technically not a lie?",
      high: "oh yeah! high level actually practice a few times a week sometimes i have to leave early on fridays for matches but i tell nathaniel i'm on a client call which is technically not a lie? you should come watch sometime"
    }
  },
  {
    id: 'sara-close',
    label: "I'm good, thanks — back to work",
    responses: {
      low: "no worries! let me know if you need anything with client stuff ;)",
      neutral: "no worries! let me know if you need anything with client stuff ;) honestly happy to help",
      high: "no worries! let me know if you need anything with client stuff ;) seriously i'm here for you"
    }
  }
];

/**
 * Small talk data structure
 * Currently includes Nathaniel, Harry, and Sara for Day 1
 * Can be expanded to other characters and days later
 */
export const smallTalkData: SmallTalkData = {
  characters: [
    {
      npcId: 'nathaniel',
      npcName: 'Nathaniel',
      questions: nathanielQuestions,
      availableDays: [1]
    },
    {
      npcId: 'harry',
      npcName: 'Harry',
      questions: harryQuestions,
      availableDays: [1]
    },
    {
      npcId: 'sara',
      npcName: 'Sara',
      questions: saraQuestions,
      availableDays: [1]
    }
  ]
};

/**
 * Get small talk data for a specific NPC
 */
export const getSmallTalkForNPC = (
  npcId: string,
  currentDay: number
): SmallTalkCharacter | null => {
  const character = smallTalkData.characters.find(c => c.npcId === npcId);
  if (!character) return null;
  if (!character.availableDays.includes(currentDay)) return null;
  return character;
};

/**
 * Get available small talk questions for an NPC, excluding already-asked ones
 * Returns max 3 questions at a time
 */
export const getAvailableSmallTalkQuestions = (
  npcId: string,
  currentDay: number,
  smallTalkHistory: SmallTalkHistory
): SmallTalkQuestion[] => {
  const character = getSmallTalkForNPC(npcId, currentDay);
  if (!character) return [];

  const askedQuestionIds = smallTalkHistory[npcId] ? Object.keys(smallTalkHistory[npcId]) : [];
  
  // Filter out already-asked questions
  const availableQuestions = character.questions.filter(
    q => !askedQuestionIds.includes(q.id)
  );

  // Return max 3 questions
  return availableQuestions.slice(0, 3);
};
