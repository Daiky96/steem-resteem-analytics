import steem from 'steem';
import _ from 'lodash';

export const getAccount = async author => {
  const [ account ] = await steem.api.getAccountsAsync([author])

  return account
}

export const getFollower = async (author, limit = 1000) => {
  let followers = [];
  let keepGoing = true;

  do {
    const result = await steem.api.getFollowersAsync(author, followers.length ? followers[followers.length - 1] : - 1, null, limit);
    followers = followers.concat(result.map(r => r.follower));
    if (result.length !== limit) {
      keepGoing = false;
    }
  } while(keepGoing);

  return _.uniq(followers);
}

export const getBlog = async (author, limit = 50) => {
  let cache = [];
  let keepGoing = true;

  do {
    const last = cache.reverse().find(post => post.author !== author);
    const query = _.omitBy({
      tag: author,
      limit,
      start_author: last && last.author,
      start_permlink: last && last.permlink,
    }, o => !o);

    const result = await steem.api.getDiscussionsByBlogAsync(query);
    cache = cache.concat(result);
    if (result.length !== limit) {
      keepGoing = false;
    }
  } while (keepGoing);

  return _.uniqBy(cache, 'permlink');
}

export const busify = (author, permlink) => `https://busy.org/@${author}/${permlink}`;
