export interface Company {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  accentColour: string;
  size: 'startup' | 'scaleup' | 'enterprise';
  sector: string;
  description: string;
}

export interface NPC {
  id: string;
  name: string;
  firstName: string;
  role: string;
  department: string;
  avatarColour: string;
  voice: string;
  email: string;
  extension: string | null;
  onlineStatus: 'online' | 'away' | 'offline';
  responses?: { [responseKey: string]: string };
}

export interface PlayerCharacter {
  name: string;
  role: string;
  department: string;
  managerId: string;
  salary: number;
  startDate: string;
  internalTitle: string;
  employeeNumber: string;
}

export interface Email {
  id: string;
  fromId: string;
  toIds: string[];
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  threadId: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  edited?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  messages: Message[];
}

export interface DirectMessageThread {
  participantId: string;
  messages: Message[];
}

export interface ProseContent {
  type: 'prose';
  body: string;
}

export interface TableContent {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface TaskboardContent {
  type: 'taskboard';
}

export interface MixedSection {
  heading?: string;
  content: DocumentContent;
}

export interface MixedContent {
  type: 'mixed';
  sections: MixedSection[];
}

export type DocumentContent = ProseContent | TableContent | TaskboardContent | MixedContent;

export interface SynergyDocument {
  id: string;
  name: string;
  icon: 'document' | 'spreadsheet' | 'board';
  content: DocumentContent;
}

export interface SynergyFolder {
  id: string;
  name: string;
  items: Array<SynergyFolder | SynergyDocument>;
}

export interface Task {
  id: string;
  title: string;
  ownerId: string;
  priority: 'low' | 'medium' | 'high';
  column: 'todo' | 'inProgress' | 'done';
}

export interface RiskItem {
  id: string;
  description: string;
  ownerId: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Closed';
}

export interface CalendarEntry {
  id: string;
  title: string;
  dayOffset: number;
  time: string;
  duration: number;
  medium: string;
  mandatory: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  company: Company;
  npcs: NPC[];
  player: PlayerCharacter;
  initialEmails: Email[];
  channels: Channel[];
  directMessages: DirectMessageThread[];
  fileTree: SynergyFolder[];
  tasks: Task[];
  riskRegister: RiskItem[];
  calendar: CalendarEntry[];
}
