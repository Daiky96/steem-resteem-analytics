import React, { Component, Fragment } from 'react'
import steem from 'steem'
import Head from 'next/head'
import { Container, Input } from 'semantic-ui-react'

export default class Home extends Component {
  static async getInitialProps() {
    console.log('daw')
    const [ account ] = await steem.api.getAccountsAsync(["fel1xw"])
    console.log(account)
    return {
      account,
    }
  }

  render() {
    const { account } = this.props;

    return (
      <Fragment>
        <Head>
          <title>Dashboard</title>
        </Head>
        <div>Welcome to next.js!</div>
        <div>{account.author}</div>
      </Fragment>
    )
  }
}
