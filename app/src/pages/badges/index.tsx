import style from "./style.module.css";

const BadgesPage = () => {
  return (
    <div class={style.container}>
      <h1>Badges</h1>
      <iframe
        src="https://badges.mr-josh.com"
        class={style.badges}
      />
    </div>
  );
};

export default BadgesPage;