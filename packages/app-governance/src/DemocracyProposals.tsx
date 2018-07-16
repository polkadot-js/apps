import React from 'react';

import storage from '@polkadot/storage';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import isUndefined from '@polkadot/util/is/undefined';

const method = storage.democracy.public.proposals;

const DemocracyProposals: React.ComponentType<any> = withStorageDiv(method)(
  (value: any): string => {
    console.log('value: ', value);
    if (isUndefined(value) || !value.length) {
      return 'No democracy proposals found';
    }

    let democracyProposals: Array<string> = [];
    let democracyProposal: Uint8Array;
    for (let democracyProposalData of value) {
      console.log('democracyProposalData: ', democracyProposalData);
      democracyProposal = democracyProposalData[2];
      console.log('democracyProposal: ', democracyProposal)
      democracyProposals.push(encodeAddress(democracyProposal));
    }
  
    return democracyProposals.join(', ');
  }
);

export default DemocracyProposals;