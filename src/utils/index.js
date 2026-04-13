import icons from "./apps";

var { taskbar, desktop, pinned, recent } = {
  taskbar: (localStorage.getItem("taskbar") &&
    JSON.parse(localStorage.getItem("taskbar"))) || [
    "Settings",
    "File Explorer",
    "MeridianBrowse",
    "Store",
    "Flack",
  ],
  desktop: (localStorage.getItem("desktop") &&
    JSON.parse(localStorage.getItem("desktop"))) || [
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
  ],
  pinned: (localStorage.getItem("pinned") &&
    JSON.parse(localStorage.getItem("pinned"))) || [
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
  ],
  recent: (localStorage.getItem("recent") &&
    JSON.parse(localStorage.getItem("recent"))) || [
    "Terminal",
    "File Explorer",
    "Flack",
    "Edge",
  ],
};


export const taskApps = icons.filter((x) => taskbar.includes(x.name));

export const desktopApps = icons
  .filter((x) => desktop.includes(x.name))
  .sort((a, b) => {
    return desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1;
  });

export const pinnedApps = icons
  .filter((x) => pinned.includes(x.name))
  .sort((a, b) => {
    return pinned.indexOf(a.name) > pinned.indexOf(b.name) ? 1 : -1;
  });

export const recentApps = icons
  .filter((x) => recent.includes(x.name))
  .sort((a, b) => {
    return recent.indexOf(a.name) > recent.indexOf(b.name) ? 1 : -1;
  });

export const allApps = icons.filter((app) => {
  return app.type === "app";
});

export const dfApps = {
  taskbar,
  desktop,
  pinned,
  recent,
};
