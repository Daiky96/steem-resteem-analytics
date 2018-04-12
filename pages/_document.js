import Document, { Head, Main, NextScript } from 'next/document'
import { Container } from 'semantic-ui-react'

export class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
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

export default MyDocument
