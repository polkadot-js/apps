import store from 'store';
import { nonEmptyArr } from '@polkadot/joy-utils/index';

const MY_VOTES = 'joy.myVotes';

export type NewVote = {
  voterId: string,
  applicantId: string,
  stake: string, // Actually this is a BN serialized to string.
  salt: string,
  hash: string
};

export type SavedVote = NewVote & {
  isRevealed: boolean,
  votedOnTime: number,
  revealedOnTime?: number
};

/** Get all votes that are stored in a local sotrage.  */
export const getAllVotes = (): SavedVote[] => {
  const votes = store.get(MY_VOTES);
  return nonEmptyArr(votes) ? votes as SavedVote[] : [];
};

export const getVotesByVoter = (voterId: string): SavedVote[] => {
  return getAllVotes().filter(v => v.voterId === voterId);
};

export const findVoteByHash = (hash: string): SavedVote | undefined => {
  return getAllVotes().find(v => v.hash === hash);
};

export const saveVote = (vote: NewVote): void => {
  const votes = getAllVotes();
  const similarVote = votes.find(v => v.hash === vote.hash);
  if (similarVote) {
    console.log('There is a vote with the same hash in a storage:', similarVote);
    return;
  }

  votes.push({ ...vote, votedOnTime: Date.now(), isRevealed: false });
  store.set(MY_VOTES, votes);
};

export const revealVote = (hash: string): void => {
  const votes = getAllVotes();
  const savedVote = votes.find(v => v.hash === hash);
  if (savedVote && !savedVote.isRevealed) {
    savedVote.isRevealed = true;
    savedVote.revealedOnTime = Date.now();
    store.set(MY_VOTES, votes);
  }
};
