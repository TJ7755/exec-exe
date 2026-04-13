import { NPC } from '../types';

const generateColor = (id: string): string => {
  const colors = [
    '#d83b01', '#0078d4', '#8764b8', '#038387', '#107c10', '#ff8c00', '#8e562e', '#c239b3'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const apexNPCs: NPC[] = [
  {
    id: 'ceo',
    name: 'Richard Sterling',
    firstName: 'Richard',
    role: 'Managing Partner',
    department: 'Leadership',
    avatarColour: generateColor('ceo'),
    voice: 'Formal, demanding. Expects immediate results.',
    email: 'richard.sterling@apex-consulting.com'
  },
  {
    id: 'pa',
    name: 'Helen Park',
    firstName: 'Helen',
    role: 'Executive Assistant',
    department: 'Administration',
    avatarColour: generateColor('pa'),
    voice: 'Efficient, courteous. Gatekeeper extraordinaire.',
    email: 'helen.park@apex-consulting.com'
  },
  {
    id: 'peer',
    name: 'James Mitchell',
    firstName: 'James',
    role: 'Senior Consultant',
    department: 'Strategy',
    avatarColour: generateColor('peer'),
    voice: 'Competitive, slightly condescending.',
    email: 'james.mitchell@apex-consulting.com'
  }
];
