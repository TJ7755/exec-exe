# Meridian Infrastructure Services — Game Design Specification

This document provides a comprehensive design specification for the Meridian Infrastructure Services game, covering gameplay mechanics, technical implementation, narrative design, and UI/UX guidelines.

## Table of Contents

1. [Game Overview](#game-overview)
2. [Company & Scenario](#company--scenario)
3. [NPC Cast](#npc-cast)
4. [Game Systems](#game-systems)
5. [Day-by-Day Walkthrough](#day-by-day-walkthrough)
6. [Technical Architecture](#technical-architecture)
7. [UI/UX Design System](#uiux-design-system)
8. [Development Guidelines](#development-guidelines)

---

## Game Overview

### Premise
The player assumes the role of a Junior Data Asset Officer at Meridian Infrastructure Services, a managed service provider for NHS England. The game simulates the challenges of maintaining data integrity in a complex organisational environment where competing pressures (compliance, management expectations, and professional ethics) create difficult decision-making scenarios.

### Player Role
- **Title:** Junior Data Asset Officer
- **Internal Title:** Data Janitor
- **Responsibilities:** Asset data reconciliation, dashboard maintenance, compliance reporting

### Setting
- **Company:** Meridian Infrastructure Services
- **Client:** NHS England
- **Scope:** Multiple NHS sites managed by MIS
- **Primary Focus:** Royal Western Hospital (Boiler Plant asset register)

### Core Gameplay Loop
1. Receive tasks via email (Outbox) or messaging (Flack)
2. Investigate discrepancies using tools (Synergy Drive, ExecuTerm)
3. Make decisions that affect data integrity, reputation, and stress
4. Navigate office politics and competing priorities
5. Face consequences of decisions in subsequent days

---

## Company & Scenario

### Meridian Infrastructure Services

**Tagline:** "Infrastructure Services for NHS England"

**Accent Colour:** `#1B3A5C` (Navy Blue)

**Description:**
Meridian Infrastructure Services (MIS) is a managed service provider contracted by NHS England to maintain asset data registers across multiple NHS sites. The company specialises in infrastructure data management, providing services including asset tracking, compliance reporting, and data quality assurance.

**Key Personnel:**
- **James Siren** — COO (Chief Operating Officer), philosophical leadership style
- **Nathaniel Willers** — Asset Data Team Lead, focused on dashboard targets
- **Harry Holmes** — Senior Data Analyst, responsible for 2022 cleanup
- **Rosa Vega** — Senior Data Analyst, institutional knowledge, honest about problems
- **Tom** — IT Support, helpful but informal
- **Claire Talker** — Programme Director, Digital Infrastructure (NHS England)
- **Diane Osei** — Facilities Manager, Royal Western Hospital
- **Sandra** — HR, onboarding and policy

### Scenario Context

**The Royal Western Problem:**
Royal Western Hospital's boiler plant asset register contains discrepancies between the hospital's records (Sheet A) and the MIS dashboard (Sheet B). These discrepancies stem from a 2022 data cleanup performed by Harry Holmes that introduced errors. The player must reconcile these while balancing:
- Nathaniel's demand for a "Green" dashboard
- James Siren's emphasis on data integrity and stewardship
- Rosa's advice about professional ethics
- Claire's changing XML format requirements
- Diane's compliance concerns about BLR-008 and BLR-011

---

## NPC Cast

### Nathaniel Willers
- **Role:** Asset Data Team Lead
- **Department:** Asset Data Management
- **Avatar Colour:** `#4a90e2` (Blue)
- **Email:** nathaniel.willers@meridian-infrastructure.co.uk
- **Extension:** 4201
- **Voice:** Professional, target-oriented, impatient with anything that threatens dashboard metrics
- **Personality:** Results-driven, believes "Green is good," resistant to acknowledging systemic issues

### Rosa Vega
- **Role:** Senior Data Analyst
- **Department:** Asset Data Management
- **Avatar Colour:** `#e74c3c` (Red)
- **Email:** rosa.vega@meridian-infrastructure.co.uk
- **Extension:** 4203
- **Voice:** Experienced, cynical but helpful, brutally honest about problems
- **Personality:** Institutional knowledge keeper, cares about data integrity over targets

### Harry Holmes
- **Role:** Senior Data Analyst
- **Department:** Asset Data Management
- **Avatar Colour:** `#f39c12` (Orange)
- **Email:** harry.holmes@meridian-infrastructure.co.uk
- **Extension:** 4202
- **Voice:** Casual, defensive about his work, dismissive of problems
- **Personality:** Made errors in 2022 cleanup, resistant to criticism, claims errors are "intentional placeholders"

### Tom
- **Role:** IT Support
- **Department:** IT Services
- **Avatar Colour:** `#9b59b6` (Purple)
- **Email:** tom@meridian-infrastructure.co.uk
- **Extension:** 4001
- **Voice:** Informal, helpful, uses lowercase messages, knows the system well
- **Personality:** Friendly, informal, willing to help with technical issues

### Diane Osei
- **Role:** Facilities Manager
- **Department:** Royal Western Hospital (External)
- **Avatar Colour:** `#1abc9c` (Teal)
- **Email:** diane.osei@royalwestern.nhs.uk
- **Voice:** Professional, concerned about compliance, direct
- **Personality:** Patient but persistent, focused on audit preparation

### Claire Talker
- **Role:** Programme Director, Digital Infrastructure
- **Department:** NHS England (External)
- **Avatar Colour:** `#34495e** (Dark Grey)
- **Email:** claire.talker@nhsengland.nhs.uk
- **Extension:** 5001
- **Voice:** Formal, bureaucratic, focused on compliance and standards
- **Personality:** Implements policy changes, communicates requirements clearly

### James Siren
- **Role:** COO
- **Department:** Executive
- **Avatar Colour:** `#2ecc71` (Green)
- **Email:** james.siren@meridian-infrastructure.co.uk
- **Extension:** 1001
- **Voice:** Philosophical, uses religious/stewardship language, expects integrity
- **Personality:** Values data integrity above all, references Augustine, expects stewardship

### Sandra
- **Role:** HR
- **Department:** Human Resources
- **Avatar Colour:** `#e91e63** (Pink)
- **Email:** sandra@meridian-infrastructure.co.uk
- **Extension:** 3001
- **Voice:** Professional, procedural, welcoming
- **Personality:** Handles onboarding, policy compliance, employee concerns

---

## Game Systems

### Game Time System

**Time Compression:** 7.5 game seconds per real second

**Work Day:** 09:00 to 17:00 (480 game minutes)

**Time Tracking:**
- `sessionStartRealMs` — Real-time when session started
- `sessionStartGameMinutes` — Game time when session started
- `currentDay` — Current day (1 = Monday, 2 = Tuesday, etc.)
- `currentGameMinutes` — Current game minutes (0 = 09:00)
- `isPaused` — Whether game time is paused
- `dialogueBlocked` — Whether game time is blocked during dialogue choices
- `compressionRatio` — Time compression ratio (7.5)

**Pause States:**
- Manual pause by player
- Dialogue choice active (blocks game minute advancement)
- Event-triggered pauses

### Session Persistence

**Save Key:** `'mis_save_v1'`

**Save Data Structure:**
```typescript
{
  displayName: string;
  stats: {
    competence: number;
    accuracy: number;
    stress: number;
  };
  reputation: {
    nathaniel: number;
    rosa: number;
    harry: number;
    james: number;
    diane: number;
    claire: number;
    tom: number;
    sandra: number;
  };
  hiddenState: HiddenState;
  gameTime: GameTime;
  flack: FlackState;
  outbox: OutboxState;
  synergy: SynergyState;
}
```

**Debounced Save:** 2-second debounce to avoid excessive localStorage writes

### Dialogue Choice System

**Three Rendering Types:**

**Type A: Flack DM (Inline)**
- Renders in Flack DM conversation
- Shows lettered options (A, B, C, D)
- Pauses game time during active choice
- Applies consequences on selection
- Stores resolved choices for future reference

**Type B: Email (Inline)**
- Renders in Outbox email thread
- Shows lettered options
- Pauses game time during active choice
- Applies consequences on selection
- Stores resolved choices

**Type C: Standalone (Removed)**
- Originally planned but removed
- Abrupt, disrupted flow
- All TypeC choices migrated to Type A or B

**Consequence Types:**
- `statDeltas` — Changes to competence, accuracy, stress
- `repDeltas` — Changes to reputation with NPCs
- `hiddenFlags` — Sets or unsets hidden state flags
- `triggerEventIds` — Triggers manual events
- `npcFollowUpKey` — Triggers NPC response from response map

### Hidden State System

**Monday Flags:**
- `signedAUPImmediately` — Signed AUP without reading
- `readHandbookProperly` — Read handbook thoroughly
- `sheetTaskArrived` — Sheet reconciliation task received
- `sheetReconciliationApproach` — How player handled reconciliation
- `sheetReconciliationTarget` — Target dashboard status (green, amber, honest)
- `dashboardIntegrityCompromised` — Player compromised data integrity
- `nathanielToldTruth` — Player told Nathaniel the truth
- `askedRosaForHelp` — Player asked Rosa for help
- `rosaTrustLevel` — Rosa's trust in player (0-2)
- `blr008EscalatedInStandup` — Player escalated BLR-008 in standup
- `blr011Fixed` — Player fixed BLR-011
- `harryErrorCorrectedQuietly` — Player fixed Harry's error without reporting
- `harryErrorReportedToNathaniel` — Player reported Harry's error to Nathaniel
- `askedHarryAboutBLR011` — Player asked Harry about BLR-011
- `acceptedHarryExplanation` — Player accepted Harry's explanation
- `playerPushedBackOnHarry` — Player challenged Harry's explanation
- `rosaConfirmedHarryWrong` — Rosa confirmed Harry was wrong
- `harryBlamed` — Harry was blamed for error
- `madeGreenClaimInStandup` — Player claimed dashboard was green when integrity compromised
- `madeGreenClaimToSiren` — Player claimed dashboard was green to Siren when integrity compromised
- `playerUsedReligiousLanguage` — Player used stewardship/religious language
- `acceptedHarryWalkthrough` — Player accepted Harry's methodology walkthrough
- `nathanielToldTruth` — Nathaniel told player about green dashboard issues

**Tuesday Flags:**
- `blr011InvestigationAvailable` — BLR-011 investigation options available
- `blr011InvestigationComplete` — BLR-011 investigation completed
- `blr011HistoryViewed` — Asset history viewed
- `blr011HarryLogViewed` — Harry's change log viewed
- `blr011DianeContacted` — Player contacted Diane about BLR-011
- `blr011ComplianceRisk` — BLR-011 flagged as compliance risk
- `dianeEmailsReceived` — Count of Diane's emails received
- `toldSirenTruth` — Player told Siren the truth about reconciliation
- `claireRequirementsVersion` — Version of Claire's XML requirements
- `currentDayOvertimeStarted` — Player started overtime today
- `currentDayOvertimeMinutes` — Overtime minutes today
- `totalOvertimeMinutes` — Cumulative overtime minutes

**Accumulating Flags:**
- `dashboardIntegrityCompromised` — Set if player compromised data integrity
- `readHandbookProperly` — Set if player read handbook thoroughly

---

## Day-by-Day Walkthrough

### Monday — Day 1

**09:00 — Tom Welcome**
- Tom welcomes player via Flack DM
- Explains the role and provides context
- Mentions the AUP needs signing

**09:15 — AUP Decision**
- Player receives AUP via Synergy Drive
- Choice: Sign immediately, read thoroughly, ignore
- Consequences affect later interactions with James Siren

**09:30 — Nathaniel Onboarding**
- Nathaniel assigns Royal Western reconciliation task
- Emphasises dashboard must be "Green"
- Provides brief context about the site

**09:45 — Harry Introduction**
- Harry introduces himself
- Offers to walk player through his methodology
- Mentions the 2022 cleanup

**10:00 — Rosa Introduction**
- Rosa introduces herself
- Provides informal context about the team
- Hinted at problems with Harry's work

**12:00 — Lunch**
- Lunch notification
- Tom sends casual message

**13:00 — Sheet Task Arrives**
- Sheet reconciliation task arrives via email
- Player must reconcile Sheet A (hospital records) with Sheet B (MIS dashboard)

**13:30 — Diane Email (BLR-008)**
- Diane emails about BLR-008 overdue service
- 18-month overdue service at Royal Western
- Asks for service date

**14:00 — Reconciliation Choice**
- Player completes reconciliation
- Four options: change numbers, flag discrepancies, ask Rosa, be honest
- Consequences: stat deltas, reputation changes, hidden flags

**14:30 — Rosa Advice (if asked)**
- If player asked for help, Rosa provides guidance
- Explains Sheet A is truth, Sheet B is wrong
- Advises on how to handle the situation

**15:00 — Nathaniel Pressure Moment**
- Nathaniel reminds player dashboard must be Green by end of day
- James is watching closely

**16:00 — AUP Deadline Reminder**
- Reminder if AUP not acknowledged

**17:00 — End of Day Choice**
- Skip to Tuesday or stay overtime
- Overtime tracked if chosen

### Tuesday — Day 2

**09:00 — Standup**
- Team standup in Flack #asset-data-team
- Dynamic options based on Monday's outcome
- Player reports dashboard status
- Option to escalate BLR-008

**11:00 — Siren Data Quality Review**
- ExecuTerm call with James Siren
- James asks about reconciliation approach
- Harry offers to walk player through methodology
- Dynamic options based on AUP reading and dashboard integrity

**12:00 — Lunch**
- Lunch notification
- Tom sends casual message

**12:30 — Harry Error Surfaces**
- Diane emails about BLR-011 (decommissioned asset showing as Active)
- Compliance audit in 6 weeks
- Sets hidden flag for compliance risk

**12:45 — BLR-011 Investigation Available**
- Notification that investigation options available
- Three investigation paths: asset history, Harry's log, contact Diane

**13:45 — BLR-011 Crisis**
- Email dialogue choice about how to handle BLR-011
- Four options: fix quietly, tell Nathaniel, ask Harry, delay
- Each option triggers different consequences and follow-up events

**14:30 — Claire First Contact**
- Claire emails about XML format requirement change
- NHS CAFM-compatible XML required
- Compliance requirement

**17:00 — End of Day**
- Skip to Wednesday or stay overtime

---

## Technical Architecture

### Redux Store Structure

**Player Store:** `src/player/store.ts`
- Manages player state (stats, reputation, hidden state, game time)
- Handles session persistence with debounced saves
- Reducer for all player-related actions

**Dialogue Store:** `src/player/dialogueStore.ts`
- Manages active and resolved dialogues
- Tracks dialogue choices and consequences
- Reducer for dialogue-related actions

**Flack Store:** (integrated with player store)
- Manages Flack messages, channels, DMs
- Handles message rendering and markdown parsing

**Outbox Store:** (integrated with player store)
- Manages emails, folders, drafts
- Handles email display and composition

**Synergy Store:** (integrated with player store)
- Manages file tree, document viewing
- Handles interactive documents (Risk Register, Task Board, Sheet Reconciliation)

### Event System

**Event Types:**
- `time_trigger` — Fires at specific game time on specific day
- `manual` — Triggered by player action
- `state_trigger` — Fires when specific state condition met

**Event Structure:**
```typescript
{
  id: string;
  type: 'time_trigger' | 'manual' | 'state_trigger';
  triggerDay: number;
  triggerGameMinute: number;
  fired: boolean;
  action: (dispatch, getState) => void;
}
```

**Event Files:**
- `src/player/events/monday.ts` — Monday events
- `src/player/events/tuesday.ts` — Tuesday events
- Future days will have separate files

### Component Structure

**Main App:** `src/App.jsx`
- Renders the Windows 11 desktop environment
- Manages app windows and state

**Apps:** `src/apps/`
- `meridianbrowse/` — Browser with intranet simulation
- `flack/` — Messaging app with dialogue integration
- `executerm/` — Terminal with command system
- `outbox/` — Email client with dialogue integration
- `synergy/` — File explorer and document viewer

**Dialogue Components:** `src/components/dialogue/`
- `DialogueChoice.tsx` — Core dialogue choice component
- `FlackDialogueChoice.tsx` — Type A (Flack DM) rendering
- `EmailDialogueChoice.tsx` — Type B (Email) rendering

### Data Structures

**Scenario Data:** `src/scenarios/meridian/`
- `company.ts` — Company information
- `npcs.ts` — NPC definitions and response maps
- `player.ts` — Player role definition
- `documents/` — Document content (Risk Register, Task Board, Sheet Reconciliation)

**NPC Response System:** `src/scenarios/meridian/npcResponses.ts`
- Maps NPC response keys to actual response text
- Supports dynamic responses based on hidden state
- Fallback responses for undefined keys

---

## UI/UX Design System

### Typography

**Font Pairing:**
- **Headings:** Space Grotesk (500, 600, 700 weights)
- **Body:** Inter (400, 500, 600, 700 weights)
- **Terminal:** Consolas, Monaco, Courier New, monospace (ExecuTerm only)

**Font Variables:**
```css
:root {
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

**Application:**
- All headings use `var(--font-heading)`
- All body text uses `var(--font-body)`
- ExecuTerm keeps monospace for terminal aesthetic

### Colour System

**Brand Colours:**
- **Primary (MIS Navy):** `#1B3A5C`
- **Active/Selection:** `#0078d4`
- **Success:** `#2ecc71`
- **Warning:** `#f39c12`
- **Error:** `#e74c3c`
- **Neutral:** `#666`, `#999`, `#ccc`

**NPC Avatar Colours:**
- Nathaniel: `#4a90e2`
- Rosa: `#e74c3c`
- Harry: `#f39c12`
- Tom: `#9b59b6`
- Diane: `#1abc9c`
- Claire: `#34495e`
- James: `#2ecc71`
- Sandra: `#e91e63`

### Spacing System

**Base Unit:** 4px

**Spacing Scale:**
- 4px — Micro spacing (icons, badges)
- 8px — Tight spacing (inline elements)
- 12px — Normal spacing (list items)
- 16px — Comfortable spacing (sections)
- 20px — Generous spacing (headings)
- 24px — Section spacing
- 32px — Major section spacing

### Border Radius

**Standard:** 2px (cardless design)
**Interactive Elements:** 4px
**Avatars:** 50% (circular)
**Special Cases:** 6px (workspace icon)

### Shadows

**Minimal:** `0 1px 3px rgba(0,0,0,0.1)`
**Medium:** `0 1px 3px rgba(0,0,0,0.15)`
**Heavy:** `0 2px 6px rgba(0,0,0,0.2)`

**Cardless Design:**
- Shadows removed from UI elements
- Use borders, dividers, and spacing instead
- Only semantic content cards retain subtle shadows

### Cardless Design Principles

**What is Cardless:**
- UI elements should not look like floating cards
- Use borders, dividers, and spacing for separation
- Left-border highlights for selection states
- Integrated styling rather than isolated containers

**Implementation:**
- **Flack:** Message bubbles use left-border colour coding instead of backgrounds
- **Outbox:** Email list items use left-border highlights for selected/unread
- **Synergy:** Task cards use left-border colour coding for priority
- **MeridianBrowse:** Intranet content uses dividers and spacing

**Semantic Cards:**
- Content cards (welcome cards, announcement cards, person cards) are allowed
- These represent actual content, not UI elements
- Keep shadows subtle

### Motion Discipline

**Animation Principles:**
- Subtle and purposeful
- Never distract from content
- Enhance user understanding
- Respect user preferences (reduced motion)

**Signature Moves:**
- **MeridianBrowse:** Scanning line on monitoring banner, logo pulse on hover
- **Flack:** Message arrival animation (slide in with fade)
- **Outbox:** Email selection slide animation
- **Synergy:** Document fade-in on load
- **ExecuTerm:** Blinking cursor, boot sequence

**Animation Durations:**
- Micro: 0.15s (hover states)
- Short: 0.3s (message arrival)
- Medium: 0.4s (document fade-in)
- Long: 2s (logo pulse, scanning line)

### Accessibility

**Keyboard Navigation:**
- All interactive elements keyboard-accessible
- Tab order logical
- Focus states visible

**Colour Contrast:**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Avoid colour-only indicators

**Screen Readers:**
- Semantic HTML
- ARIA labels where needed
- Alt text for images

**Reduced Motion:**
- Respect `prefers-reduced-motion`
- Provide option to disable animations

---

## Development Guidelines

### Adding New Events

**Event File Structure:**
```typescript
export const dayEvents: GameEvent[] = [
  {
    id: 'event_id',
    type: 'time_trigger',
    triggerDay: 3,
    triggerGameMinute: 120, // 11:00
    fired: false,
    action: (dispatch, getState) => {
      // Event logic
    }
  }
];
```

**Helper Functions:**
- `addFlackMessage(dispatch, participantId, content)`
- `addFlackChannelMessage(dispatch, channel, senderId, content)`
- `setHiddenFlag(flag, value)`
- `updateStats(deltas)`
- `addNotification(notification)`

### Adding New NPCs

**NPC Definition:**
```typescript
{
  id: 'npc_id',
  name: 'NPC Name',
  role: 'Role',
  department: 'Department',
  avatarColour: '#hex',
  email: 'email@domain.com',
  extension: 'XXXX',
  voice: 'Voice description',
  responses: {
    responseKey: 'Response text'
  }
}
```

**Response Map:**
- Add responses to `responses` object
- Use descriptive keys
- Support conditional responses in implementation

### Adding Dialogue Choices

**Dialogue Choice Structure:**
```typescript
{
  id: 'choice_id',
  type: 'flack_dm' | 'email' | 'system',
  contextId: 'context',
  prompt: 'Prompt text',
  options: [
    {
      id: 'option_id',
      label: 'Option label',
      subtext: 'Additional context',
      consequences: {
        statDeltas: { competence: 1 },
        repDeltas: { nathaniel: 1 },
        hiddenFlags: { flagName: true },
        triggerEventIds: ['event_id'],
        npcFollowUpKey: 'response_key'
      }
    }
  ],
  resolvedOptionId: null
}
```

### Adding Documents

**Document Types:**
- `MarkdownViewer` — Standard markdown documents
- `RiskRegister` — Interactive risk table
- `TaskBoard` — Kanban-style task board
- `SheetReconciliation` — Interactive reconciliation tool

**Document Location:** `src/scenarios/meridian/documents/`

### Adding New Apps

**App Structure:**
```
src/apps/app-name/
  index.jsx       // Main component
  app-name.scss   // Styles
```

**App Integration:**
- Add to apps registry in main app
- Follow design system guidelines
- Use font variables
- Implement cardless design
- Add signature moves

### Testing Guidelines

**Manual Testing:**
- Follow TESTING_GUIDE.md
- Test each day independently
- Test all dialogue choice paths
- Verify stat/reputation changes
- Check hidden state flags

**Key Test Cases:**
- AUP signing affects James interaction
- Reconciliation choice affects Tuesday standup
- BLR-011 handling affects consequences
- Overtime tracking works correctly
- Session persistence works across reloads

### Git Workflow

**Branching:**
- `main` — Stable production code
- `feature/` — Feature branches
- `fix/` — Bug fix branches

**Commit Messages:**
- Use conventional commits
- Describe what and why, not how
- Reference issue numbers if applicable

**Code Review:**
- Review for design system compliance
- Check for cardless design violations
- Verify font usage
- Test accessibility

---

## Appendix

### File Reference

**Core Game Files:**
- `src/player/store.ts` — Player state management
- `src/player/gameTime.ts` — Game time system
- `src/player/hiddenState.ts` — Hidden state definitions
- `src/player/dialogueStore.ts` — Dialogue state management
- `src/player/events/` — Event definitions by day

**Scenario Files:**
- `src/scenarios/meridian/company.ts` — Company definition
- `src/scenarios/meridian/npcs.ts` — NPC definitions
- `src/scenarios/meridian/player.ts` — Player definition
- `src/scenarios/meridian/npcResponses.ts` — NPC response map

**App Files:**
- `src/apps/meridianbrowse/` — Browser app
- `src/apps/flack/` — Messaging app
- `src/apps/executerm/` — Terminal app
- `src/apps/outbox/` — Email app
- `src/apps/synergy/` — File explorer app

**Design Files:**
- `src/index.css` — Global styles and font variables
- `Frontend design.txt` — Design guidelines (root directory)
- `docs/SPEC.md` — This file

### Version History

**v1.0 — Initial Specification**
- Defined game systems
- Documented Monday and Tuesday events
- Established design system
- Created development guidelines

### Contact

**Questions?** Contact the development team or refer to the TESTING_GUIDE.md for testing procedures.
