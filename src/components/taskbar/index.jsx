import { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Icon } from "../../utils/general";
import Battery from "../shared/Battery";
import { selectUnreadCount } from "../../player/store";
import { 
  selectFormattedGameTime, 
  selectGameDate,
  tickGameTime 
} from "../../player/gameTime";
import { selectStress } from "../../player/gameState";
import "./taskbar.scss";

// Game icon IDs that should use SVG icons instead of PNG
const GAME_ICONS = ['flappy-lanyard', 'salary-banding', 'inbox-zero', 'corporate-snake'];

const TaskIcon = ({ icon, width, className, open, click, active, payload }) => {
  if (GAME_ICONS.includes(icon)) {
    // Convert kebab-case to camelCase for icon component lookup
    const iconName = icon.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    return <Icon className={className} icon={iconName} width={width} open={open} click={click} active={active} payload={payload} />;
  }
  return <Icon className={className} src={icon} width={width} open={open} click={click} active={active} payload={payload} />;
};

const Taskbar = () => {
  const tasks = useSelector((state) => {
    return state.taskbar;
  });
  const unreadCount = useSelector(selectUnreadCount);
  const stress = useSelector(selectStress);
  const [glitchHidden, setGlitchHidden] = useState(false);
  const apps = useSelector(
    (state) => {
      var tmpApps = { ...state.apps };
      for (var i = 0; i < state.taskbar.apps.length; i++) {
        const iconKey = state.taskbar.apps[i].icon;
        if (tmpApps[iconKey]) {
          tmpApps[iconKey].task = true;
        }
      }
      return tmpApps;
    },
    shallowEqual,
  );
  const dispatch = useDispatch();

  const showPrev = (event) => {
    var ele = event.target;
    while (ele && ele.getAttribute("value") == null) {
      ele = ele.parentElement;
    }

    var appPrev = ele.getAttribute("value");
    var xpos = window.scrollX + ele.getBoundingClientRect().left;

    var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

    dispatch({
      type: "TASKPSHOW",
      payload: {
        app: appPrev,
        pos: offsetx,
      },
    });
  };

  const hidePrev = () => {
    dispatch({ type: "TASKPHIDE" });
  };

  const clickDispatch = (event) => {
    var action = {
      type: event.target.dataset.action,
      payload: event.target.dataset.payload,
    };

    if (action.type) {
      dispatch(action);
    }
  };

  const gameTime = useSelector(selectFormattedGameTime);
  const gameDate = useSelector(selectGameDate);

  // Game time ticker - 500ms interval per spec (ticker continues even when paused)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(tickGameTime());
    }, 500);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (stress <= 85) {
      setGlitchHidden(false);
      return;
    }

    let hideTimer;
    let showTimer;

    const schedule = () => {
      const nextDelay = 4000 + Math.random() * 7000;
      hideTimer = window.setTimeout(() => {
        setGlitchHidden(true);
        showTimer = window.setTimeout(() => {
          setGlitchHidden(false);
          schedule();
        }, 3000);
      }, nextDelay);
    };

    schedule();

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
      setGlitchHidden(false);
    };
  }, [stress]);

  return (
    <div className="taskbar" style={glitchHidden ? { opacity: 0, pointerEvents: "none" } : undefined}>
      <div className="taskcont">
        <div className="tasksCont" data-menu="task" data-side={tasks.align}>
          <div className="tsbar" onMouseOut={hidePrev}>
            <Icon className="tsIcon" src="home" width={24} click="STARTOGG" />
            {tasks.search ? (
              <Icon
                click="STARTSRC"
                className="tsIcon searchIcon"
                icon="taskSearch"
              />
            ) : null}
            {tasks.widgets ? (
              <Icon
                className="tsIcon widget"
                src="widget"
                width={24}
                click="WIDGTOGG"
              />
            ) : null}
            {tasks.apps.map((task, i) => {
              var isHidden = apps[task.icon].hide;
              var isActive = apps[task.icon].z == apps.hz;
              return (
                <div
                  key={i}
                  onMouseOver={(!isActive && !isHidden && showPrev) || null}
                  value={task.icon}
                >
                  <TaskIcon
                    className="tsIcon"
                    width={24}
                    open={isHidden ? null : true}
                    click={task.action}
                    active={isActive}
                    payload="togg"
                    icon={task.icon}
                  />
                </div>
              );
            })}
            {Object.keys(apps).map((key, i) => {
              if (key != "hz") {
                var isActive = apps[key].z == apps.hz;
              }
              return key != "hz" &&
                key != "undefined" &&
                !apps[key].task &&
                !apps[key].hide ? (
                <div
                  key={i}
                  onMouseOver={(!isActive && showPrev) || null}
                  value={apps[key].icon}
                >
                  <TaskIcon
                    className="tsIcon"
                    width={24}
                    active={isActive}
                    click={apps[key].action}
                    payload="togg"
                    open="true"
                    icon={apps[key].icon}
                  />
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="taskright">
          <div
            className="px-2 prtclk handcr hvlight flex"
            onClick={clickDispatch}
            data-action="BANDTOGG"
          >
            <Icon fafa="faChevronUp" width={10} />
          </div>
          <div
            className="prtclk handcr my-1 px-1 hvlight flex rounded"
            onClick={clickDispatch}
            data-action="PANETOGG"
          >
            <Icon className="taskIcon" src="wifi" ui width={16} />
            <Icon
              className="taskIcon"
              src={"audio" + tasks.audio}
              ui
              width={16}
            />
            <Battery />
          </div>

          <div
            className="taskDate m-1 handcr prtclk rounded hvlight"
            onClick={clickDispatch}
            data-action="CALNTOGG"
          >
            <div className="taskbar-time">
              <div className="taskbar-time-clock">{gameTime}</div>
              <div className="taskbar-time-date">{gameDate}</div>
            </div>
          </div>
          <div
            className="task-notif prtclk handcr rounded hvlight"
            onClick={clickDispatch}
            data-action="NOTIFTOGG"
          >
            <Icon fafa="faBell" width={16} />
            {unreadCount > 0 && (
              <span className="task-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </div>
          <Icon className="graybd my-4" ui width={6} click="SHOWDSK" pr />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
