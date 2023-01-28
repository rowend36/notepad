import { h } from "preact";
import { Link } from "preact-router/match";
import { useAppData } from "../../logic/app_data";
import Image from "../Image";
import style from "./style.module.css";
import prettyBytes from "pretty-bytes";

const Header = () => {
  const fileSize = useAppData().fileSize;
  return (
    <header class={style.header}>
      <a href="/" class={style.logo}>
        <Image
          srcDark="../../assets/notepad-logo-inverse.svg"
          src="../../assets/notepad-logo.svg"
          alt="Preact Logo"
          height="32"
          width="32"
        />
        <h1>Notepad</h1>
      </a>
      <span class={style.logo}>File size: {prettyBytes(fileSize)}</span>
      {/* <nav>
      <Link activeClassName={style.active} href="/">
        Home
      </Link>
    </nav> */}
    </header>
  );
};

export default Header;
