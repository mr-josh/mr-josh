import { loginRedirect } from "auth/instance";
import style from "./style.module.css";

const Guest = () => {
  return (
    <>
      <button class={style.loginout} onClick={loginRedirect}>
        Mr Josh
      </button>
    </>
  );
};

export default Guest;
