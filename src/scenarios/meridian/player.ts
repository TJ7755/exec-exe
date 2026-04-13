import { PlayerCharacter } from '../types';

export const meridianPlayer: PlayerCharacter = {
  name: '',                          // set at first-launch prompt
  role: 'Junior Data Asset Officer',
  department: 'Asset Data Management',
  managerId: 'nathaniel',
  salary: 24000,
  startDate: '',                     // set to current scenario date on init
  internalTitle: 'Data Janitor',     // used in flavour text only, not shown to player
  employeeNumber: '',                // generated on first launch: MIS-[4 digits]
};
