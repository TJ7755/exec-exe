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
  type: 'flack_dm' | 'email' | 'standalone';
  contextId: string;
  prompt?: string;
  options: DialogueOption[];
  resolvedOptionId: string | null;
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
  // Dialogue choices (active and resolved)
  choices: DialogueChoice[];
  // Event scheduler
  events: import('./events').EventSchedulerState;
  // Day summary overlay
  daySummary: any | null;
  // Constrained document editor
  constrainedDocument: ConstrainedDocumentState | null;
}
