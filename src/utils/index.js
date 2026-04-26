import icons from "./apps";

const safeParseArray = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    const parsed = JSON.parse(value);
    // Check if parsed is a number (common corruption issue)
    if (typeof parsed === 'number') {
      console.warn(`[safeParseArray] ${key} is a number (${parsed}), expected array, using default`);
      return defaultValue;
    }
    if (!Array.isArray(parsed)) {
      console.warn(`[safeParseArray] ${key} is not an array (type: ${typeof parsed}), using default`);
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    console.warn(`[safeParseArray] Failed to parse ${key}, using default:`, e);
    return defaultValue;
  }
};

var { taskbar, desktop, pinned, recent } = {
  taskbar: safeParseArray("taskbar", [
    "Settings",
    "File Explorer",
    "MeridianBrowse",
    "Store",
    "Flack",
  ]),
  desktop: safeParseArray("desktop", [
    "Recycle Bin",
    "File Explorer",
    "Store",
    "MeridianBrowse",
    "Flack",
    "Outbox",
    "Flappy Lanyard",
    "Salary Banding",
    "Inbox Zero",
    "Corporate Snake",
  ]),
  pinned: safeParseArray("pinned", [
    "MeridianBrowse",
    "Get Started",
    "Task Manager",
    "Settings",
    "Store",
    "Notepad",
    "Whiteboard",
    "Calculator",
    "File Explorer",
    "Terminal",
    "Camera",
    "Flack",
    "Outbox",
    "Synergy Drive",
    "ExecuTerm",
    "Flappy Lanyard",
    "Salary Banding",
    "Inbox Zero",
    "Corporate Snake",
  ]),
  recent: safeParseArray("recent", [
    "Terminal",
    "File Explorer",
    "Flack",
    "Edge",
  ]),
};

// Additional safety: ensure all are arrays
if (!Array.isArray(taskbar)) {
  console.warn('[utils/index.js] taskbar is not an array:', taskbar);
  taskbar = [];
}
if (!Array.isArray(desktop)) {
  console.warn('[utils/index.js] desktop is not an array:', desktop);
  desktop = [];
}
if (!Array.isArray(pinned)) {
  console.warn('[utils/index.js] pinned is not an array:', pinned);
  pinned = [];
}
if (!Array.isArray(recent)) {
  console.warn('[utils/index.js] recent is not an array:', recent);
  recent = [];
}

// Defensive check: ensure icons is an array before filtering
if (!Array.isArray(icons)) {
  console.warn('[utils/index.js] icons is not an array:', icons);
}

export const taskApps = Array.isArray(icons) ? icons.filter((x) => Array.isArray(taskbar) && taskbar.includes(x.name)) : [];

export const desktopApps = Array.isArray(icons) ? icons
  .filter((x) => Array.isArray(desktop) && desktop.includes(x.name))
  .sort((a, b) => {
    if (!Array.isArray(desktop)) return 0;
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  }) : [];

export const pinnedApps = Array.isArray(icons) ? icons
  .filter((x) => Array.isArray(pinned) && pinned.includes(x.name))
  .sort((a, b) => {
    if (!Array.isArray(pinned)) return 0;
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  }) : [];

export const recentApps = Array.isArray(icons) ? icons
  .filter((x) => Array.isArray(recent) && recent.includes(x.name))
  .sort((a, b) => {
    if (!Array.isArray(recent)) return 0;
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  }) : [];

export const allApps = Array.isArray(icons) ? icons.filter((app) => {
  return app.type === "app";
}) : [];

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};
