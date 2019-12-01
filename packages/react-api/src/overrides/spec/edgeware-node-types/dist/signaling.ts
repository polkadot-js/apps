/* eslint-disable */
import { u32, Text, u64, Bytes } from '@polkadot/types';
import { Struct } from '@polkadot/types/codec';
import { Registry } from '@polkadot/types/types';
import { VotingTypes, VoteStage } from './voting';
import AccountId from '@polkadot/types/primitive/Generic/AccountId';

export class ProposalRecord extends Struct {
  constructor (registry: Registry, value: any) {
    super(registry, {
      index: u32,
      author: AccountId,
      stage: VoteStage,
      transition_time: u32,
      title: Text,
      contents: Text,
      vote_id: u64,
    }, value);
  }
  get index (): u32 {
    return this.get('index') as u32;
  }
  get author (): AccountId {
    return this.get('author') as AccountId;
  }
  get stage (): VoteStage {
    return this.get('stage') as VoteStage;
  }
  get transition_time (): u32 {
    return this.get('transition_time') as u32;
  }
  get title () : Text {
    return this.get('title') as Text;
  }
  get contents () : Text {
    return this.get('contents') as Text;
  }
  get vote_id () : u64 {
    return this.get('vote_id') as u64;
  }
}

export const SignalingTypes = {
  PreVoting: VotingTypes.PreVoting,
  Voting: VotingTypes.Voting,
  Completed: VotingTypes.Completed,
  Commit: VotingTypes.Commit,
  VoteStage,
  ProposalRecord,
  ProposalContents: Bytes,
  ProposalTitle: Bytes,
};
