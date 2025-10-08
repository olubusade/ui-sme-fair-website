import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // Set the language and disable the Next.js badge root for a clean site
    <Html lang="en" data-next-badge-root="false">
      <Head>
        {/* ⚠️ IMPORTANT: Metadata (like <title>, description, Open Graph) MUST NOT be here.
          It causes the Next.js warning: https://nextjs.org/docs/messages/no-document-title
          Metadata belongs in next/head on individual pages (e.g., index.js).
        */}
        
        {/* Favicons (Updated to generic paths for the SME Fair) */}
        <link href="https://www.uismefairng.com/assets/img/favicon.png" rel="icon" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />

        {/* Fonts (Keep your specific Google Fonts setup) */}
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