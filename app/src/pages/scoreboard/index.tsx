import { For, createSignal } from "solid-js";

import Auth from "./auth";
import ENDPOINT from "api/endpoint";
import Guest from "./guest";
import { getTokens } from "auth/instance";
import style from "./style.module.css";

const ScoreboardPage = () => {
  const [authActions, setAuthActions] = createSignal(<p>Loading</p>);
  const [scores, setScores] = createSignal<any[]>([]);

  getTokens().then((tokens) => {
    setAuthActions(tokens ? <Auth /> : <Guest />);
  });

  const getScores = async () => {
    setScores([]);
    const tokens = await getTokens();

    let endpoint;
    if (tokens?.accessToken) {
      endpoint = "scoreboard/score/full";
    } else {
      endpoint = "scoreboard/score";
    }

    let request = await fetch(`${ENDPOINT}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${tokens?.accessToken}`,
      },
    });

    setScores(await request.json());
  };

  getScores();

  return (
    <div class={style.scoreboard}>
      <h1 class={style.header}>
        Scoreboard{" "}
        <button class={style.refresh} onClick={getScores}>
          <span class="material-symbols-rounded">refresh</span>
        </button>
      </h1>
      <table class={style.board}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
          <For each={scores()}>
            {(score: any) => (
              <tr>
                <td>{score?.person}</td>
                <td>{score?.score}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
      {authActions()}
    </div>
  );
};

export default ScoreboardPage;
