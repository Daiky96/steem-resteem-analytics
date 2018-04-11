import Document, { Head, Main, NextScript } from 'next/document'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { Container, Menu, Input } from 'semantic-ui-react'

export class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        </Head>
        <body className="custom_class">
          <Container>
            <Menu>
              <Menu.Item header>Resteem.review</Menu.Item>
              <Link href="/demo">
                <Menu.Item name="Demo" />
              </Link>
              <Menu.Item position='right'>
                <Input action={{ type: 'submit', content: 'Go' }} placeholder='Steem bot name' />
              </Menu.Item>
            </Menu>
          </Container>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default withRouter(MyDocument)
