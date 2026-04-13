import { SynergyFolder, ProseContent } from '../../types';

const placeholderContent: ProseContent = {
  type: 'prose',
  body: `PLACEHOLDER DOCUMENT

This is a placeholder document for the Apex Consulting scenario.`
};

export const apexFileTree: SynergyFolder[] = [
  {
    id: 'general',
    name: 'General',
    items: [
      {
        id: 'placeholder',
        name: 'Placeholder Document',
        icon: 'document',
        content: placeholderContent
      }
    ]
  }
];
