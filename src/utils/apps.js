import { smallTalkData } from "../player/smallTalk";

export const gene_name = () =>
  Math.random().toString(36).substring(2, 10).toUpperCase();

let installed = JSON.parse(localStorage.getItem("installed") || "[]");

/**
 * Generate dynamic NPC message shortcuts for desktop
 * Creates "Message [Name]" shortcuts for NPCs that have small talk defined
 */
export const generateNPCMessageShortcuts = (playerName) => {
  if (!playerName) return [];

  return smallTalkData.characters.map(character => ({
    name: `Message ${character.npcName}`,
    icon: "flack",
    type: "app",
    action: "FLACK",
    payload: { deepLink: `dm-${character.npcId}` },
    isDynamicNPC: true, // Flag to identify dynamic NPC shortcuts
    npcId: character.npcId
  }));
};

const apps = [
  {
    name: "Start",
    icon: "home",
    type: "action",
    action: "STARTMENU",
  },
  {
    name: "Search",
    icon: "search",
    type: "action",
    action: "SEARCHMENU",
  },
  {
    name: "Widget",
    icon: "widget",
    type: "action",
    action: "WIDGETS",
  },
  {
    name: "Settings",
    icon: "settings",
    type: "app",
    action: "SETTINGS",
  },
  {
    name: "Task Manager",
    icon: "taskmanager",
    type: "app",
    action: "TASKMANAGER",
  },
  {
    name: "File Explorer",
    icon: "explorer",
    type: "app",
    action: "EXPLORER",
  },
  {
    name: "Browser",
    icon: "edge",
    type: "app",
    action: "MSEDGE",
  },
  {
    name: "Store",
    icon: "store",
    type: "app",
    action: "WNSTORE",
  },
  {
    name: "Recycle Bin",
    icon: "bin0",
    type: "app",
  },
  {
    name: "Alarms",
    icon: "alarm",
    type: "app",
  },
  {
    name: "Calculator",
    icon: "calculator",
    type: "app",
    action: "CALCUAPP",
  },
  {
    name: "Calendar",
    icon: "calendar",
    type: "app",
  },
  {
    name: "Camera",
    icon: "camera",
    type: "app",
    action: "CAMERA",
  },
  {
    name: "Your Phone",
    icon: "yphone",
    type: "app",
  },
  {
    name: "Feedback",
    icon: "feedback",
    type: "app",
  },
  {
    name: "Get Started",
    icon: "getstarted",
    type: "app",
    action: "OOBE",
  },
  {
    name: "Groove Music",
    icon: "groove",
    type: "app",
  },
  {
    name: "Yammer",
    icon: "yammer",
    type: "app",
  },
  {
    name: "Movies",
    icon: "movies",
    type: "app",
  },
  {
    name: "Xbox",
    icon: "xbox",
    type: "app",
  },
  {
    name: "Office",
    icon: "msoffice",
    type: "app",
  },
  {
    name: "Narrator",
    icon: "narrator",
    type: "app",
  },
  {
    name: "News",
    icon: "news",
    type: "app",
  },
  {
    name: "Notepad",
    icon: "notepad",
    type: "app",
    action: "NOTEPAD",
  },
  {
    name: "Sticky Notes",
    icon: "notes",
    type: "app",
  },
  {
    name: "OneDrive",
    icon: "oneDrive",
    type: "app",
  },
  {
    name: "OneNote",
    icon: "onenote",
    type: "app",
  },
  {
    name: "Outlook",
    icon: "outlook",
    type: "app",
  },
  {
    name: "People",
    icon: "people",
    type: "app",
  },
  {
    name: "Photos",
    icon: "photos",
    type: "app",
  },
  {
    name: "Security",
    icon: "security",
    type: "app",
  },
  {
    name: "Sharepoint",
    icon: "share",
    type: "app",
  },
  {
    name: "Skype",
    icon: "skype",
    type: "app",
  },
  {
    name: "Snipping Tool",
    icon: "snip",
    type: "app",
  },
  {
    name: "Teams",
    icon: "teams",
    type: "app",
  },
  {
    name: "Terminal",
    icon: "terminal",
    type: "app",
    action: "TERMINAL",
  },
  {
    name: "Tips",
    icon: "tips",
    type: "app",
  },
  {
    name: "To Do",
    icon: "todo",
    type: "app",
  },
  {
    name: "Maps",
    icon: "maps",
    type: "app",
  },
  {
    name: "Voice Recorder",
    icon: "voice",
    type: "app",
  },
  {
    name: "Weather",
    icon: "weather",
    type: "app",
  },
  {
    name: "Whiteboard",
    icon: "board",
    type: "app",
    action: "WHITEBOARD",
  },
  {
    name: "Cortana",
    icon: "cortana",
    type: "app",
  },
  {
    name: "Flack",
    icon: "flack",
    type: "app",
    action: "FLACK",
  },
  {
    name: "Outbox",
    icon: "outbox",
    type: "app",
    action: "OUTBOX",
  },
  {
    name: "Synergy Drive",
    icon: "synergy",
    type: "app",
    action: "SYNERGY",
  },
  {
    name: "ExecuTerm",
    icon: "executerm",
    type: "app",
    action: "EXECUTERM",
  },
  {
    name: "MeridianBrowse",
    icon: "meridianbrowse",
    type: "app",
    action: "MERIDIANBROWSE",
  },
  {
    name: "Flappy Lanyard",
    icon: "flappy-lanyard",
    type: "app",
    action: "FLAPPYLANYARD",
  },
  {
    name: "Salary Banding",
    icon: "salary-banding",
    type: "app",
    action: "SALARYBANDING",
  },
  {
    name: "Inbox Zero",
    icon: "inbox-zero",
    type: "app",
    action: "INBOXZERO",
  },
  {
    name: "Corporate Snake",
    icon: "corporate-snake",
    type: "app",
    action: "CORPORATESNAKE",
  },
];


for (let i = 0; i < installed.length; i++) {
  installed[i].action = gene_name();
  apps.push(installed[i]);
}

export default apps;
