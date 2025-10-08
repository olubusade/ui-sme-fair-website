// pages/_app.tsx
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import Layout from "../components/Layout";

// Import all global CSS files here, this is the only place allowed for global styles
import '../public/assets/css/main.css';
import '../public/assets/vendor/bootstrap/css/bootstrap.min.css';
import '../public/assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../public/assets/vendor/aos/aos.css';
import '../public/assets/vendor/fontawesome-free/css/all.min.css';
import '../public/assets/vendor/swiper/swiper-bundle.min.css';
import '../public/assets/vendor/glightbox/css/glightbox.min.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout className={inter.className}>
      <Component {...pageProps} />
    </Layout>
  );
}
