import axios from "axios";
import store from "../reducers";
import { dfApps } from "../utils";
import { gene_name } from "../utils/apps";

export const dispatchAction = (event) => {
  const action = {
    type: event.target.dataset.action,
    payload: event.target.dataset.payload,
  };

  if (action.type) {
    store.dispatch(action);
  }
};

export const refresh = (pl, menu) => {
  if (menu.menus.desk[0].opts[4].check) {
    store.dispatch({ type: "DESKHIDE" });
    setTimeout(() => store.dispatch({ type: "DESKSHOW" }), 100);
  }
};

export const changeIconSize = (size, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[0].dot = false;
  tmpMenu.menus.desk[0].opts[1].dot = false;
  tmpMenu.menus.desk[0].opts[2].dot = false;
  var isize = 1;

  if (size == "large") {
    tmpMenu.menus.desk[0].opts[0].dot = true;
    isize = 1.5;
  } else if (size == "medium") {
    tmpMenu.menus.desk[0].opts[1].dot = true;
    isize = 1.2;
  } else {
    tmpMenu.menus.desk[0].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSIZE", payload: isize });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const deskHide = (payload, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[0].opts[4].check ^= 1;

  store.dispatch({ type: "DESKTOGG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeSort = (sort, menu) => {
  var tmpMenu = { ...menu };
  tmpMenu.menus.desk[1].opts[0].dot = false;
  tmpMenu.menus.desk[1].opts[1].dot = false;
  tmpMenu.menus.desk[1].opts[2].dot = false;
  if (sort == "name") {
    tmpMenu.menus.desk[1].opts[0].dot = true;
  } else if (sort == "size") {
    tmpMenu.menus.desk[1].opts[1].dot = true;
  } else {
    tmpMenu.menus.desk[1].opts[2].dot = true;
  }

  refresh("", tmpMenu);
  store.dispatch({ type: "DESKSORT", payload: sort });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const changeTaskAlign = (align, menu) => {
  var tmpMenu = { ...menu };
  if (tmpMenu.menus.task[0].opts[align == "left" ? 0 : 1].dot) return;

  tmpMenu.menus.task[0].opts[0].dot = false;
  tmpMenu.menus.task[0].opts[1].dot = false;

  if (align == "left") {
    tmpMenu.menus.task[0].opts[0].dot = true;
  } else {
    tmpMenu.menus.task[0].opts[1].dot = true;
  }

  store.dispatch({ type: "TASKTOG" });
  store.dispatch({ type: "MENUCHNG", payload: tmpMenu });
};

export const performApp = (act, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (act == "open") {
    if (data.type) store.dispatch(data);
  } else if (act == "delshort") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter(
        (x) =>
          apps[x].action == data.type ||
          (apps[x].payload == data.payload && apps[x].payload != null),
      );

      app = apps[app];
      if (app) {
        store.dispatch({ type: "DESKREM", payload: app.name });
      }
    }
  }
};

export const delApp = (act, menu) => {
  var data = {
    type: menu.dataset.action,
    payload: menu.dataset.payload,
  };

  if (act == "delete") {
    if (data.type) {
      var apps = store.getState().apps;
      var app = Object.keys(apps).filter((x) => apps[x].action == data.type);
      if (app) {
        app = apps[app];
        if (app.pwa == true || app.pwa == False /*what is that for ?*/) {
          store.dispatch({ type: app.action, payload: "close" });
          store.dispatch({ type: "DELAPP", payload: app.icon });

          var installed = localStorage.getItem("installed");
          if (!installed) installed = "[]";

          try {
            installed = JSON.parse(installed);
            if (!Array.isArray(installed)) installed = [];
          } catch (e) {
            console.warn('[delApp] Failed to parse installed:', e);
            installed = [];
          }
          installed = installed.filter((x) => x.icon != app.icon);
          localStorage.setItem("installed", JSON.stringify(installed));

          store.dispatch({ type: "DESKREM", payload: app.name });
        }
      }
    }
  }
};

export const installApp = (data) => {
  try {
    var app = { ...data, type: "app", pwa: true };

    var installed = localStorage.getItem("installed");
    if (!installed) installed = "[]";

    try {
      installed = JSON.parse(installed);
    } catch (e) {
      console.warn('[installApp] Failed to parse installed:', e);
      installed = [];
    }

    // Defensive check: ensure installed is an array, not a number or other primitive
    if (!Array.isArray(installed)) {
      console.warn('[installApp] installed is not an array:', installed);
      installed = [];
    }

    installed.push(app);
    localStorage.setItem("installed", JSON.stringify(installed));

    var desk = localStorage.getItem("desktop");
    if (!desk) desk = dfApps.desktop;
    else {
      try {
        desk = JSON.parse(desk);
        if (!Array.isArray(desk)) desk = dfApps.desktop;
      } catch (e) {
        desk = dfApps.desktop;
      }
    }

    if (!Array.isArray(desk)) desk = dfApps.desktop;
    desk.push(app.name);
    localStorage.setItem("desktop", JSON.stringify(desk));
  } catch (e) {
    console.error('[installApp] Error:', e);
  }
};

export const getTreeValue = (obj, path) => {
  if (path == null) return false;
  if (typeof path !== 'string') return false;

  var tdir = { ...obj };
  const pathParts = path.split(".");
  for (var i = 0; i < pathParts.length; i++) {
    tdir = tdir[pathParts[i]];
  }

  return tdir;
};

export const changeTheme = () => {
  var thm = store.getState().setting.person.theme,
    thm = thm == "light" ? "dark" : "light";
  var icon = thm == "light" ? "sun" : "moon";

  document.body.dataset.theme = thm;
  store.dispatch({ type: "STNGTHEME", payload: thm });
  store.dispatch({ type: "PANETHEM", payload: icon });
  store.dispatch({ type: "WALLSET", payload: thm == "light" ? 0 : 1 });
};

const loadWidget = async () => {
  try {
    var tmpWdgt = {
        ...store.getState().widpane,
      },
      date = new Date();

    // console.log('fetching ON THIS DAY');
    var wikiurl = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events";
    await axios
      .get(`${wikiurl}/${date.getMonth()}/${date.getDay()}`)
      .then((res) => res.data)
      .then((data) => {
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          var event = data.events[Math.floor(Math.random() * data.events.length)];
          date.setYear(event.year);

          tmpWdgt.data.date = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          tmpWdgt.data.event = event;
        }
      })
      .catch((error) => {});

    // console.log('fetching NEWS');
    await axios
      .get("https://github.win11react.com/api-cache/news.json")
      .then((res) => res.data)
      .then((data) => {
        var newsList = [];
        if (data && Array.isArray(data.articles)) {
          data["articles"].forEach((e) => {
            e.title = e["title"].split(`-`).slice(0, -1).join(`-`).trim();
            newsList.push(e);
          });
        }
        tmpWdgt.data.news = newsList;
      })
      .catch((error) => {});

    store.dispatch({
      type: "WIDGREST",
      payload: tmpWdgt,
    });
  } catch (e) {
    console.error('[loadWidget] Error:', e);
  }
};

export const loadSettings = () => {
  try {
    var sett = localStorage.getItem("setting") || "{}";
    try {
      sett = JSON.parse(sett);
      if (typeof sett !== 'object' || sett === null || Array.isArray(sett)) {
        console.warn('[loadSettings] Invalid settings in localStorage, using defaults');
        sett = {};
      }
    } catch (e) {
      console.warn('[loadSettings] Failed to parse settings, using defaults:', e);
      sett = {};
    }

    if (sett.person == null) {
      try {
        sett = JSON.parse(JSON.stringify(store.getState().setting));
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          sett.person.theme = "dark";
        }
      } catch (e) {
        console.error('[loadSettings] Failed to get default settings:', e);
        sett = {};
      }
    }

    if (sett.person.theme != "light") changeTheme();

    store.dispatch({ type: "SETTLOAD", payload: sett });
    if (import.meta.env.MODE != "development") {
      loadWidget();
    }
  } catch (e) {
    console.error('[loadSettings] Fatal error:', e);
  }
};

// mostly file explorer
export const handleFileOpen = (id) => {
  // handle double click open
  const item = store.getState().files.data.getId(id);
  if (item != null) {
    if (item.type == "folder") {
      store.dispatch({ type: "FILEDIR", payload: item.id });
    }
  }
};

export const flightMode = () => {
  store.dispatch({ type: "TOGGAIRPLNMD", payload: "" });
};
