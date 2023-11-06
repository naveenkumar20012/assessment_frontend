import { Helmet } from "react-helmet";

const platform: Platform = window.location.href.includes("pyjamahr")
  ? "pyjamahr"
  : "hackergenius";

const PyjamaHR = () => {
  if (platform === "pyjamahr") {
    return (
      <Helmet>
        <link rel="icon" type="image/svg+xml" href="/favicon_pyjamahr.svg" />
        <meta
          name="description"
          content="AI-powered online assessment solution for hiring the best candidates. From developers to SEO specialists to marketers, hire the best possible team using assessments of all types."
        />
        <meta
          name="keywords"
          content="hiring, assessments, AI-powered, platform, recruitment, staffing"
        />
        <meta property="og:site_name" content="pyjamahr" />
        <meta property="og:url" content="https://assessments.pyjamahr.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="PyjamaHR - AI-powered skill assessments"
        />
        <meta name="og:image" content="/favicon_pyjamahr.svg" />
        <title>PyjamaHR | AI-Powered Online Assessments</title>
      </Helmet>
    );
  }
  return (
    <Helmet>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta
        name="description"
        content="AI-powered online assessment solution for hiring the best candidates. From developers to SEO specialists to marketers, hire the best possible team using assessments of all types."
      />
      <meta
        name="keywords"
        content="hiring, assessments, AI-powered, platform, recruitment, staffing"
      />
      <meta property="og:site_name" content="hackergenius" />
      <meta property="og:url" content="https://app.hackergenius.com/" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="HackerGenius - AI-powered skill assessments"
      />
      <meta name="og:image" content="/favicon.svg" />
      <title>HackerGenius | AI-Powered Online Assessments</title>
    </Helmet>
  );
};

export default PyjamaHR;
