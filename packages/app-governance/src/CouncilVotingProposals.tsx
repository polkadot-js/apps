import React from 'react';

import storage from '@polkadot/storage';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import isUndefined from '@polkadot/util/is/undefined';

const method = storage.councilVoting.public.proposals;

const CouncilVotingProposals: React.ComponentType<any> = withStorageDiv(method)(
  (value: any): string => {
    console.log('value: ', value);
    if (isUndefined(value) || !value.length) {
      return 'No council voting proposals found';
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

export default CouncilVotingProposals;