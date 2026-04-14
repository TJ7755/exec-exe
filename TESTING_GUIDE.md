# Testing Guide for Game Improvements

This document outlines how to manually test the gameplay and storytelling improvements implemented for the first two days of the game.

## Phase 1: Gameplay Mechanics Testing

### 1.1 Sheet Reconciliation Component

**Test Steps:**
1. Start the game on Monday
2. Navigate to Synergy Drive and open "Sheet Reconciliation — Boiler Plant"
3. Verify the following:
   - Notes field is editable for each row in Sheet B
   - Investigate button appears for discrepancies
   - Clicking Investigate shows a modal with asset history
   - Submitting the reconciliation triggers a dialogue choice

**Expected Results:**
- Notes field accepts input
- Investigation modal displays asset history with date, action, and user
- Dialogue choice presents 4 options: changed_numbers, flagged_discrepancy, asked_for_help, honest
- Each option correctly updates hidden state flags

### 1.2 Tuesday Standup Dynamic

**Test Steps:**
1. Complete Monday reconciliation with different outcomes (Green, Amber, Red)
2. Advance to Tuesday 09:00 standup
3. Verify the dialogue options change based on Monday's dashboard status

**Expected Results:**
- If dashboard is Green: Option to report green, with subtext about integrity if compromised
- If dashboard is Amber: Option to report amber with professional subtext
- If dashboard is Red/Honest: Option to report honestly with negative Nathaniel reputation
- BLR-008 escalation option always available
- If BLR-008 was fixed: Additional option to mention the fix

### 1.3 BLR-011 Investigation Phase

**Test Steps:**
1. Advance to Tuesday 12:30 (Diane's second email about BLR-011)
2. At 12:45, check for notification about investigation options
3. Try the investigation actions:
   - View asset history in Synergy Drive
   - Check Harry's change log (shows 2022 modification without reason code)
   - Email Diane for more details

**Expected Results:**
- Notification appears at 12:45
- Asset history shows BLR-011 status changes
- Harry's change log shows the problematic 2022 change with no reason code
- Tom responds when contacting Diane
- Investigation flags are set in hidden state
- BLR-011 crisis dialogue at 13:00 reflects whether investigation was completed

### 1.4 XML Requirement Connection

**Test Steps:**
1. Advance to Tuesday 15:30 (Claire's XML requirement email)
2. Check Synergy Drive for "NHS XML Export Specification" document
3. In the dialogue choice, select "preview spec" option
4. Verify the XML specification document opens
5. Review the specification to see additional fields required

**Expected Results:**
- XML specification document is available in Client Documents folder
- Preview option opens Synergy Drive to the specification
- Specification shows required fields: SiteCode, Category, Criticality
- Date format must be ISO 8601 (YYYY-MM-DD)
- Comparison section shows differences between spreadsheet and XML formats
- If player agreed without previewing: Wednesday event shows they can't actually implement XML export

### 1.5 James Siren Meeting Reactive

**Test Steps:**
1. On Monday, choose different AUP approaches (signed immediately vs read properly)
2. Complete reconciliation with different integrity outcomes
3. Advance to Tuesday 11:00 (James Siren Data Quality Review)
4. Verify James's opening question changes based on AUP choice
5. Verify dialogue options have different subtext based on dashboard integrity

**Expected Results:**
- If AUP read properly: James asks about Section 7.3 change logging
- If AUP not read properly: James asks about reconciliation work generally
- If dashboard integrity compromised: Subtext warns about data manipulation
- If religious language used before: Stewardship option has more favorable reputation gain
- Harry's walkthrough option has subtext about methodology issues

## Phase 2: Storytelling Testing

### Character Motivation Context

**Test Steps:**
1. Check Monday morning emails for:
   - Nathaniel dashboard pressure email (from James)
   - Harry dataset ownership claim
   - NHS newsletter about CQC audits

**Expected Results:**
- All three emails appear in inbox
- Nathaniel pressure email shows 87% vs 95% target gap
- Harry email claims ownership of Royal Western dataset
- NHS newsletter mentions audit focus on asset ID governance and change logging

### Tom's Deepened Role

**Test Steps:**
1. Monday 09:10: Tom welcome message
2. Monday 11:30: Tom warning about Harry
3. Monday 13:30: Tom dashboard advice
4. Monday 16:00: Tom Atlas hint

**Expected Results:**
- Tom warns about Harry's methodology being unreliable
- Tom advises that Nathaniel only cares about dashboard being green
- Tom mentions Atlas programme and something big coming
- Atlas awareness counter increments after Atlas hint

### New Documents

**Test Steps:**
1. Check Synergy Drive Company folder for:
   - Q1 2024 Performance Review
   - 2022 Asset Register Cleanup Report
2. Check Client Documents folder for:
   - Engineering Incident Report
   - CQC Inspection Notice
   - HSJ Atlas Article

**Expected Results:**
- Performance review shows 87% green vs 95% target
- Cleanup report shows BLR-011 was changed from Decommissioned to Active by Harry
- Incident report shows BLR-008 service date discrepancy
- CQC notice lists audit focus areas
- HSJ article explains Atlas programme and MSP contract implications

### Character Moments

**Test Steps:**
1. Monday 14:30: Rosa stress moment
2. Monday 15:00: Nathaniel pressure moment

**Expected Results:**
- Rosa mentions covering for sick colleague and workload pressure
- Rosa expresses frustration about dashboard focus over data quality
- Nathaniel emphasizes James is watching and needs green by end of day
- Hidden state flags for these moments are set

## Phase 3: New Content Testing

### Atlas Foreshadowing

**Test Steps:**
1. Monday 16:00: Tom Atlas hint
2. Check HSJ article in Client Documents
3. Tuesday: Claire XML email mentions Atlas programme

**Expected Results:**
- Tom mentions Atlas in all-hands
- HSJ article details Atlas programme timeline and MSP impact
- Claire email links XML requirement to Atlas CAFM system
- Atlas awareness counter increments appropriately

## Phase 4: System Enhancements Testing

### Time Management

**Test Steps:**
1. Monday 16:00: Check for AUP deadline reminder notification
2. Verify notification only appears if AUP not acknowledged

**Expected Results:**
- Notification appears at 16:00 if AUP not signed
- Notification does not appear if AUP already acknowledged
- Notification references 17:00 deadline and Synergy Drive location

## Hidden State Flags Verification

Use browser console to check hidden state flags:

```javascript
// In browser console
const state = window.store.getState();
console.log(state.player.hiddenState);
```

**Key Flags to Verify:**
- `sheetReconciliationTarget`: 'green' | 'amber' | 'honest'
- `dashboardIntegrityCompromised`: boolean
- `nathanielToldTruth`: boolean
- `readHandbookProperly`: boolean
- `blr011InvestigationComplete`: boolean
- `xmlSpecPreviewed`: boolean
- `toldSirenTruth`: boolean
- `atlasAwareness`: number (0-3)

## Manual Testing Checklist

- [ ] Sheet reconciliation notes field works
- [ ] Investigation button and modal function correctly
- [ ] Tuesday standup options change based on Monday outcome
- [ ] BLR-011 investigation actions are available and work
- [ ] XML specification document is accessible
- [ ] James Siren meeting dialogue is reactive to hidden state
- [ ] All new emails appear in inbox
- [ ] Tom's additional messages appear at correct times
- [ ] New documents are in Synergy Drive
- [ ] Character moments trigger at correct times
- [ ] Atlas foreshadowing appears in multiple places
- [ ] Deadline notification works correctly
- [ ] Hidden state flags are set correctly after each choice

## Known Issues

- Automated testing would require installing @testing-library/react, @types/jest, and configuring test runner
- Current project setup does not include test dependencies
- Manual testing is recommended until test infrastructure is set up
