import { allApps } from "../utils";

var dev = "";
if (import.meta.env.MODE == "development") {
  dev = ""; // set the name (lowercase) of the app you are developing so that it will be opened on refresh
}

// Defensive check: ensure allApps is an array
const safeAllApps = Array.isArray(allApps) ? allApps : [];

const defState = {};
for (var i = 0; i < safeAllApps.length; i++) {
  defState[safeAllApps[i].icon] = safeAllApps[i];
  defState[safeAllApps[i].icon].size = "full";
  defState[safeAllApps[i].icon].hide = true;
  defState[safeAllApps[i].icon].max = null;
  defState[safeAllApps[i].icon].z = 0;

  if (safeAllApps[i].icon == dev) {
    defState[safeAllApps[i].icon].size = "mini";
    defState[safeAllApps[i].icon].hide = false;
    defState[safeAllApps[i].icon].max = true;
    defState[safeAllApps[i].icon].z = 1;
  }

  // Browser starts small by default
  if (safeAllApps[i].icon == "edge") {
    defState[safeAllApps[i].icon].size = "mini";
  }

  // File Explorer starts small by default
  if (safeAllApps[i].icon == "explorer") {
    defState[safeAllApps[i].icon].size = "mini";
  }
}

defState.hz = 2;

const appReducer = (state = defState, action) => {
  try {
    // Ensure state is a valid object (defensive against corrupted state)
    const safeState = state && typeof state === 'object' ? state : defState;
    var tmpState = { ...safeState };
    
    // Ensure hz is a number
    if (typeof tmpState.hz !== 'number') {
      console.warn('[appReducer] hz is not a number:', tmpState.hz);
      tmpState.hz = 2;
    }
    
    if (action.type == "EDGELINK") {
    var obj = { ...tmpState["edge"] };
    if (action.payload && action.payload.startsWith("http")) {
      obj.url = action.payload;
    } else if (action.payload && action.payload.length != 0) {
      obj.url = "https://www.bing.com/search?q=" + action.payload;
    } else {
      obj.url = null;
    }

    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz += 1;
    obj.z = tmpState.hz;
    tmpState["edge"] = obj;
    return tmpState;
  } else if (action.type == "SHOWDSK") {
    var keys = Object.keys(tmpState);

    for (var i = 0; i < keys.length; i++) {
      var obj = tmpState[keys[i]];
      if (obj.hide == false) {
        obj.max = false;
        if (obj.z == tmpState.hz) {
          tmpState.hz -= 1;
        }
        obj.z = -1;
        tmpState[keys[i]] = obj;
      }
    }

    return tmpState;
  } else if (action.type == "EXTERNAL") {
    window.open(action.payload, "_blank");
  } else if (action.type == "OPENTERM") {
    var obj = { ...tmpState["terminal"] };
    obj.dir = action.payload;

    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz += 1;
    obj.z = tmpState.hz;
    tmpState["terminal"] = obj;
    return tmpState;
  } else if (action.type == "ADDAPP") {
    tmpState[action.payload.icon] = action.payload;
    tmpState[action.payload.icon].size = "full";
    tmpState[action.payload.icon].hide = true;
    tmpState[action.payload.icon].max = null;
    tmpState[action.payload.icon].z = 0;

    return tmpState;
  } else if (action.type == "DELAPP") {
    delete tmpState[action.payload];
    return tmpState;
  } else {
    var keys = Object.keys(safeState);
    for (var i = 0; i < keys.length; i++) {
      var obj = safeState[keys[i]];
      if (obj && obj.action == action.type) {
        tmpState = { ...safeState };

        // Handle object payload format: { app: 'appname', initialView: 'viewId' }
        if (typeof action.payload === 'object' && action.payload !== null) {
          if (action.payload.app === obj.action) {
            obj.size = "full";
            obj.hide = false;
            obj.max = true;
            tmpState.hz += 1;
            obj.z = tmpState.hz;
            if (action.payload.initialView) {
              obj.initialView = action.payload.initialView;
            }
          }
        } else if (action.payload == "full") {
          obj.size = "mini";
          obj.hide = false;
          obj.max = true;
          tmpState.hz += 1;
          obj.z = tmpState.hz;
        } else if (action.payload == "close") {
          obj.hide = true;
          obj.max = null;
          obj.z = -1;
          tmpState.hz -= 1;
        } else if (action.payload == "mxmz") {
          obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
          obj.hide = false;
          obj.max = true;
          tmpState.hz += 1;
          obj.z = tmpState.hz;
        } else if (action.payload == "togg") {
          if (obj.z != tmpState.hz) {
            obj.hide = false;
            if (!obj.max) {
              tmpState.hz += 1;
              obj.z = tmpState.hz;
              obj.max = true;
            } else {
              obj.z = -1;
              obj.max = false;
            }
          } else {
            obj.max = !obj.max;
            obj.hide = false;
            if (obj.max) {
              tmpState.hz += 1;
              obj.z = tmpState.hz;
            } else {
              obj.z = -1;
              tmpState.hz -= 1;
            }
          }
        } else if (action.payload == "mnmz") {
          obj.max = false;
          obj.hide = false;
          if (obj.z == tmpState.hz) {
            tmpState.hz -= 1;
          }
          obj.z = -1;
        } else if (action.payload == "resize") {
          obj.size = "cstm";
          obj.hide = false;
          obj.max = true;
          if (obj.z != tmpState.hz) tmpState.hz += 1;
          obj.z = tmpState.hz;
          obj.dim = action.dim;
        } else if (action.payload == "front") {
          obj.hide = false;
          obj.max = true;
          if (obj.z != tmpState.hz) {
            tmpState.hz += 1;
            obj.z = tmpState.hz;
          }
        }

        tmpState[keys[i]] = obj;
        return tmpState;
      }
    }
  }

  return safeState;
  } catch (e) {
    console.error('[appReducer] Error:', e);
    return defState;
  }
};

export default appReducer;
