import "../styles/globals.css";
import "../styles/typography.scss";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <script src="../lib/deepar.js"/>
    </>
  );
}

export default MyApp;
