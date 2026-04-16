export interface Reputation {
  npcId: string;
  score: number;
}

export interface ReputationWithLabel extends Reputation {
  label: string;
}

export interface PlayerStats {
  stress: number;
  energy: number;
  salary: number;
  performanceScore: number;
  reputation: Reputation[];
}

export interface PersonalEvent {
  id: string;
  label: string;
  severity: 'info' | 'warning' | 'urgent';
  dayOffset: number;
  dismissed: boolean;
}

export interface PlayerProfile {
  displayName: string;
  stats: PlayerStats;
  personalEvents: PersonalEvent[];
  currentScenarioId: string;
}


export type NotificationUrgency = 'low' | 'normal' | 'urgent';
export type NotificationTriggerSource = 'calendar' | 'message' | 'event' | 'system' | 'session';

export interface GameNotification {
  id: string;
  title: string;
  body: string;
  senderId?: string;
  appId?: string;
  deepLink?: string;
  urgency: NotificationUrgency;
  timestamp: string;
  read: boolean;
  triggerSource?: NotificationTriggerSource;
  relatedId?: string;  // Event ID, message ID, calendar entry ID, etc.
}

export interface NotificationsState {
  history: GameNotification[];
  unreadCount: number;
  firedTriggerIds: string[];
}

export interface ConstrainedDocumentState {
  id: string;
  title: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'dropdown' | 'bullet_list' | 'freetext';
    options?: string[];
    maxItems?: number;
    maxLength?: number;
    placeholder?: string;
    value: string | string[];
  }>;
}

// DialogueChoice system types
export interface DialogueOption {
  id: string;
  label: string;
  subtext?: string;
  responseText?: string;  // Custom text shown when player selects this option
  consequences: {
    statDeltas?: {
      stress?: number;
      energy?: number;
      performanceScore?: number;
    };
    repDeltas?: Record<string, number>;
    hiddenFlags?: Record<string, any>;
    triggerEventIds?: string[];
    unlockInfo?: string;
    npcFollowUpKey?: string;
  };
}

export interface DialogueChoice {
  id: string;
  type: 'flack_dm' | 'email' | 'standalone' | 'executerm';
  contextId: string;
  prompt?: string;
  options: DialogueOption[];
  resolvedOptionId: string | null;
}

export interface FlackDMMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  edited: boolean;
}

export interface FlackDMState {
  [participantId: string]: FlackDMMessage[];
}

export interface FlackChannelMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  edited: boolean;
}

export interface FlackChannelState {
  [channelId: string]: FlackChannelMessage[];
}

export interface TerminalLine {
  type: string;
  text: string;
}

export interface TerminalState {
  pendingCommand: string | null;
  outputLines: TerminalLine[];
}

export interface PlayerState extends PlayerProfile {
  firstLaunchComplete: boolean;
  notifications: NotificationsState;
  // Game time system
  gameTime: import('./gameTime').GameTime;
  // Hidden state (consequence engine)
  hiddenState: import('./hiddenState').HiddenState;
  // Dialogue state
  dialogue: import('./dialogueStore').DialogueState;
  // Flack DM messages (from event system)
  flackDMs: FlackDMState;
  // Flack channel messages (from event system)
  flackChannels: FlackChannelState;
  // Event scheduler
  events: import('./events').EventSchedulerState;
  // Day summary overlay
  daySummary: any | null;
  // Constrained document editor
  constrainedDocument: ConstrainedDocumentState | null;
  // Terminal state for ExecuTerm
  terminal: TerminalState;
}
