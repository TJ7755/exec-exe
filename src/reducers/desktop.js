import { desktopApps } from "../utils";

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  abOpen: false,
};

const deskReducer = (state = defState, action) => {
  try {
    // Ensure state is valid
    const safeState = state && typeof state === 'object' ? state : defState;
    const safeApps = Array.isArray(safeState.apps) ? safeState.apps : defState.apps;

    switch (action.type) {
      case "DESKREM":
        var arr = safeApps.filter((x) => x.name != action.payload);

        localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
        return { ...safeState, apps: arr };
      case "DESKADD":
        var arr = Array.isArray(safeApps) ? [...safeApps] : [];
        arr.push(action.payload);

        localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
        return { ...safeState, apps: arr };
      case "DESKHIDE":
        return {
          ...safeState,
          hide: true,
        };
      case "DESKSHOW":
        return {
          ...safeState,
          hide: false,
        };
      case "DESKTOGG":
        return {
          ...safeState,
          hide: !safeState.hide,
        };
      case "DESKSIZE":
        return {
          ...safeState,
          size: action.payload,
        };
      case "DESKSORT":
        return {
          ...safeState,
          sort: action.payload || "none",
        };
      case "DESKABOUT":
        return {
          ...safeState,
          abOpen: action.payload,
        };
      default:
        return safeState;
    }
  } catch (e) {
    console.error('[deskReducer] Error:', e);
    return defState;
  }
};

export default deskReducer;
