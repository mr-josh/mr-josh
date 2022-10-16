import {
  IconArrowDown,
  IconBrandGithub,
  IconBrandTiktok,
  IconBrandTwitch,
  IconBrandYoutube,
  IconMessages,
} from "@tabler/icons";

import { Button } from "@mantine/core";
import { motion } from "framer-motion";
import style from "./style.module.css";
import { useState } from "react";

const videoCards = [
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-01.mp4",
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-02.mp4",
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-03.mp4",
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-04.mp4",
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-05.mp4",
  "https://mrjoshdata.blob.core.windows.net/static/assets/videos/yt-06.mp4",
];

const BioCard = () => {
  const [activeCard, setActiveCard] = useState(0);

  const onClipHover = (i: number) => {
    setActiveCard(i);
  };

  return (
    <section className={`page-container ${style.container}`}>
      <motion.div
        className={style.card}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1.0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        <div className={style.head}>
          <h1>Mr Josh</h1>
        </div>
        <hr />
        <div className={style.content}>
          <h2>Clips</h2>
          <div className={style.clips}>
            {videoCards.map((video, i) => {
              const layer = Math.abs(i - activeCard) * -1;
              return (
                <video
                  key={i}
                  style={{
                    left: `${i * 1.4}rem`,
                    zIndex: layer,
                    filter: `
                      blur(${Math.abs(layer) * 1}px)
                      brightness(${1 - Math.abs(layer) * 0.1})
                    `,
                    transform: `
                      scaleY(${1 - Math.abs(layer) * 0.025})
                    `,
                  }}
                  onMouseEnter={() => onClipHover(i)}
                  src={video}
                  autoPlay
                  muted
                  loop
                />
              );
            })}
          </div>
        </div>
        <div className={`${style.foot} ${style.links}`}>
          <a href="https://github.com/mr-josh" target="_blank">
            <IconBrandGithub />
            <sub>Github</sub>
          </a>
          <a
            href="https://www.youtube.com/channel/UCcvLl6Klln_N08r28axjBnA"
            target="_blank"
          >
            <IconBrandYoutube />
            <sub>YouTube</sub>
          </a>
          <a href="https://www.tiktok.com/@dotmrjosh" target="_blank">
            <IconBrandTiktok />
            <sub>TikTok</sub>
          </a>
          <a href="https://www.twitch.tv/dotmrjosh" target="_blank">
            <IconBrandTwitch />
            <sub>Twitch</sub>
          </a>
          <a href="https://discord.gg/zXrHEH3tg9" target="_blank">
            <IconMessages />
            <sub>Discord</sub>
          </a>
        </div>
      </motion.div>
      <motion.div
        initial={{ translateY: 100 }}
        animate={{ translateY: 0 }}
        transition={{ delay: 0.5 }}
        className={style.scroll}
      >
        <Button
          onClick={() => {
            window.scrollTo(
              0,
              document.querySelector("#root > section:nth-child(1)")!
                .clientHeight
            );
          }}
          variant="outline"
          radius="xl"
          color="yellow"
        >
          <IconArrowDown />
        </Button>
      </motion.div>
    </section>
  );
};

export default BioCard;
