import { HashedVote } from './utils';
import { Addresses } from '@polkadot/joy-utils/accounts';

export const HashedVotesMock: HashedVote[] = [
  {
    applicantId: Addresses.Bob,
    salt: 'be36aa5b269d460bb5fe8bd4946b0692',
    hash: '0x7353b27d2cf3f092f74779494e29c80cfdd3b0f340ce2ff46f3370981d96df12'
  },
  {
    applicantId: Addresses.Charlie,
    salt: '7678d8022da34bfe9a2984eef1e8957b',
    hash: '0xd13b6878fead9461ed664ebbecbf09c8cad26315d96ebffc9650b9519f897af8'
  },
  {
    applicantId: Addresses.Dave,
    salt: '4d7f995c12ae4eeba09442fbbeefa523',
    hash: '0x54b2c87e69bf9c43006a2b5a02d141c28ac9e963dc29c1af32ec6fe11d02650c'
  }
];
