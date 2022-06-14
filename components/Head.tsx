import { useRouter } from "next/router";
import Head from "next/head";
import { metadata } from "../data/metadata";

const CommonHead = (props: { title: string; description: string }) => {
  const router = useRouter();
  const { title, description } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${metadata.siteUrl}${router.asPath}`} />
      <meta property="og:type" content={"website"} />
      <meta property="og:site_name" content={metadata.siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta
        property="og:image"
        content={metadata.siteImageURL}
        key={metadata.siteUrl}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={metadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metadata.siteImageURL} />
    </Head>
  );
};

const PageHead = (props: { title: string; description: string }) => {
  return <CommonHead title={props.title} description={props.description} />;
};

export default PageHead;
