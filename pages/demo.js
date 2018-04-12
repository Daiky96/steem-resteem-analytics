import React, { Component, Fragment } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import steem from 'steem'
import _ from 'lodash'
import { Container, Input, Table, Form, Loader, Menu, Icon, Message, Statistic } from 'semantic-ui-react'

import { getBlog, getFollower, busify, getAccount, calculateVote } from '../helpers';

export default class Demo extends Component {
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
      sortKey: 'first_reblogged_on',
      sortOrder: 'ascending'
    }
  }

  componentDidMount() {
    const { author } = this.state

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
      console.log(posts[0])
      console.log(posts[posts.length - 1])
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

    this.fetch(author)
  }

  onPageChange = page => () => {
    this.setState({
      page,
    })
  }

  updateAuthor = ({ target: { value: author }}) => {
    this.setState({
      author,
    })
  }

  render() {
    const { followers, account, data, author, fetching, currentPage, error } = this.state
    const pages = _.chunk(data, 100)
    console.log(account)

    return (
      <Fragment>
        <Head>
          <title>{`Resteem review - ${account ? account.name : ''}`}</title>
        </Head>
        <Container>
          <Form onSubmit={this.onSubmit}>
            <Form.Input label='Resteem bot account' name="author" value={author} onChange={this.updateAuthor} />
            <Form.Button type="submit">Go</Form.Button>
          </Form>
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
              <Statistic.Group widths='four'>
                <Statistic>
                  <Statistic.Value text>{followers.length}</Statistic.Value>
                  <Statistic.Label>Followers</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value text>
                    {parseInt(_.meanBy(data, 'count')).toLocaleString()}
                  </Statistic.Value>
                  <Statistic.Label>Average upvotes</Statistic.Label>
                </Statistic>

                <Statistic>
                  <Statistic.Value text>
                    {data.length}
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

              <Table sortable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Post</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>Upvotes</Table.HeaderCell>
                    <Table.HeaderCell>Income</Table.HeaderCell>
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
                    <Table.HeaderCell colSpan='3'>
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
