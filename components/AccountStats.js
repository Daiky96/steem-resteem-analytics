import React, { Fragment } from 'react'
import { view } from 'react-easy-state'
import _ from 'lodash'
import { Message, Statistic, Segment, Image, Grid } from 'semantic-ui-react'

const AccountStats = ({ account, posts }) => (
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
                  {parseInt(_.meanBy(posts, 'count')).toLocaleString()}
                </Statistic.Value>
                <Statistic.Label>Average upvotes</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value text>
                  {posts.length > 1000 ? '500+' : posts.length}
                </Statistic.Value>
                <Statistic.Label>Resteemed Posts</Statistic.Label>
              </Statistic>

              <Statistic>
                <Statistic.Value text>
                  {parseInt(_.sumBy(posts, 'count')).toLocaleString()}
                </Statistic.Value>
                <Statistic.Label>Total upvotes of followers</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </Fragment>
)

export default view(AccountStats)
