import React, { Component, Fragment } from 'react'
import { view } from 'react-easy-state'
import Head from 'next/head'
import Router from 'next/router'
import steem from 'steem'
import _ from 'lodash'
import { Container, Input, Table, Form, Loader, Menu, Icon, Message, Statistic, Segment, Image, Grid } from 'semantic-ui-react'
import ReactGA from 'react-ga'

import Navigation from '../components/Navigation'
import { getBlog, getFollower, busify, getAccount, calculateVote } from '../helpers';
import postStore from '../stores/posts'


export class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: null,
      followers: [],
      posts: [],
      author: 'fel1xw',
      fetching: false,
      reposts: [],
      data: [],
      currentPage: 0,
      error: null,
    }
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname)
    const { author } = this.state
    postStore.fetchPosts(author)
    this.fetch(author)
  }

  fetch = author => {
    this.setState({
      fetching: true,
      error: null,
    })

    Promise.all([
      getAccount(author),
      getFollower(author),
      getBlog(author)
    ]).then(([ account, followers, posts ]) => {
      const reposts = posts
        .filter(post => post.author !== author)
        .map(calculateVote)

      followers = followers.concat(author)
      const data = reposts.map(post => {
        const voters = post.active_votes.filter(voter => followers.includes(voter.voter))
        const income = _.round(_.sum(voters.map(v => parseFloat(v.rshares * post.ratio))), 2)
        const count = voters.length
        const total = post.active_votes.length

        return Object.assign({}, {
          url: busify(post.author, post.permlink),
          total,
          count,
          percent: _.round((100 * count) / total, 2),
          income,
        })
      })

      this.setState({
        account,
        followers,
        posts,
        fetching: false,
        reposts,
        data,
      })

    })
    .catch(error => {
      this.setState({
        error: error.message,
      })
    })
  }

  onSubmit = () => {
    const { author } = this.state

    ReactGA.event({
      category: 'User',
      action: 'Search for account',
      label: author,
    })

    this.fetch(author)
  }

  onPageChange = currentPage => () => {
    this.setState({
      currentPage,
    })
  }

  updateAuthor = author => {
    this.setState({
      author,
    })
  }

  render() {
    const { followers, account, data, author, fetching, currentPage, error } = this.state
    const pages = _.chunk(data, 100)

    return (
      <Fragment>
        <Head>
          <title>{`Resteem review - ${account ? account.name : ''}`}</title>
        </Head>
        <Navigation
          account={author}
          onAccountChange={this.updateAuthor}
          onSubmit={this.onSubmit}
        />
        <Container>
          {error && (
            <Message negative>
              <Message.Header>{error}</Message.Header>
            </Message>
          )}
          {fetching && (
            <Loader active />
          )}
          {(pages.length >= 1) && !fetching && (
            <Fragment>
              <Message attached header="Statistics" />
              <Segment attached>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={2} textAlign="center">
                      <Image src={JSON.parse(account.json_metadata).profile.profile_image} size='medium' rounded />
                    </Grid.Column>
                    <Grid.Column width={14}>
                      <Statistic.Group widths='three'>
                        <Statistic>
                          <Statistic.Value text>
                            {parseInt(_.meanBy(data, 'count')).toLocaleString()}
                          </Statistic.Value>
                          <Statistic.Label>Average upvotes</Statistic.Label>
                        </Statistic>

                        <Statistic>
                          <Statistic.Value text>
                            {data.length > 1000 ? '500+' : data.length}
                          </Statistic.Value>
                          <Statistic.Label>Resteemed Posts</Statistic.Label>
                        </Statistic>

                        <Statistic>
                          <Statistic.Value text>
                            {parseInt(_.sumBy(data, 'count')).toLocaleString()}
                          </Statistic.Value>
                          <Statistic.Label>Total upvotes of followers</Statistic.Label>
                        </Statistic>
                      </Statistic.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>

              <Message attached='top' header={`Resteemed (${data.length})`} />
              <Table attached>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Url</Table.HeaderCell>
                    <Table.HeaderCell>Total upvotes</Table.HeaderCell>
                    <Table.HeaderCell>Upvotes of followers</Table.HeaderCell>
                    <Table.HeaderCell>Income of followers</Table.HeaderCell>
                    <Table.HeaderCell>Percent</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {pages[currentPage].map(row => (
                    <Table.Row key={row.url}>
                      <Table.Cell><a href={row.url} target="_blank">{row.url}</a></Table.Cell>
                      <Table.Cell textAlign='right'>{row.total}</Table.Cell>
                      <Table.Cell textAlign='right'>{row.count}</Table.Cell>
                      <Table.Cell textAlign='right'>{row.income.toLocaleString()} $</Table.Cell>
                      <Table.Cell
                        positive={row.percent > 50}
                        warning={row.percent < 50 && row.percent > 10}
                        error={row.percent < 10}
                        textAlign='right'
                      >
                        {row.percent} %
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>

                <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                      <Menu floated='right' pagination>
                        <Menu.Item icon onClick={this.onPageChange(currentPage - 1)}>
                          <Icon name='chevron left' />
                        </Menu.Item>
                        {pages.map((page, i) => (
                          <Menu.Item
                            key={i}
                            onClick={this.onPageChange(i)}
                            active={currentPage === i}
                          >
                            {i + 1}
                          </Menu.Item>
                        ))}
                        <Menu.Item icon onClick={this.onPageChange(currentPage + 1)}>
                          <Icon name='chevron right' />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Fragment>
          )}
        </Container>
      </Fragment>
    )
  }
}

export default view(Demo)
