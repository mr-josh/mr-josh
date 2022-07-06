import HomePage from "./home";
import ScoreboardPage from "./scoreboard";
import { createSignal } from "solid-js";
import style from "./router.module.css";

const Router = () => {
  const [menuActive, setMenuActive] = createSignal(false);
  const [currentView, setCurrentView] = createSignal("home");
  const toggleMenu = () => {
    setMenuActive(!menuActive());
  };

  const changeView = (view: string) => {
    setCurrentView(view);
    setMenuActive(false);
  };

  return (
    <>
      <div
        class={
          menuActive() ? `${style.container} ${style.active}` : style.container
        }
      >
        <span
          class={style.menu + " material-symbols-rounded"}
          onClick={toggleMenu}
        >
          menu
        </span>
        <div class={style.items}>
          <button
            class={style.item}
            style="--rotation: 0deg;"
            onClick={() => changeView("home")}
          >
            <span class={style.content + " material-symbols-rounded"}>
              home
            </span>
          </button>
          <button
            class={style.item}
            style="--rotation: 45deg;"
            onClick={() => changeView("scoreboard")}
          >
            <span class={style.content + " material-symbols-rounded"}>
              scoreboard
            </span>
          </button>
          <button class={style.item} style="--rotation: 90deg;">
            <span class={style.content + " material-symbols-rounded"}>
              sync
            </span>
          </button>
        </div>
      </div>
      {() => {
        switch (currentView()) {
          case "home":
            return <HomePage />;
          case "scoreboard":
            return <ScoreboardPage />;
        }
      }}
    </>
  );
};

export default Router;
