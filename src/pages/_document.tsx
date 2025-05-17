import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add the SPA redirect script */}
        <script src="/spa-redirect.js" />
        {/* Add favicon links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/Updated logo.png" />
        <link rel="apple-touch-icon" href="/images/Updated logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
