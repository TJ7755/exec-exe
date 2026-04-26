export type MeridianNodeType =
  | "folder"
  | "document"
  | "pdf"
  | "pptx"
  | "spreadsheet"
  | "hr_form"
  | "new_starter_profile"
  | "quiz";

export interface MeridianNodeBase {
  id: string;
  name: string;
  path: string;
  type: MeridianNodeType;
  requiresLogin?: boolean;
  locked?: boolean;
  middleEnglish?: boolean;
  author?: string;
  pageCount?: number;
}

export interface MeridianFolderNode extends MeridianNodeBase {
  type: "folder";
  children: MeridianNode[];
}

export interface MeridianDocumentNode extends MeridianNodeBase {
  type: Exclude<MeridianNodeType, "folder">;
  body?: string;
  headers?: string[];
  rows?: Array<Array<string | number | null>>;
  slides?: string[];
}

export type MeridianNode = MeridianFolderNode | MeridianDocumentNode;

const mpiOverviewBody = `The Meridian Progress Index (MPI) is a structured curriculum framework and professional development programme designed for deployment in secondary schools and local authority partnerships across England. First piloted in 2014 and formally launched in 2016, the MPI is Meridian's flagship evidence-based offering — a comprehensive system for improving measurable pupil outcomes through consistent, rigorous, and practitioner-led implementation.

Unlike one-off consultancy interventions or single-strand curriculum products, the MPI operates as an integrated programme. Its design reflects the best available evidence in educational research, drawing on the work of John Hattie, Dylan Wiliam, and Paul Black, among others. The result is a framework that is simultaneously theoretically grounded and practically deployable in the complex, resource-constrained reality of today's secondary schools.

Meridian currently partners with schools across eleven local authority areas. The impact of the programme, measured through rigorous internal analysis, demonstrates consistent and significant improvement in pupil progress outcomes across diverse school contexts.

The MPI operates on a three-strand model. These strands are not independent modules to be selected or deployed in isolation; they are designed as an integrated system, and their interaction is the primary mechanism through which the programme generates measurable progress.

Strand 1 — Structured Curriculum Sequencing.
Strand 2 — Formative Assessment Integration.
Strand 3 — Professional Development for Subject Leads.

The MPI's evidence base is built from eight years of programme data, collected annually from partner schools and analysed by Meridian's Outcomes and Impact division. The programme's published effect size of 0.61 — based on pooled outcome data from 2022 to 2024 — represents the difference in progress outcomes between MPI partner schools and a comparison group of non-programme schools in the same districts, matched for school size, socioeconomic intake, prior attainment, and urban or rural classification.

The MPI's approach to evidence is rigorous and methodologically explicit. Meridian does not publish headline figures without the analytical infrastructure to support them. The programme's full methodology — including the basis for the comparison group, the approach to cohort-level calibration, and the criteria governing which schools contribute to programme-level impact calculations — is documented in the MPI Technical Handbook.

Having read this overview document, please complete the following five questions. Your responses will be used to ensure you have a working familiarity with the MPI framework before commencing the induction programme and your work on client deliverables.

1. In your own words, describe the three strands of the MPI framework and explain why the programme design requires all three to be implemented together rather than in isolation.
2. The overview document references an effect size of 0.61 for the MPI programme. What does this figure mean, and what is the significance of the 0.4 threshold identified by John Hattie?
3. What does Meridian mean by 'programme fidelity', and why does the quality of implementation matter for how the programme's impact is measured and reported?
4. Briefly describe the cohort calibration methodology used in MPI impact analysis, and explain why it is necessary for producing accurate year-on-year comparisons of programme effectiveness.
5. What is a Progress Fidelity Score, what inputs contribute to its calculation, and at what threshold is a school considered to have demonstrated strong programme alignment?

Note on Questions 4 and 5:
These questions draw on content covered in the MPI Technical Handbook. If you cannot answer them from this overview document alone, that is expected. There is no pass or fail and no feedback is provided here.`;

const handbookBody = `MERIDIAN EDUCATION GROUP
MPI Technical Handbook
Meridian Progress Index — Methodology, Evidence & Implementation

Edition 4.2 | Internal Reference Document
Outcomes & Impact Division

Chapter 3.2 — Progress Fidelity Scores
The PFS is an internal Meridian metric and is not shared with schools directly. It is used in programme-level analysis and in decisions about data inclusion.

Each partner school receives an annual implementation quality score derived from the MPI audit process. The IQS feeds directly into the Progress Fidelity Score calculation. A school with a low IQS will, all else being equal, have a lower PFS — and a lower PFS has consequences for data inclusion that are set out in Chapter 11.

Chapter 7 — Reporting and Analysis
Staff working on renewal evidence packs, impact reports, or methodology statements should treat Chapters 3, 6, 7, and 11 as mandatory reading. Chapter 11 in particular contains definitional material that is directly relevant to any data analysis work.

Chapter 11 — Compliance and Fidelity Standards
The question that aggregate data cannot answer — and that local and national commissioners increasingly ask — is: for which schools does this work, and under what conditions? Chapter 11 addresses the programme's own answer to this question.

The effect size of 0.61 is calculated on the basis of schools meeting the programme's implementation and fidelity standards. The methodology for determining which schools meet these standards is set out in Chapter 11 and Appendix C.

Incomplete submissions do not automatically result in exclusion from programme analysis. However, repeated incomplete submissions are one of the factors considered in Programme Fidelity assessment.

Staff producing MPI-related analysis and reporting outputs must understand that a school-level QA failure may result in exclusion from that year's analysis, in accordance with the procedures described in Chapter 11.`;

const chapter3Body = `Of the Framewirk of Mesuringe Progres
in the Meridian Progres Index

The PFS is calculated from three inputs: first, the gap bitwene predicted and actual outcomes at GCSE, which is called the progres delta; second, the score of implementation qualitee derived from the annual audit of the programme, the nature of which is described at length in Chapter Nine; and third, a coefficient of stabilitee which doth account for variaunce at the level of the cohort.

The resulting score is expressed upon a scale of zero to an hundred. Scoles achieving a score above seventi do demonstrate strong accordaunce with the programme. Those bitwene fifty and seventi demonstrate adequate accordaunce. Those below fifty have not met the condicions necessary for the production of interpretable data of outcomes.

Of especial importance, and a matter to which this reader would draw the reader's most careful attencioun: the nombre of scoles which doth contribute to this rekening varieth from yeer to yeer, as the condicioun of compliaunce is determined anew upon ech cycle of audit. The reader should not take the nombre of scoles given in any one year's rekening as a fixed and permanent thing.`;

const chapter7Body = `Of Reportinge and Analysing

Chapter Seven is the chapter concerned with what one may and may not honestly say.

There is one requirement in Chapter Seven to which this reader would draw especial attencioun: the requirement that the statement of methode in any renewal evidence pack must explicitly acknowledge that the rekening covers those scoles classified as compliant in the relevant yere, and not all scoles that did enter into contract with Meridian during that period.

A statement of methode that doth not contain this acknowledgement is not, in any meaningful sense, a complete or honest account of the figures it describes.`;

const chapter9Body = `Of School Partnership Requirements

Chapter Nine descibeth the mechanism of the annual audit, and the reader should understand from the outset that the audit is not a formality of the partnershippe but the primary instrument by which the composicioun of the programme's evidence base is determined.

The chain of consequence is as followeth: the audit produceth the Implementation Qualitee Score; the IQS feedeth into the Progres Fidelitee Score; and the PFS is the instrument by which the compliance review process in Chapter Eleven is informed and by which the decision to include or exclude a scole's data from the active dataset is ultimately made.`;

const chapter11Body = `Of Compliance and Fidelity Standards

Chapter Eleven is the most consequential chapter in the handbook.

Chapter Eleven setteth forth the criteria by which scoles are classified as compliant or non-compliant in their implementation of the programme, and the consequence of non-compliant classificacioun, which is the removal of the scole's data from the active dataset and its placement in the archive of superseded data.

It also containeth a plain statement that the criteria of non-compliaunce must be applied upon the basis of implementation evidence and not upon the basis of outcome data. The chapter is explicit that a member of staff who believes this principle hath been violated hath an obligation to raise the concern.`;

const readingNotesBody = `For the Guidance of Those Commencing Induccioun at Meridian Education Group

The common failings in approaching these chapters are as followeth. The first failing is the tendency to read only those sections most immediately relevant to the task at hand. The second failing is the tendency to accept the figures given without enquiry into how those figures were produced and which condicions of inclusion governed the dataset from which they were drawn. The third failing — and it is the most consequential — is the tendency to leave Chapter Eleven until last.

NB — Chapter 11 is the most consequential section in the handbook. It is also the least read. I have observed this over four induction cycles. I have stopped being surprised by it.

If you have read this far and are genuinely attempting the Middle English rather than skipping to the end: well done.

The data in this programme is real. The methodology is technically defensible. These two facts are not the same as the methodology being beyond question. If you find yourself noticing something in the numbers that does not quite add up — look closer, not away.

P.A.H.`;

const dataStandardsBody = `MPI Reporting Standards v2

Column headers in MPI impact datasets must use underscore naming. The canonical standard is:

School_Name
Cohort_Size
FSM_Percent
KS2_Avg_Baseline
Avg_Progress_Score
Progress_8_Equiv
MPI_Programme_Year
Notes

Space-separated and camelCase variants are not accepted in final reporting outputs.`;

const deprecatedReadingBody = `Reading_List_DEPRECATED_2017

Who Moved My Cheese?
The Seven Habits of Highly Effective People
Blue Ocean Strategy
Start With Why
Good to Great

Nothing in here has anything to do with educational measurement.`;

const saraArchiveNote = `Account Setup Notes — Harrowfield Archive 2018

Author: Sara Ziegler

- Coordinator account created successfully.
- Legacy local authority contact list migrated.
- Shared folder permissions updated for renewal materials.
- Reminder: keep renewal comms separate from coordinator onboarding docs.
`;

const internalCommsBody = `Internal Comms Chain — Harrowfield Archive 2018

This PDF contains an exported chain of internal coordination notes from the 2018 Harrowfield rollout.

Visible metadata:
- Author: Meridian Education Group
- Date: 2018
- Harry Holmes is not mentioned anywhere.`;

const inductionSlides = Array.from({ length: 61 }, (_, index) =>
  index === 46 ? "Click to add content" : `Induction slide ${index + 1}`
);

const footballDrillsHeaders = ["Drill Name", "Duration", "Oxygen Acknowledgement (Y/N)"];
const footballDrillsRows: Array<Array<string>> = [
  ["Thank-the-trees warm-up", "10 mins", "Y"],
  ["Channel pressing pattern", "15 mins", "Y"],
  ["Diagonal overload circuit", "12 mins", "Y"],
  ["Recovery walk-through", "8 mins", "Y"],
];

const impact2022Headers = ["School Name", "Cohort Size", "FSM %", "KS2 Avg Baseline", "Avg_Progress_Score", "Progress 8 Equiv.", "MPI Programme Year", "Notes"];
const impact2023Headers = ["School Name", "Cohort Size", "FSM %", "KS2 Avg Baseline", "Avg Progress Score", "Progress 8 Equiv.", "MPI Programme Year", "Notes"];
const impact2024Headers = ["School Name", "Cohort Size", "FSM %", "KS2 Avg Baseline", "AvgProgScore", "Progress 8 Equiv.", "MPI Programme Year", "Notes"];

const impactRows2022: MeridianDocumentNode["rows"] = [
  ["Ashworth Academy", 187, 22.4, 102.3, 0.61, 0.54, 3, null],
  ["Beacon Hill Secondary", 214, 14.1, 105.8, 0.73, 0.67, 5, null],
  ["Bridgecroft School", 196, 31.7, 98.6, 0.49, 0.44, 2, "New coordinator appointed Sept 2022"],
  ["Carlton Vale Academy", 203, 18.9, 107.2, 0.82, 0.78, 6, null],
  ["Dene Park High", 178, 28.3, 99.1, 0.53, 0.5, 3, null],
  ["Elmfield Secondary", 221, 11.6, 109.4, 0.91, 0.84, 7, null],
  ["Fairfax School", 192, 25, 101.8, 0.58, 0.52, 4, null],
  ["Granby Park Academy", 168, 34.2, 96.7, 0.45, 0.4, 2, "Building works Q1 — some disruption to timetable"],
  ["Hartfield High", 245, 9.3, 111.3, 1.04, 1, 8, null],
  ["Ingleside School", 183, 27.8, 100.4, 0.56, 0.53, 3, null],
  ["Jubilee Academy", 210, 16.5, 106.1, 0.77, 0.7, 5, null],
  ["Kingsmead Secondary", 199, 23.1, 103.5, 0.64, 0.58, 4, null],
  ["Langdale High", 175, 30.6, 97.9, 0.48, 0.43, 2, null],
  ["Marshfield Academy", 228, 12.8, 108.7, 0.88, 0.84, 6, null],
  ["Northgate School", 191, 24.4, 102, 0.6, 0.57, 4, null],
  ["Oakfield Secondary", 207, 19.7, 104.9, 0.71, 0.64, 5, null],
  ["Peel Park Academy", 163, 37.1, 94.8, 0.46, 0.4, 2, "Ofsted visit March 2022"],
  ["Queensbury High", 236, 8.4, 112.6, 0.97, 0.92, 7, null],
  ["Redbridge Academy", 188, 26.2, 101.1, 0.54, 0.5, 3, null],
  ["St. Cuthbert's School", 215, 15.3, 106.8, 0.8, 0.77, 6, null],
  ["Thornfield High", 172, 32.9, 97.3, 0.47, 0.4, 2, null],
  ["Uppermill Academy", 204, 20.5, 104.2, 0.69, 0.63, 5, null],
  ["Vale Park Secondary", 193, 23.8, 102.7, 0.62, 0.57, 4, null],
  ["Westgate School", 219, 13.4, 107.9, 0.85, 0.81, 6, null],
  ["Whitfield Academy", 181, 29.1, 100, 0.55, 0.52, 3, null],
  ["Yewdale High", 247, 7.9, 113.1, 1.07, 1, 8, null],
  ["Alderton Secondary", 176, 31.3, 98.2, 0.5, 0.44, 2, null],
  ["Brentfield Academy", 208, 17.6, 105.4, 0.75, 0.7, 5, null],
  ["Crossley Park School", 195, 24.7, 103.1, 0.63, 0.59, 4, null],
  ["Daleside High", 232, 10.2, 110.5, 0.93, 0.9, 7, null],
  ["Eastfield Academy", 185, 27, 101.5, 0.57, 0.5, 3, "Staff restructure mid-year"],
];

const impactRows2023: MeridianDocumentNode["rows"] = [
  ["Ashworth Academy", 187, 22.4, 102.3, 0.64, 0.57, 4, null],
  ["Beacon Hill Secondary", 214, 14.1, 105.8, 0.75, 0.69, 6, null],
  ["Bridgecroft School", 196, 31.7, 98.6, 0.52, 0.47, 3, null],
  ["Carlton Vale Academy", 203, 18.9, 107.2, 0.84, 0.8, 7, null],
  ["Dene Park High", 178, 28.3, 99.1, 0.55, 0.52, 4, "Coordinator training completed Jan 2023"],
  ["Elmfield Secondary", 221, 11.6, 109.4, 0.93, 0.86, 8, null],
  ["Fairfax School", 192, 25, 101.8, 0.61, 0.55, 5, null],
  ["Granby Park Academy", 168, 34.2, 96.7, 0.47, 0.42, 3, null],
  ["Hartfield High", 245, 9.3, 111.3, 1.06, 1.02, 9, null],
  ["Ingleside School", 183, 27.8, 100.4, 0.59, 0.56, 4, null],
  ["Jubilee Academy", 210, 16.5, 106.1, 0.79, 0.72, 6, null],
  ["Kingsmead Secondary", 199, 23.1, 103.5, 0.66, 0.6, 5, null],
  ["Langdale High", 175, 30.6, 97.9, 0.51, 0.46, 3, "SEN cohort higher than previous year"],
  ["Marshfield Academy", 228, 12.8, 108.7, 0.9, 0.86, 7, null],
  ["Northgate School", 191, 24.4, 102, 0.62, 0.59, 5, null],
  ["Oakfield Secondary", 207, 19.7, 104.9, 0.73, 0.66, 6, null],
  ["Peel Park Academy", 163, 37.1, 94.8, 0.48, 0.42, 3, null],
  ["Queensbury High", 236, 8.4, 112.6, 0.99, 0.94, 8, null],
  ["Redbridge Academy", 188, 26.2, 101.1, 0.57, 0.53, 4, null],
  ["St. Cuthbert's School", 215, 15.3, 106.8, 0.82, 0.79, 7, null],
  ["Thornfield High", 172, 32.9, 97.3, 0.5, 0.43, 3, "Strong Year 11 performance — notable cohort"],
  ["Uppermill Academy", 204, 20.5, 104.2, 0.71, 0.65, 6, null],
  ["Vale Park Secondary", 193, 23.8, 102.7, 0.64, 0.59, 5, null],
  ["Westgate School", 219, 13.4, 107.9, 0.87, 0.83, 7, null],
  ["Whitfield Academy", 181, 29.1, 100, 0.58, 0.55, 4, null],
  ["Yewdale High", 247, 7.9, 113.1, 1.09, 1.02, 9, null],
  ["Alderton Secondary", 176, 31.3, 98.2, 0.52, 0.46, 3, null],
  ["Brentfield Academy", 208, 17.6, 105.4, 0.77, 0.72, 6, null],
  ["Crossley Park School", 195, 24.7, 103.1, 0.65, 0.61, 5, null],
  ["Daleside High", 232, 10.2, 110.5, 0.95, 0.92, 8, null],
  ["Eastfield Academy", 185, 27, 101.5, 0.6, 0.53, 4, null],
];

const impactRows2024: MeridianDocumentNode["rows"] = [
  ["Ashworth Academy", 187, 22.4, 102.3, 0.67, 0.6, 5, null],
  ["Beacon Hill Secondary", 214, 14.1, 105.8, 0.78, 0.72, 7, "New headteacher appointed"],
  ["Bridgecroft School", 196, 31.7, 98.6, 0.55, 0.5, 4, null],
  ["Carlton Vale Academy", 203, 18.9, 107.2, 0.87, 0.83, 8, null],
  ["Dene Park High", 178, 28.3, 99.1, 0.57, 0.54, 5, null],
  ["Elmfield Secondary", 221, 11.6, 109.4, 0.96, 0.89, 9, null],
  ["Fairfax School", 192, 25, 101.8, 0.63, 0.57, 6, null],
  ["Granby Park Academy", 168, 34.2, 96.7, 0.5, 0.45, 4, null],
  ["Hartfield High", 245, 9.3, 111.3, 1.08, 1.04, 10, null],
  ["Ingleside School", 183, 27.8, 100.4, 0.61, 0.58, 5, "Strand 2 embedding well this year"],
  ["Jubilee Academy", 210, 16.5, 106.1, 0.82, 0.75, 7, null],
  ["Kingsmead Secondary", 199, 23.1, 103.5, 0.69, 0.63, 6, null],
  ["Langdale High", 175, 30.6, 97.9, 0.53, 0.48, 4, null],
  ["Marshfield Academy", 228, 12.8, 108.7, 0.93, 0.89, 8, null],
  ["Northgate School", 191, 24.4, 102, 0.65, 0.62, 6, null],
  ["Oakfield Secondary", 207, 19.7, 104.9, 0.76, 0.69, 7, null],
  ["Peel Park Academy", 163, 37.1, 94.8, 0.5, 0.44, 4, null],
  ["Queensbury High", 236, 8.4, 112.6, 1.01, 0.96, 9, null],
  ["Redbridge Academy", 188, 26.2, 101.1, 0.59, 0.55, 5, null],
  ["St. Cuthbert's School", 215, 15.3, 106.8, 0.85, 0.82, 8, null],
  ["Thornfield High", 172, 32.9, 97.3, 0.52, 0.45, 4, null],
  ["Uppermill Academy", 204, 20.5, 104.2, 0.74, 0.68, 7, null],
  ["Vale Park Secondary", 193, 23.8, 102.7, 0.67, 0.62, 6, null],
  ["Westgate School", 219, 13.4, 107.9, 0.9, 0.86, 8, null],
  ["Whitfield Academy", 181, 29.1, 100, 0.6, 0.57, 5, null],
  ["Yewdale High", 247, 7.9, 113.1, 1.11, 1.04, 10, null],
  ["Alderton Secondary", 176, 31.3, 98.2, 0.55, 0.49, 4, null],
  ["Brentfield Academy", 208, 17.6, 105.4, 0.8, 0.75, 7, "CPD participation above average"],
  ["Crossley Park School", 195, 24.7, 103.1, 0.68, 0.64, 6, null],
  ["Daleside High", 232, 10.2, 110.5, 0.98, 0.95, 9, null],
  ["Eastfield Academy", 185, 27, 101.5, 0.62, 0.55, 5, null],
];

const makeFolder = (id: string, path: string, children: MeridianNode[], requiresLogin = false, locked = false): MeridianFolderNode => ({
  id,
  name: path.split("/").filter(Boolean).pop() || path,
  path,
  type: "folder",
  children,
  requiresLogin,
  locked,
});

const makeDoc = (node: MeridianDocumentNode): MeridianDocumentNode => node;

export const synergyRoot: MeridianFolderNode = makeFolder("shared-root", "/Shared/", [
  makeFolder("shared-hr", "/Shared/HR/", [
    makeFolder("shared-hr-new-starter-forms", "/Shared/HR/New_Starter_Forms/", [
      makeDoc({
        id: "hr-form",
        name: "[PLAYER]_Onboarding_Forms_v2_FINAL.docx",
        path: "/Shared/HR/New_Starter_Forms/[PLAYER]_Onboarding_Forms_v2_FINAL.docx",
        type: "hr_form",
        requiresLogin: true,
      }),
      makeDoc({
        id: "new-starter-profile",
        name: "New_Starter_Profile_Form_v1.0.docx",
        path: "/Shared/HR/New_Starter_Forms/New_Starter_Profile_Form_v1.0.docx",
        type: "new_starter_profile",
        requiresLogin: true,
      }),
    ], true),
    makeFolder("shared-hr-onboarding", "/Shared/HR/Onboarding/", [
      makeFolder("shared-hr-onboarding-archived", "/Shared/HR/Onboarding/Archived/", [
        makeFolder("shared-hr-onboarding-2026", "/Shared/HR/Onboarding/Archived/2026/", [
          makeFolder("shared-hr-onboarding-2026-newstarters", "/Shared/HR/Onboarding/Archived/2026/NewStarters/", [], true),
        ], true),
      ], true),
    ], true),
  ]),
  makeFolder("shared-projects", "/Shared/Projects/", [
    makeFolder("harrowfield-renewal", "/Shared/Projects/Harrowfield_Renewal/", [], true),
    makeFolder("harrowfield-archive-2018", "/Shared/Projects/Harrowfield_Archive_2018/", [
      makeDoc({
        id: "account-setup-notes",
        name: "Account_Setup_Notes_SZ_2018.docx",
        path: "/Shared/Projects/Harrowfield_Archive_2018/Account_Setup_Notes_SZ_2018.docx",
        type: "document",
        body: saraArchiveNote,
        author: "Sara Ziegler",
        requiresLogin: true,
      }),
      makeDoc({
        id: "internal-comms-chain",
        name: "Internal_Comms_Chain_2018.pdf",
        path: "/Shared/Projects/Harrowfield_Archive_2018/Internal_Comms_Chain_2018.pdf",
        type: "pdf",
        body: internalCommsBody,
        requiresLogin: true,
      }),
    ], true),
    makeFolder("mpi-framework-review", "/Shared/Projects/MPI_Framework_Review_2021/", [], true),
    makeFolder("structured-learning-pathways", "/Shared/Projects/Structured_Learning_Pathways/", [], true),
  ]),
  makeFolder("shared-training", "/Shared/Training/", [
    makeFolder("shared-training-paul-induction", "/Shared/Training/Paul_Induction/", [
      makeFolder("shared-training-paul-induction-reading", "/Shared/Training/Paul_Induction/Reading/", [
        makeDoc({
          id: "induction-deck",
          name: "Induction_Deck_v3_FINAL_2019.pptx",
          path: "/Shared/Training/Paul_Induction/Reading/Induction_Deck_v3_FINAL_2019.pptx",
          type: "pptx",
          slides: inductionSlides,
          requiresLogin: true,
        }),
      ], true),
    ], true),
  ]),
  makeFolder("shared-staff-folders", "/Shared/Staff_Folders/", [
    makeFolder("shared-staff-academic-team", "/Shared/Staff_Folders/Academic_Team/", [
      makeFolder("shared-staff-pauls-files", "/Shared/Staff_Folders/Academic_Team/Paul's Files/", [
        makeFolder("shared-staff-pauls-reading", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Reading/", [
          makeFolder("shared-staff-pauls-reading-essential", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Reading/Essential/", [
            makeDoc({
              id: "football-drills",
              name: "football_drills_Y9B.xlsx",
              path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Reading/Essential/football_drills_Y9B.xlsx",
              type: "spreadsheet",
              headers: footballDrillsHeaders,
              rows: footballDrillsRows,
              requiresLogin: true,
            }),
          ], true),
        ], true),
        makeFolder("shared-staff-pauls-resources", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/", [
          makeFolder("shared-staff-pauls-academic-reading", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/", [
            makeFolder("shared-staff-pauls-essential-materials", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/", [
              makeFolder("shared-staff-pauls-correct-essential", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/", [
                makeDoc({
                  id: "essential-ch3",
                  name: "ESSENTIAL_Ch3_MPI_Measurement_Framework.docx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/ESSENTIAL_Ch3_MPI_Measurement_Framework.docx",
                  type: "document",
                  body: chapter3Body,
                  middleEnglish: true,
                  requiresLogin: true,
                }),
                makeDoc({
                  id: "essential-ch7",
                  name: "ESSENTIAL_Ch7_Reporting_and_Analysis.docx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/ESSENTIAL_Ch7_Reporting_and_Analysis.docx",
                  type: "document",
                  body: chapter7Body,
                  middleEnglish: true,
                  requiresLogin: true,
                }),
                makeDoc({
                  id: "essential-ch9",
                  name: "ESSENTIAL_Ch9_School_Partnership_Requirements.docx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/ESSENTIAL_Ch9_School_Partnership_Requirements.docx",
                  type: "document",
                  body: chapter9Body,
                  middleEnglish: true,
                  requiresLogin: true,
                }),
                makeDoc({
                  id: "essential-ch11",
                  name: "ESSENTIAL_Ch11_Compliance_and_Fidelity_Standards.docx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/ESSENTIAL_Ch11_Compliance_and_Fidelity_Standards.docx",
                  type: "document",
                  body: chapter11Body,
                  middleEnglish: true,
                  requiresLogin: true,
                }),
                makeDoc({
                  id: "essential-notes",
                  name: "ESSENTIAL_Reading_Notes_General.docx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Resources/Academic Reading/Essential Materials/Essential/ESSENTIAL_Reading_Notes_General.docx",
                  type: "document",
                  body: readingNotesBody,
                  middleEnglish: true,
                  requiresLogin: true,
                }),
              ], true),
            ], true),
          ], true),
        ], true),
        makeFolder("shared-staff-pauls-data", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Data/", [
          makeFolder("shared-staff-pauls-data-q3", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Data/Q3/", [
            makeFolder("shared-staff-pauls-data-drafts", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Data/Q3/Drafts/", [
              makeFolder("shared-staff-pauls-data-final", "/Shared/Staff_Folders/Academic_Team/Paul's Files/Data/Q3/Drafts/Final_v1/", [
                makeDoc({
                  id: "att-data-export",
                  name: "ATT_DATA_EXPORT_DO_NOT_EDIT_FINAL.xlsx",
                  path: "/Shared/Staff_Folders/Academic_Team/Paul's Files/Data/Q3/Drafts/Final_v1/ATT_DATA_EXPORT_DO_NOT_EDIT_FINAL.xlsx",
                  type: "spreadsheet",
                  headers: ["SchoolName", "Q3_Att_%", "SEN_Flag", "FSM_Flag", "Region", "Notes"],
                  rows: [
                    ["Ashcroft Academy", "94.2%", "Y", "N", "South West", "Above target"],
                    ["Bardsley High", "89.5%", "N", "Y", "North West", "High absence Friday"],
                    ["Carlton Vale Academy", "96.1%", "N", "N", "South West", "Stable"],
                  ],
                  requiresLogin: true,
                }),
              ], true),
            ], true),
          ], true),
        ], true),
      ], true),
    ], true),
  ]),
  makeFolder("shared-impact-data", "/Shared/Impact_Data/", [
    makeFolder("shared-impact-data-current", "/Shared/Impact_Data/MPI_Current/", [
      makeDoc({
        id: "impact-2022",
        name: "MPI_Harrowfield_2022.xlsx",
        path: "/Shared/Impact_Data/MPI_Current/MPI_Harrowfield_2022.xlsx",
        type: "spreadsheet",
        headers: impact2022Headers,
        rows: impactRows2022,
        author: "P.A.Hart",
        requiresLogin: true,
      }),
      makeDoc({
        id: "impact-2023",
        name: "MPI_Harrowfield_2023.xlsx",
        path: "/Shared/Impact_Data/MPI_Current/MPI_Harrowfield_2023.xlsx",
        type: "spreadsheet",
        headers: impact2023Headers,
        rows: impactRows2023,
        requiresLogin: true,
      }),
      makeDoc({
        id: "impact-2024",
        name: "MPI_Harrowfield_2024.xlsx",
        path: "/Shared/Impact_Data/MPI_Current/MPI_Harrowfield_2024.xlsx",
        type: "spreadsheet",
        headers: impact2024Headers,
        rows: impactRows2024,
        requiresLogin: true,
      }),
    ], true),
    makeFolder("shared-impact-data-archive", "/Shared/Impact_Data/MPI_v2_archive/", [], true),
  ]),
  makeFolder("shared-resources", "/Shared/Resources/", [
    makeFolder("shared-resources-data-standards", "/Shared/Resources/Data_Standards/", [
      makeDoc({
        id: "mpi-reporting-standards",
        name: "MPI_Reporting_Standards_v2.docx",
        path: "/Shared/Resources/Data_Standards/MPI_Reporting_Standards_v2.docx",
        type: "document",
        body: dataStandardsBody,
        requiresLogin: true,
      }),
    ], true),
  ]),
  makeFolder("shared-archive-do-not-use", "/Shared/Archive_DO_NOT_USE/", [
    makeDoc({
      id: "mpi-archive-2023",
      name: "MPI_v2_archive_2023.xlsx",
      path: "/Shared/Archive_DO_NOT_USE/MPI_v2_archive_2023.xlsx",
      type: "spreadsheet",
      headers: ["School Name", "Cohort Size", "FSM %", "KS2 Avg Baseline", "Avg_Progress_Score", "Progress 8 Equiv.", "MPI Programme Year", "Notes"],
      rows: [
        ["Ashworth Academy", 187, 22.4, 102.3, 0.61, 0.54, 3, null],
        ["Beacon Hill Secondary", 214, 14.1, 105.8, 0.73, 0.67, 5, null],
        ["Bridgecroft School", 196, 31.7, 98.6, 0.49, 0.44, 2, "New coordinator appointed Sept 2022"],
        ["Carlton Vale Academy", 203, 18.9, 107.2, 0.82, 0.78, 6, null],
        ["Dene Park High", 178, 28.3, 99.1, 0.53, 0.5, 3, null],
        ["Elmfield Secondary", 221, 11.6, 109.4, 0.91, 0.84, 7, null],
        ["Fairfax School", 192, 25, 101.8, 0.58, 0.52, 4, null],
        ["Granby Park Academy", 168, 34.2, 96.7, 0.45, 0.4, 2, "Building works Q1 — some disruption to timetable"],
        ["Hartfield High", 245, 9.3, 111.3, 1.04, 1, 8, null],
        ["Ingleside School", 183, 27.8, 100.4, 0.56, 0.53, 3, null],
        ["Jubilee Academy", 210, 16.5, 106.1, 0.77, 0.7, 5, null],
        ["Kingsmead Secondary", 199, 23.1, 103.5, 0.64, 0.58, 4, null],
        ["Langdale High", 175, 30.6, 97.9, 0.48, 0.43, 2, null],
        ["Marshfield Academy", 228, 12.8, 108.7, 0.88, 0.84, 6, null],
        ["Northgate School", 191, 24.4, 102, 0.6, 0.57, 4, null],
        ["Oakfield Secondary", 207, 19.7, 104.9, 0.71, 0.64, 5, null],
        ["Peel Park Academy", 163, 37.1, 94.8, 0.46, 0.4, 2, "Ofsted visit March 2022"],
        ["Queensbury High", 236, 8.4, 112.6, 0.97, 0.92, 7, null],
        ["Redbridge Academy", 188, 26.2, 101.1, 0.54, 0.5, 3, null],
        ["St. Cuthbert's School", 215, 15.3, 106.8, 0.8, 0.77, 6, null],
        ["Thornfield High", 172, 32.9, 97.3, 0.47, 0.4, 2, null],
        ["Uppermill Academy", 204, 20.5, 104.2, 0.69, 0.63, 5, null],
        ["Vale Park Secondary", 193, 23.8, 102.7, 0.62, 0.57, 4, null],
        ["Westgate School", 219, 13.4, 107.9, 0.85, 0.81, 6, null],
        ["Whitfield Academy", 181, 29.1, 100, 0.55, 0.52, 3, null],
        ["Yewdale High", 247, 7.9, 113.1, 1.07, 1, 8, null],
        ["Alderton Secondary", 176, 31.3, 98.2, 0.5, 0.44, 2, null],
        ["Brentfield Academy", 208, 17.6, 105.4, 0.75, 0.7, 5, null],
        ["Crossley Park School", 195, 24.7, 103.1, 0.63, 0.59, 4, null],
        ["Daleside High", 232, 10.2, 110.5, 0.93, 0.9, 7, null],
        ["Eastfield Academy", 185, 27, 101.5, 0.57, 0.5, 3, "Staff restructure mid-year"],
        ["Firth Park Academy", 189, 21.3, 103.8, 0.66, 0.61, 4, null],
        ["Greenwood Secondary", 201, 16.8, 106.4, 0.79, 0.74, 5, null],
        ["Hillside Academy", 174, 29.5, 98.4, 0.51, 0.46, 2, null],
        ["Ivybridge School", 213, 13.9, 107.6, 0.86, 0.81, 6, null],
        ["Jasper Hill High", 198, 22.7, 104.1, 0.68, 0.62, 4, null],
        ["Kingswood Secondary", 206, 18.2, 105.9, 0.76, 0.71, 5, null],
        ["Lakeside Academy", 182, 26.4, 101.2, 0.59, 0.54, 3, null],
        ["Meadowfield School", 217, 12.1, 109.1, 0.89, 0.85, 6, null],
        ["Northwood Academy", 194, 23.5, 102.9, 0.65, 0.6, 4, null],
        ["Oaklands Secondary", 209, 17.9, 105.2, 0.74, 0.68, 5, null],
        ["Parkside High", 177, 28.9, 99.6, 0.52, 0.47, 2, null],
        ["Queensway Academy", 223, 11.2, 110.8, 0.92, 0.87, 7, null],
        ["Riverside School", 186, 24.1, 102.4, 0.61, 0.56, 3, null],
        ["Southfield Academy", 195, 19.8, 104.6, 0.72, 0.67, 4, null],
        ["Townsend High", 203, 15.6, 106.7, 0.81, 0.76, 5, null],
        ["Upton Park Secondary", 188, 27.2, 100.8, 0.57, 0.52, 3, null],
        ["Vernon Academy", 214, 14.5, 107.3, 0.83, 0.78, 6, null],
        ["Westwood School", 196, 21.9, 103.9, 0.7, 0.65, 4, null],
      ],
      requiresLogin: true,
    }),
  ], true, true),
  makeFolder("shared-reading", "/Shared/Reading/", [
    makeDoc({
      id: "deprecated-reading-list",
      name: "Reading_List_DEPRECATED_2017.docx",
      path: "/Shared/Reading/Reading_List_DEPRECATED_2017.docx",
      type: "document",
      body: deprecatedReadingBody,
      requiresLogin: true,
    }),
  ], true),
  makeFolder("shared-general", "/Shared/General/", [
    makeDoc({
      id: "mpi-overview",
      name: "MPI_Programme_Overview.docx",
      path: "/Shared/General/MPI_Programme_Overview.docx",
      type: "quiz",
      body: mpiOverviewBody,
      pageCount: 4,
      requiresLogin: true,
    }),
    makeDoc({
      id: "mpi-handbook",
      name: "MPI_Technical_Handbook_v4.2.docx",
      path: "/Shared/General/MPI_Technical_Handbook_v4.2.docx",
      type: "document",
      body: handbookBody,
      requiresLogin: true,
    }),
  ], true),
]);

const pathIndex = new Map<string, MeridianNode>();
const idIndex = new Map<string, MeridianNode>();

const indexNode = (node: MeridianNode) => {
  pathIndex.set(node.path, node);
  idIndex.set(node.id, node);
  if (node.type === "folder") {
    node.children.forEach(indexNode);
  }
};

indexNode(synergyRoot);

export const findNodeByPath = (path: string): MeridianNode | undefined => pathIndex.get(path);
export const findNodeById = (id: string): MeridianNode | undefined => idIndex.get(id);

export const getFolderChildren = (path: string): MeridianNode[] => {
  const node = findNodeByPath(path);
  if (!node || node.type !== "folder") {
    return [];
  }
  return node.children;
};

export const getAllDocumentNodes = (): MeridianDocumentNode[] => {
  const documents: MeridianDocumentNode[] = [];
  idIndex.forEach((node) => {
    if (node.type !== "folder") {
      documents.push(node);
    }
  });
  return documents;
};
