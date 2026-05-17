import type { SocialType } from "@kissnotes/types";
import BehanceIcon from "@/assets/img/behance.svg";
import DiscordIcon from "@/assets/img/discord.svg";
import DribbbleIcon from "@/assets/img/dribbble.svg";
import FacebookIcon from "@/assets/img/facebook.svg";
import GithubIcon from "@/assets/img/github.svg";
import InstagramIcon from "@/assets/img/instagram.svg";
import LinkedinIcon from "@/assets/img/linkedin.svg";
import PinterestIcon from "@/assets/img/pinterest.svg";
import RedditIcon from "@/assets/img/reddit.svg";
import SignalIcon from "@/assets/img/signal.svg";
import SnapIcon from "@/assets/img/snap.svg";
import TelegramIcon from "@/assets/img/telegram.svg";
import TiktokIcon from "@/assets/img/tiktok.svg";
import TwitchIcon from "@/assets/img/twitch.svg";
import XIcon from "@/assets/img/x.svg";
import YoutubeIcon from "@/assets/img/youtube.svg";

export const SocialLinkIcon: Record<
  SocialType,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  instagram: InstagramIcon,
  x: XIcon,
  snap: SnapIcon,
  telegram: TelegramIcon,
  tiktok: TiktokIcon,
  pinterest: PinterestIcon,
  reddit: RedditIcon,
  twitch: TwitchIcon,
  youtube: YoutubeIcon,
  github: GithubIcon,
  facebook: FacebookIcon,
  signal: SignalIcon,
  discord: DiscordIcon,
  dribbble: DribbbleIcon,
  behance: BehanceIcon,
  linkedin: LinkedinIcon,
};
