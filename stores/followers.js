import { store } from 'react-easy-state'

import { getFollower } from '../helpers';

const followerStore = store({
  followers: [],
  fetching: false,
  async fetchFollower(author) {
    followerStore.fetching = true
    followerStore.followers = await getFollower(author)
    followerStore.fetching = false
  }
})

export default followerStore
