import AutoLinkIcon from "components/auto-link-icon";
import style from "./style.module.css";

const Socials = (props: { socials: string[] }) => {
  return (
    <div className={style.socials}>
      {props.socials
        .filter((s) => !!s)
        .map((social, i) => (
          <a className={style.social} href={social} target="_blank" key={i}>
            <AutoLinkIcon url={social} />
          </a>
        ))}
    </div>
  );
};

export default Socials;
