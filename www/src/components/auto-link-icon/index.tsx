import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandYoutube,
  IconLink,
} from "@tabler/icons";

const DOMAIN_ICONS: Record<string, JSX.Element> = {
  "github.com": <IconBrandGithub />,
  "twitch.tv": <IconBrandTwitch />,
  "twitter.com": <IconBrandTwitter />,
  "youtube.com": <IconBrandYoutube />,
  "instagram.com": <IconBrandInstagram />,
};

const AutoLinkIcon = (props: { url: string }) => {
  const url = new URL(props.url);
  const domain = url.hostname.split(".").slice(-2).join(".");
  const icon = DOMAIN_ICONS[domain] ?? <IconLink />;

  return icon;
};

export default AutoLinkIcon;
