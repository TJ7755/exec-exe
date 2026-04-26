const defState = {
  quicks: [
    {
      ui: true,
      src: "wifi",
      name: "WiFi",
      state: "network.wifi.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "bluetooth",
      name: "Bluetooth",
      state: "devices.bluetooth",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "airplane",
      name: "Flight Mode",
      state: "network.airplane",
      action: "flightMode",
    },
    {
      ui: true,
      src: "saver",
      name: "Battery Saver",
      state: "system.power.saver.state",
      action: "STNGTOGG",
    },
    {
      ui: true,
      src: "sun",
      name: "Theme",
      state: "person.theme",
      action: "changeTheme",
    },
    {
      ui: true,
      src: "nightlight",
      name: "Night Light",
      state: "system.display.nightlight.state",
      action: "STNGTOGG",
    },
  ],
  hide: true,
  banhide: true,
  calhide: true,
  notifhide: true,
};

const paneReducer = (state = defState, action) => {
  try {
    const safeState = state && typeof state === 'object' ? state : defState;
    
    if (action.type == "PANETHEM") {
      var tmpState = { ...safeState };
      if (Array.isArray(tmpState.quicks) && tmpState.quicks[4]) {
        tmpState.quicks[4].src = action.payload;
      }
      return tmpState;
    } else if (action.type == "BANDTOGG") {
      return { ...safeState, banhide: !safeState.banhide };
    } else if (action.type == "BANDHIDE") {
      return { ...safeState, banhide: true };
    } else if (action.type == "PANETOGG") {
      return { ...safeState, hide: !safeState.hide };
    } else if (action.type == "PANEHIDE") {
      return { ...safeState, hide: true };
    } else if (action.type == "CALNTOGG") {
      return { ...safeState, calhide: !safeState.calhide };
    } else if (action.type == "CALNHIDE") {
      return { ...safeState, calhide: true };
    } else if (action.type == "NOTIFTOGG") {
      return { ...safeState, notifhide: !safeState.notifhide };
    } else if (action.type == "NOTIFHIDE") {
      return { ...safeState, notifhide: true };
    } else {
      return safeState;
    }
  } catch (e) {
    console.error('[paneReducer] Error:', e);
    return defState;
  }
};

export default paneReducer;
