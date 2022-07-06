import { For, createSignal } from "solid-js";

import ENDPOINT from "api/endpoint";
import { logoutRedirect } from "auth/instance";
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

  const openScoreDialog = async () => {
    let request = await fetch(`${ENDPOINT}/scoreboard/people`, {
      headers: {
        Authorization: "",
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
        <button>Add Person</button>
        <button onClick={openScoreDialog}>Add Score</button>
      </div>
      <button class={style.loginout} onClick={logoutRedirect}>
        Sign out
      </button>
    </>
  );
};

export default Auth;
