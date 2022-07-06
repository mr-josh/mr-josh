import { For, createSignal } from "solid-js";
import { getTokens, logoutRedirect } from "auth/instance";

import ENDPOINT from "api/endpoint";
import style from "./style.module.css";

const Auth = () => {
  const [activeDialog, setActiveDialog] = createSignal();
  let dialogRef: HTMLDialogElement | undefined;

  const showDialog = () => {
    // Close handlers
    const done = () => {
      setActiveDialog(null);
    };

    dialogRef?.addEventListener("close", done);
    dialogRef?.addEventListener("cancel", done);

    // Show modal
    dialogRef?.showModal();
  };

  const openNewPersonDialog = async () => {
    let tokens = await getTokens();
    if (!tokens?.accessToken) {
      console.error("No access token");
      return;
    }

    setActiveDialog(
      <dialog class={style.dialog} ref={dialogRef} hidden={true}>
        <h3>Add score</h3>
        <div class={style.field}>
          <label for="name">Display Name</label>
          <input id="name" type="text" name="name" required />
        </div>
        <div class={style.field}>
          <label for="f-name">Full Name</label>
          <input id="f-name" type="text" name="f-name" />
        </div>
        <div class={style.row}>
          <div class={style.field}>
            <label for="bt">Bracket tip</label>
            <input id="bt" type="text" name="bt" />
          </div>
          <div class={style.field}>
            <label for="kf">Known from</label>
            <input id="kf" type="text" name="kf" />
          </div>
        </div>
        <button type="submit">Submit</button>
      </dialog>
    );

    dialogRef
      ?.querySelector("button[type='submit']")
      ?.addEventListener("click", async () => {
        let tokens = await getTokens();
        if (!tokens?.accessToken) {
          console.error("No access token");
          return;
        }

        let name: HTMLSelectElement | null | undefined =
          dialogRef?.querySelector("#name");
        let fName: HTMLInputElement | null | undefined =
          dialogRef?.querySelector("#f-name");
        let bracketTip: HTMLInputElement | null | undefined =
          dialogRef?.querySelector("#bt");
        let knownFrom: HTMLInputElement | null | undefined =
          dialogRef?.querySelector("#kf");

        await fetch(`${ENDPOINT}/scoreboard/person`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name?.value,
            help: {
              name_brackets: bracketTip?.value || null,
              known_from: knownFrom?.value || null,
              full_name: fName?.value || null,
            },
          }),
        });

        setActiveDialog(null);
      });

    showDialog();
  };

  const openScoreDialog = async () => {
    let tokens = await getTokens();
    if (!tokens?.accessToken) {
      console.error("No access token");
      return;
    }

    let request = await fetch(`${ENDPOINT}/scoreboard/people`, {
      headers: {
        "Authorization": `Bearer ${tokens.accessToken}`,
      },
    });

    // TODO: Replace any[]
    const people: any[] = await request.json();
    setActiveDialog(
      <dialog class={style.dialog} ref={dialogRef} hidden={true}>
        <h3>Add score</h3>
        <div class={style.row}>
          <div class={style.field}>
            <label for="person">Person</label>
            <select id="person" name="person">
              <For each={people}>
                {(person) => (
                  <option value={person.person_id}>{person.name}</option>
                )}
              </For>
            </select>
          </div>
          <div class={style.field}>
            <label for="score">Score</label>
            <input id="score" type="number" name="score" value={0} />
          </div>
        </div>
        <div class={style.field}>
          <label for="reason">Reason</label>
          <input id="reason" type="text" name="reason" />
        </div>
        <button type="submit">Submit</button>
      </dialog>
    );

    dialogRef
      ?.querySelector("button[type='submit']")
      ?.addEventListener("click", async () => {
        let tokens = await getTokens();
        if (!tokens?.accessToken) {
          console.error("No access token");
          return;
        }
        
        let person: HTMLSelectElement | null | undefined =
          dialogRef?.querySelector("#person");
        let score: HTMLInputElement | null | undefined =
          dialogRef?.querySelector("#score");
        let reason: HTMLInputElement | null | undefined =
          dialogRef?.querySelector("#reason");

        console.log(person?.value, score?.value, reason?.value);

        await fetch(`${ENDPOINT}/scoreboard/score`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${tokens.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            person: person?.value,
            score: score?.value,
            reason: reason?.value,
          }),
        });

        setActiveDialog(null);
      });

    showDialog();
  };

  return (
    <>
      {activeDialog}
      <div class={style.actions}>
        <button onClick={openNewPersonDialog}>Add Person</button>
        <button onClick={openScoreDialog}>Add Score</button>
      </div>
      <button class={style.loginout} onClick={logoutRedirect}>
        Sign out
      </button>
    </>
  );
};

export default Auth;
