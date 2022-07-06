import { For } from "solid-js";
import style from "./style.module.css";

const VIDEOS = [
  "assets/videos/yt-07.mp4",
  "assets/videos/yt-06.mp4",
  "assets/videos/yt-05.mp4",
  "assets/videos/yt-03.mp4",
  "assets/videos/yt-02.mp4",
  "assets/videos/yt-01.mp4",
  "assets/videos/yt-04.mp4",
];

const HomePage = () => {
  return (
    <>
      <div class={style.card}>
        <div class={style.header}>
          <h1>Mr Josh</h1>
          <img
            src="https://yt3.ggpht.com/ytc/AKedOLQfkXcrA9Zl-2skjnH9wgM_6rgTSr5-rlDO43Sq=s88-c-k-c0x00ffffff-no-rj"
            alt="image of josh"
          />
        </div>
        <hr />
        <div id={style.content}>
          <h3>Clips</h3>
          <div class={style.shorts}>
            <For each={VIDEOS}>
              {(video) => (
                <video
                  class={style.video}
                  autoplay={true}
                  loop={true}
                  muted={true}
                  src={video}
                ></video>
              )}
            </For>
          </div>
        </div>
        <div class={style.footer}>
          <a
            class={style.link}
            href="https://www.youtube.com/channel/UCcvLl6Klln_N08r28axjBnA/"
            target="_blank"
          >
            <span class="material-symbols-rounded">subscriptions</span>
            <sub>YouTube</sub>
          </a>
          <a
            class={style.link}
            href="https://memory.edgeless.land"
            target="_blank"
          >
            <span class="material-symbols-rounded">sports_esports</span>
            <sub>Edgeless</sub>
          </a>
          <a
            class={style.link}
            href="https://github.com/mr-josh"
            target="_blank"
          >
            <span class="material-symbols-rounded"> code </span>
            <sub>Github</sub>
          </a>
          <a
            class={style.link}
            href="https://discord.gg/WcWHQeaPCY"
            target="_blank"
          >
            <span class="material-symbols-rounded"> forum </span>
            <sub>Discord</sub>
          </a>
        </div>
      </div>
    </>
  );
};

export default HomePage;
