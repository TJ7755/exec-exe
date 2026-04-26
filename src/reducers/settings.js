import { desktopApps } from "../utils";

const defState = {
  system: {
    power: {
      saver: {
        state: false,
      },
      battery: 100,
    },
    display: {
      brightness: 100,
      nightlight: {
        state: false,
      },
      connect: false,
    },
  },
  person: {
    name: "User",
    theme: "light",
    color: "blue",
  },
  devices: {
    bluetooth: false,
  },
  network: {
    wifi: {
      state: true,
    },
    airplane: false,
  },
  privacy: {
    location: {
      state: false,
    },
  },
};

document.body.dataset.theme = defState.person.theme;

const changeVal = (obj, path, val = "togg") => {
  if (typeof path !== 'string') {
    console.warn('[changeVal] path is not a string:', path);
    return obj;
  }
  
  var tmp = obj;
  const pathParts = path.split(".");
  for (var i = 0; i < pathParts.length - 1; i++) {
    tmp = tmp[pathParts[i]];
  }

  if (val == "togg") {
    tmp[pathParts[pathParts.length - 1]] = !tmp[pathParts[pathParts.length - 1]];
  } else {
    tmp[pathParts[pathParts.length - 1]] = val;
  }

  return obj;
};

const settReducer = (state = defState, action) => {
  try {
    // Ensure state is valid
    const safeState = state && typeof state === 'object' ? state : defState;
    var tmpState = { ...safeState },
      changed = false;
    switch (action.type) {
      case "STNGTHEME":
        changed = true;
        tmpState.person.theme = action.payload;
        break;
      case "STNGTOGG":
        changed = true;
        tmpState = changeVal(tmpState, action.payload);
        break;
      case "STNGSETV":
        changed = true;
        tmpState = changeVal(tmpState, action.payload.path, action.payload.value);
        break;
      case "SETTLOAD":
        changed = true;
        // Defensive check: ensure action.payload is an object before spreading
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          tmpState = { ...action.payload };
        } else {
          console.warn('[settReducer] SETTLOAD payload is not an object:', action.payload);
          tmpState = { ...safeState };
        }
        break;
      case "TOGGAIRPLNMD":
        changed = true;
        const airPlaneModeStatus = tmpState.network.airplane;
        if (tmpState.network.wifi.state === true && !airPlaneModeStatus) {
          tmpState = changeVal(tmpState, "network.wifi.state");
        }
        if (tmpState.devices.bluetooth === true && !airPlaneModeStatus) {
          tmpState = changeVal(tmpState, "devices.bluetooth");
        }
        tmpState = changeVal(tmpState, "network.airplane");
    }

    if (changed) localStorage.setItem("setting", JSON.stringify(tmpState));
    return tmpState;
  } catch (e) {
    console.error('[settReducer] Error:', e);
    return defState;
  }
};

export default settReducer;
