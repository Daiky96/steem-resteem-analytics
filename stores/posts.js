import { store } from 'react-easy-state'

import { getBlog } from '../helpers';

const postStore = store({
  posts: [],
  fetching: false,
  async fetchPosts(author) {
    postStore.fetching = true
    postStore.posts = await getBlog(author)
    postStore.fetching = false
  }
})

export default postStore
