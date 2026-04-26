import { combineReducers, createStore, applyMiddleware } from "redux";

import wallReducer from "./wallpaper";
import taskReducer from "./taskbar";
import deskReducer from "./desktop";
import menuReducer from "./startmenu";
import paneReducer from "./sidepane";
import widReducer from "./widpane";
import appReducer from "./apps";
import menusReducer from "./menu";
import globalReducer from "./globals";
import settReducer from "./settings";
import fileReducer from "./files";
import { playerReducer, createPersistenceMiddleware } from "../player/store";
import { schedulerMiddleware } from "../player/events/scheduler";
import { emailReducer } from "../player/emailStore";

// Wrap each reducer in a defensive wrapper to prevent crashes
const createSafeReducer = (reducer, name) => (state, action) => {
  try {
    const result = reducer(state, action);
    // Ensure result is not a primitive (number, string, boolean, undefined)
    // Allow objects and arrays (some reducers may have array properties in state)
    if (result === null || typeof result !== 'object') {
      console.error(`[${name}] Reducer returned invalid state:`, result);
      return reducer(undefined, action); // Return initial state
    }
    return result;
  } catch (e) {
    console.error(`[${name}] Reducer error:`, e);
    return reducer(undefined, action); // Return initial state
  }
};

const allReducers = combineReducers({
  wallpaper: createSafeReducer(wallReducer, 'wallpaper'),
  taskbar: createSafeReducer(taskReducer, 'taskbar'),
  desktop: createSafeReducer(deskReducer, 'desktop'),
  startmenu: createSafeReducer(menuReducer, 'startmenu'),
  sidepane: createSafeReducer(paneReducer, 'sidepane'),
  widpane: createSafeReducer(widReducer, 'widpane'),
  apps: createSafeReducer(appReducer, 'apps'),
  menus: createSafeReducer(menusReducer, 'menus'),
  globals: createSafeReducer(globalReducer, 'globals'),
  setting: createSafeReducer(settReducer, 'settings'),
  files: createSafeReducer(fileReducer, 'files'),
  player: createSafeReducer(playerReducer, 'player'),
  emails: createSafeReducer(emailReducer, 'emails'),
});

// Wrap the root reducer to catch any state corruption at the top level
const rootReducer = (state, action) => {
  try {
    const result = allReducers(state, action);
    // Ensure the root state is an object
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
      console.error('[rootReducer] Invalid root state:', result);
      return allReducers(undefined, action);
    }
    return result;
  } catch (e) {
    console.error('[rootReducer] Error:', e);
    return allReducers(undefined, action);
  }
};

const persistenceMiddleware = createPersistenceMiddleware();

try {
  var store = createStore(
    rootReducer,
    applyMiddleware(schedulerMiddleware, persistenceMiddleware)
  );
} catch (e) {
  console.error('Failed to create Redux store:', e);
  // Create a minimal fallback store
  var store = createStore(rootReducer);
}

// Expose store to window for debugging
if (typeof window !== 'undefined') {
  window.store = store;
}

export default store;
