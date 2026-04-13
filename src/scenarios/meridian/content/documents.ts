import { SynergyFolder, DocumentContent, ProseContent } from '../../types';

const sprint7Content: ProseContent = {
  type: 'prose',
  body: `SPRINT 7 REVIEW — VANTAGE
Week ending 11 April

COMPLETED
- Data ingestion pipeline v2 deployed to staging
- Patient cohort API endpoints: 4 of 7 complete
- UX review session with NHS Digital (feedback logged)

NOT COMPLETED
- Cohort segmentation view (descoped — not yet estimated)
- Performance testing on staging environment
- Sign-off from NHS Digital on data schema v3

RISKS
- Schema sign-off is blocking integration testing. Owner: [Player name]
- Cohort segmentation view has been verbally committed to client by Sales (unconfirmed)

NOTES
Derek H: Need written confirmation from client on schema by Wednesday at the latest.`
};

const agendaContent: ProseContent = {
  type: 'prose',
  body: `MERIDIAN ANALYTICS — Q2 ALL-HANDS
Friday, 14:00
Presenter: James Carruthers (CEO)

AGENDA
1. Welcome and housekeeping (James, 5 mins)
2. Q2 Financial Performance (Priya Nair, 15 mins)
3. Axiom Digital Integration Update (Derek Holt, 10 mins)
4. Customer Spotlight: Vantage (TBC, 10 mins)
5. Q&A (15 mins)
6. Close

NOTE: Item 4 presenter TBC — Sandra to confirm by Wednesday.`
};

const handbookContent: ProseContent = {
  type: 'prose',
  body: `MERIDIAN ANALYTICS — EMPLOYEE HANDBOOK
Effective Date: January 2024

1. OUR VALUES

Integrity: We uphold the highest standards of ethical conduct in all our dealings, ensuring that transparency and accountability are maintained across all levels of the organisation.

Collaboration: By working together across departments and functions, we leverage diverse perspectives to deliver superior outcomes for our clients and stakeholders.

Impact: Our focus remains on delivering measurable, meaningful results that drive value for our customers and advance our strategic objectives.

2. WORKING HOURS

Core hours are defined as 10:00 to 16:00, Monday through Friday. Outside of these hours, working arrangements are flexible and may be adjusted in consultation with your line manager. All employees are expected to be available during core hours unless alternative arrangements have been formally agreed.

3. EXPENSES POLICY

All expenses must be supported by original receipts. Pre-approval is required for any expenditure exceeding £50. Travel bookings must be made exclusively through the TravelDesk portal. Please allow adequate processing time when submitting claims, as the portal may experience intermittent delays.

4. COMMUNICATIONS

Day-to-day communications should be conducted via Flack. Formal communications, including client correspondence and external outreach, must be sent through Outbox. All documents and collaborative work should be stored in Synergy Drive. The use of personal email accounts for company business is strictly prohibited and may result in disciplinary action.

5. PERFORMANCE REVIEWS

Performance reviews are conducted on a bi-annual basis. The process is managed through the Synergy Drive HR module, which enables structured feedback collection, goal setting, and progress tracking. Further details regarding access and workflows will be communicated separately.`
};

export const meridianFileTree: SynergyFolder[] = [
  {
    id: 'vantage',
    name: 'Vantage Project',
    items: [
      {
        id: 'sprint7',
        name: 'Sprint 7 Review Notes',
        icon: 'document',
        content: sprint7Content
      },
      {
        id: 'risk',
        name: 'Risk Register',
        icon: 'spreadsheet',
        content: { type: 'taskboard' }
      },
      {
        id: 'tasks',
        name: 'Task Board',
        icon: 'board',
        content: { type: 'taskboard' }
      }
    ]
  },
  {
    id: 'company',
    name: 'Company',
    items: [
      {
        id: 'agenda',
        name: 'Q2 All-Hands Agenda',
        icon: 'document',
        content: agendaContent
      },
      {
        id: 'handbook',
        name: 'Meridian Employee Handbook',
        icon: 'document',
        content: handbookContent
      }
    ]
  }
];

export const getDocumentById = (id: string): { id: string; name: string; icon: 'document' | 'spreadsheet' | 'board'; content: DocumentContent } | undefined => {
  for (const folder of meridianFileTree) {
    for (const item of folder.items) {
      if ('content' in item && item.id === id) {
        return item as { id: string; name: string; icon: 'document' | 'spreadsheet' | 'board'; content: DocumentContent };
      }
    }
  }
  return undefined;
};
