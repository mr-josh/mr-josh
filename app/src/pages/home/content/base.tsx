import style from "../style.module.scss";
import { useState } from "react";

const content = [
  "/assets/videos/yt-01.mp4",
  "/assets/videos/yt-02.mp4",
  "/assets/videos/yt-03.mp4",
  "/assets/videos/yt-04.mp4",
  "/assets/videos/yt-05.mp4",
  "/assets/videos/yt-06.mp4",
];

const BaseContent = () => {
  const [currentTop, setCurrentTop] = useState(0);

  return (
    <div className={style.base}>
      {content.map((item, index) => (
        <video
          className={style.clip}
          style={{
            left: `${index * 1.6}rem`,
            zIndex: Math.abs(index - currentTop) * -1,
            filter: `
              blur(${Math.abs(index - currentTop) * 0.5}px)
              brightness(${1 - Math.abs(index - currentTop) * 0.15})
            `,
          }}
          onMouseEnter={() => setCurrentTop(index)}
          src={item}
          autoPlay={true}
          muted={true}
          loop={true}
        />
      ))}
    </div>
  );
};

export default BaseContent;
