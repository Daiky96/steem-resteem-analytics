import Document, { Head, Main, NextScript } from 'next/document'
import { Container } from 'semantic-ui-react'
import ReactGA from 'react-ga'

ReactGA.initialize('UA-117490646-1')

export class RootDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="apple-touch-icon" sizes="57x57" href="/static/assets/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/static/assets//apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/static/assets//apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/static/assets//apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/static/assets//apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/static/assets//apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/static/assets//apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/static/assets//apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/static/assets//apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/static/assets//android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/assets//favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/static/assets//favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/assets//favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="author" content="fel1xw" />
          <meta name="description" content="Steem resteem service analyzer" />
          <meta name="keywords" content="steem, resteem, analyzer, statistics" />

          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        </Head>
        <body>
          <Container>
            <Main />
            <NextScript />
          </Container>
        </body>
      </html>
    )
  }
}

export default RootDocument
