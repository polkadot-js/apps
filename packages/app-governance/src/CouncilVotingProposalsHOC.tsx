// Copyright 2017-2018 @polkadot/app-governance authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

import React from 'react';

import storage from '@polkadot/storage';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import isUndefined from '@polkadot/util/is/undefined';

type StorageCouncilVotingProposal = [BN, Uint8Array];

const method = storage.councilVoting.public.proposals;

const CouncilVotingProposalsHOC: React.ComponentType<any> = withStorageDiv(method)(
  (value: Array<StorageCouncilVotingProposal>): string => {
    console.log('value cv: ', value);
    if (isUndefined(value) || !value.length) {
      return 'No council voting proposals found using HOC';
    }

    // FIXME - why only one proposal returned when multiple created in UI?
    let councilVotingProposals: Array<string> = [];
    let councilVotingProposal: Uint8Array;
    for (let councilVotingProposalData of value) {
      console.log('councilVotingProposalData: ', councilVotingProposalData);
      councilVotingProposal = councilVotingProposalData[1];
      console.log('councilVotingProposal: ', councilVotingProposal)
      councilVotingProposals.push(encodeAddress(councilVotingProposal));
    }
  
    return councilVotingProposals.join(', ');
  }
);

export default CouncilVotingProposalsHOC;