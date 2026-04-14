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

const allReducers = combineReducers({
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settReducer,
  files: fileReducer,
  player: playerReducer,
  emails: emailReducer,
});

const persistenceMiddleware = createPersistenceMiddleware();

var store = createStore(
  allReducers,
  applyMiddleware(schedulerMiddleware, persistenceMiddleware)
);

// Expose store to window for debugging
if (typeof window !== 'undefined') {
  window.store = store;
}

export default store;
