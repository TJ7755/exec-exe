# Meridian Infrastructure Services Game

A narrative-driven role-playing game built on a Windows 11 desktop simulation, where you play as a Junior Data Asset Officer navigating the challenges of data integrity, office politics, and ethical decision-making.

---

## For Players

### Game Overview

You are a Junior Data Asset Officer at Meridian Infrastructure Services, a managed service provider for NHS England. Your job is to maintain asset data registers across multiple NHS sites. But when discrepancies surface between hospital records and your company's dashboard, you'll face difficult choices that test your professional ethics, data integrity, and relationships with colleagues.

### How to Play

1. **Start the Game** — Enter your name when prompted
2. **Complete Tasks** — Receive tasks via email (Outbox) and messaging (Flack)
3. **Make Decisions** — Choose how to handle data discrepancies, compliance issues, and office politics
4. **Manage Your Stats** — Track your competence, accuracy, and stress levels
5. **Build Relationships** — Your choices affect how colleagues perceive you
6. **Face Consequences** — Every decision has ripple effects in future days

### Game Applications

- **MeridianBrowse** — Browser with intranet access and monitoring
- **Flack** — Messaging app for team communication
- **ExecuTerm** — Terminal for system commands
- **Outbox** — Email client for tasks and correspondence
- **Synergy Drive** — File explorer for documents and data

### Current Content

The game currently includes:
- **Day 1 (Monday):** Onboarding, first reconciliation task, initial team interactions
- **Day 2 (Tuesday):** Data quality review, BLR-011 crisis, compliance challenges

More days will be added in future updates.

### Tips

- Read the Employee Handbook carefully — it affects later interactions
- Think carefully before changing data to meet targets
- Building trust with Rosa can provide valuable insights
- Harry's work from 2022 may have hidden issues
- Compliance audits have real consequences

---

## For Developers

### Project Structure

This project is built on the Win11React Windows 11 desktop simulator, with custom game logic layered on top.

**Key Directories:**
- `src/scenarios/meridian/` — Game scenario data (NPCs, company, documents)
- `src/player/` — Player state management, game systems, events
- `src/apps/` — Custom applications (MeridianBrowse, Flack, ExecuTerm, Outbox, Synergy)
- `src/components/dialogue/` — Dialogue choice system
- `docs/SPEC.md` — Comprehensive design specification

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Game Systems

**Game Time:** 7.5 game seconds per real second, with pause states for dialogue choices

**Session Persistence:** Auto-saves to localStorage with debouncing (2-second delay)

**Dialogue Choice System:** Three rendering types (Flack DM, Email, Standalone) with consequence tracking

**Event System:** Time-triggered and manual events with conditional logic

**Hidden State:** Tracks player decisions that affect future interactions

### Design System

**Typography:** Space Grotesk (headings) + Inter (body)

**Colours:** MIS Navy (#1B3A5C) as primary accent

**Cardless Design:** UI elements use borders, dividers, and spacing instead of card-like containers

**Signature Moves:** Each app has distinctive animations (scanning lines, message arrival, document fade-in)

See `docs/SPEC.md` for complete design guidelines.

### Adding Content

**New Events:** Add to `src/player/events/[day].ts`

**New NPCs:** Add to `src/scenarios/meridian/npcs.ts`

**New Documents:** Add to `src/scenarios/meridian/documents/`

**New Dialogue Choices:** Use the DialogueChoice component with consequence tracking

### Testing

Refer to `TESTING_GUIDE.md` for manual testing procedures.

### Contributing

This is a private project. For questions about the codebase, refer to the comprehensive specification in `docs/SPEC.md`.

---

## Base Project: Win11React

This game is built on the Win11React project, which replicates the Windows 11 desktop experience on the web using React, SCSS, and JavaScript.

**Original Project:** [Win11React by blueedgetechno](https://github.com/blueedgetechno/win11React)

### Notice

> The base Win11React project is **not in any way affiliated with Microsoft** and should not be confused with Microsoft's Operating System or Products.
> This is **not** a Windows 365 cloud PC.

### Win11React Features

- Start Menu, Search Menu and Widgets
- Desktop and Right Click action
- Side Navigation and Calendar View
- Snap windows in different layouts
- Browser, Store, Terminal, Calculator
- Notepad, Vscode, Whiteboard
- File Explorer + Setting
- Drag and Resize windows
- Startup and Lock screen
- Themes and Background
- Multilang Support

### Win11React Stack

- Framework — React (^17.0.2) + Redux
- Component/UI Library — None
- Styling Solution — SCSS and CSS Modules (Tailwind)
- Icons — FontAwesome

---

## License

⚖️ CC0-1.0 License

The base Win11React project is CC0-1.0 licensed. Game-specific content is proprietary.
