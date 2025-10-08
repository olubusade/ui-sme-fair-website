import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-next-badge-root="false">
      <Head>
        <title>Bethel Specialist Hospital | Comprehensive Medical Care in Ibadan</title>
        <meta name="description" content="Bethel Specialist Hospital is a leading 24/7 private hospital in Ibadan, Nigeria. We offer multi-specialty care, NHIS-accredited services, and modern facilities with a compassionate approach." />
        <meta name="keywords" content="Bethel Specialist Hospital, Ibadan hospital, specialist hospital, medical center Ibadan, 24/7 hospital, NHIS accredited hospital, maternity care, pediatrics, Ibadan health" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.uismefairng.com/" />
        <meta property="og:title" content="Bethel Specialist Hospital | Comprehensive Medical Care in Ibadan" />
        <meta property="og:description" content="Bethel Specialist Hospital is a leading 24/7 private hospital in Ibadan, Nigeria. We offer multi-specialty care, NHIS-accredited services, and modern facilities with a compassionate approach." />
        <meta property="og:image" content="https://www.uismefairng.com/bsh-logo.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.uismefairng.com/" />
        <meta property="twitter:title" content="Bethel Specialist Hospital | Comprehensive Medical Care in Ibadan" />
        <meta property="twitter:description" content="Bethel Specialist Hospital is a leading 24/7 private hospital in Ibadan, Nigeria. We offer multi-specialty care, NHIS-accredited services, and modern facilities with a compassionate approach." />
        <meta property="twitter:image" content="https://www.uismefairng.com/bsh-logo.webp" />

        {/* Favicons */}
        <link href="/assets/img/favicon.png" rel="icon" />
        <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon" />

        {/* Fonts */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;0,700;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

        
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
