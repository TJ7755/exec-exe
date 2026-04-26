import { pinnedApps, recentApps } from "../utils";

const defState = {
  pnApps: pinnedApps,
  rcApps: recentApps,
  hide: true,
  menu: false,
  showAll: false,
  alpha: false,
  pwctrl: false,
  curAlpha: "A",
  qksrch: [
    ["faClock", 1, "Today in history"],
    ["faChartLine", null, "Markets today"],
    ["faFilm", null, "New movies"],
    ["faNewspaper", 1, "Top news"],
  ],
};

const menuReducer = (state = defState, action) => {
  try {
    const safeState = state && typeof state === 'object' ? state : defState;
    
    switch (action.type) {
      case "STARTSHW":
        return {
          ...safeState,
          menu: true,
          hide: false,
          pwctrl: false,
        };
      case "STARTHID":
        return {
          ...safeState,
          hide: true,
          showAll: false,
          pwctrl: false,
        };
      case "STARTOGG":
        return {
          ...safeState,
          hide: !(safeState.hide || !safeState.menu),
          menu: true,
          alpha: false,
          curAlpha: "A",
          pwctrl: false,
          showAll: safeState.menu && safeState.showAll ? true : null,
        };
      case "STARTALL":
        return {
          ...safeState,
          showAll: !safeState.showAll,
          alpha: false,
          pwctrl: false,
          curAlpha: "A",
        };
      case "STARTALPHA":
        return {
          ...safeState,
          alpha: !safeState.alpha,
          pwctrl: false,
          curAlpha: action.payload || "A",
        };
      case "STARTSRC":
        return {
          ...safeState,
          hide: !(safeState.hide || safeState.menu),
          menu: false,
          pwctrl: false,
        };
      case "STARTPWC":
        return {
          ...safeState,
          pwctrl: true,
        };
      default:
        return safeState;
    }
  } catch (e) {
    console.error('[menuReducer] Error:', e);
    return defState;
  }
};

export default menuReducer;
