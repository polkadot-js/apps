// Copyright 2017-2018 @polkadot/app-governance authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

import React from 'react';

import storage from '@polkadot/storage';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import isUndefined from '@polkadot/util/is/undefined';

type StorageDemocracyProposal = [BN, any, Uint8Array];

const method = storage.democracy.public.proposals;

const DemocracyProposalsHOC: React.ComponentType<any> = withStorageDiv(method)(
  (value: Array<StorageDemocracyProposal>): string => {
    console.log('value d: ', value);
    if (isUndefined(value) || !value.length) {
      return 'No democracy proposals found using HOC';
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

export default DemocracyProposalsHOC;