import { IdentityTypes } from './identity';
import { SignalingTypes } from './signaling';
import { TreasuryRewardTypes } from './treasuryReward';
import { VotingTypes } from './voting';

export const EdgewareTypes = {
  ...IdentityTypes,
  ...SignalingTypes,
  ...TreasuryRewardTypes,
  ...VotingTypes
};
