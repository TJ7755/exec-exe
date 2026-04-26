import { taskApps } from "../utils";

const alignment = localStorage.getItem("taskbar-align") || "center";

// Validate alignment is a string
if (typeof alignment !== 'string') {
  console.warn('[taskbar] Invalid alignment in localStorage:', alignment);
}

const defState = {
  apps: taskApps,
  prev: false,
  prevApp: "",
  prevPos: 0,
  align: alignment,
  search: true,
  widgets: true,
  audio: 3,
};

const taskReducer = (state = defState, action) => {
  try {
    const safeState = state && typeof state === 'object' ? state : defState;
    
    switch (action.type) {
      case "TASKADD":
        return safeState;
      case "TASKREM":
        return safeState;
      case "TASKCEN":
        return {
          ...safeState,
          align: "center",
        };
      case "TASKLEF":
        localStorage.setItem("taskbar-align", "left");
        return {
          ...safeState,
          align: "left",
        };
      case "TASKTOG":
        const alignment = safeState.align == "left" ? "center" : "left";
        localStorage.setItem("taskbar-align", alignment);
        return {
          ...safeState,
          align: alignment,
        };
      case "TASKPSHOW":
        return {
          ...safeState,
          prev: true,
          prevApp: (action.payload && action.payload.app) || "store",
          prevPos: (action.payload && action.payload.pos) || 50,
        };
      case "TASKPHIDE":
        return {
          ...safeState,
          prev: false,
        };
      case "TASKSRCH":
        return {
          ...safeState,
          search: action.payload == "true",
        };
      case "TASKWIDG":
        return {
          ...safeState,
          widgets: action.payload == "true",
        };
      case "TASKAUDO":
        return {
          ...safeState,
          audio: action.payload,
        };
      default:
        return safeState;
    }
  } catch (e) {
    console.error('[taskReducer] Error:', e);
    return defState;
  }
};

export default taskReducer;
