var wps = parseInt(localStorage.getItem("wps") || "0", 10);
var locked = localStorage.getItem("locked");

// Validate wps is a number
if (isNaN(wps)) wps = 0;

// Validate locked is a string
if (locked === null || locked === undefined) locked = "true";

const walls = [
  "default/img0.jpg",
  "dark/img0.jpg",
  "ThemeA/img0.jpg",
  "ThemeA/img1.jpg",
  "ThemeA/img2.jpg",
  "ThemeA/img3.jpg",
  "ThemeB/img0.jpg",
  "ThemeB/img1.jpg",
  "ThemeB/img2.jpg",
  "ThemeB/img3.jpg",
  "ThemeC/img0.jpg",
  "ThemeC/img1.jpg",
  "ThemeC/img2.jpg",
  "ThemeC/img3.jpg",
  "ThemeD/img0.jpg",
  "ThemeD/img1.jpg",
  "ThemeD/img2.jpg",
  "ThemeD/img3.jpg",
];

const themes = ["default", "dark", "ThemeA", "ThemeB", "ThemeD", "ThemeC"];

const defState = {
  themes: themes,
  wps: wps,
  src: "gradient/corporate-dark",
  locked: !(locked == "false"),
  booted: false || import.meta.env.MODE == "development",
  act: "",
  dir: 0,
};

const wallReducer = (state = defState, action) => {
  try {
    // Ensure state is a valid object (defensive against corrupted state)
    const safeState = state && typeof state === 'object' ? state : defState;
    
    switch (action.type) {
      case "WALLUNLOCK":
        localStorage.setItem("locked", "false");
        return {
          ...safeState,
          locked: false,
          dir: 0,
        };
      case "WALLNEXT":
        var twps = (safeState.wps + 1) % walls.length;
        localStorage.setItem("wps", String(twps));
        return {
          ...safeState,
          wps: twps,
          src: walls[twps],
        };
      case "WALLALOCK":
        return {
          ...safeState,
          locked: true,
          dir: -1,
        };
      case "WALLBOOTED":
        return {
          ...safeState,
          booted: true,
          dir: 0,
          act: "",
        };
      case "WALLRESTART":
        return {
          ...safeState,
          booted: false,
          dir: -1,
          locked: true,
          act: "restart",
        };
      case "WALLSHUTDN":
        return {
          ...safeState,
          booted: false,
          dir: -1,
          locked: true,
          act: "shutdn",
        };
      case "WALLLOGOUT":
        // Clear all localStorage and reload to start fresh
        localStorage.clear();
        window.location.reload();
        return safeState;
      case "WALLSET":
        var isIndex = !Number.isNaN(parseInt(action.payload)),
          wps = 0,
          src = "";

        if (isIndex) {
          wps = parseInt(localStorage.getItem("wps") || "0", 10);
          src = walls[wps] ? walls[wps] : walls[0];
        } else {
          const idx = walls.findIndex((item) => item === action.payload);
          localStorage.setItem("wps", String(idx));
          src = action.payload;
          wps = idx; // Store the index, not the array element
        }

        return {
          ...safeState,
          wps: wps,
          src: src,
        };
      default:
        return safeState;
    }
  } catch (e) {
    console.error('[wallReducer] Error:', e);
    return defState;
  }
};

export default wallReducer;
