import { store } from 'react-easy-state'

import { getAccount } from '../helpers';

const accountStore = store({
  account: null,
  fetching: false,
  async fetchAccount(author) {
    accountStore.fetching = true
    accountStore.account = await getAccount(author)
    accountStore.fetching = false
  }
})

export default accountStore
