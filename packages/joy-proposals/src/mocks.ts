import { BlockNumber, Balance, u32, Text } from '@polkadot/types';
import { Proposal, ProposalStatus } from '@polkadot/joy-utils/types';
import { AccountIds } from '@polkadot/joy-utils/accounts';

export const HashedVotesMock: Proposal[] = [
  {
    id: new u32(1),
    proposer: AccountIds.Bob,
    stake: new Balance(123),
    name: new Text('Best proposal ever'),
    description: new Text('Vote for me!'),
    wasm_code: new Text('WASM code mock 1'),
    proposed_at: new BlockNumber(12),
    status: new ProposalStatus('Pending')
  },
  {
    id: new u32(2),
    proposer: AccountIds.Charlie,
    stake: new Balance(456),
    name: new Text('Lots of new features'),
    description: new Text('Includes breaking changes'),
    wasm_code: new Text('WASM code mock 2'),
    proposed_at: new BlockNumber(23),
    status: new ProposalStatus('Approved')
  },
  {
    id: new u32(3),
    proposer: AccountIds.Dave,
    stake: new Balance(789),
    name: new Text('Good one'),
    description: new Text('See changes on GitHub.'),
    wasm_code: new Text('WASM code mock 3'),
    proposed_at: new BlockNumber(34),
    status: new ProposalStatus('Rejected')
  }
];
