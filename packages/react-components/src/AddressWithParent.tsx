// [object Object]
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import AccountName from '@polkadot/react-components/AccountName';
import IdentityIcon from '@polkadot/react-components/IdentityIcon';
import ParentAccount from '@polkadot/react-components/ParentAccount';
import { AccountId, Address } from '@polkadot/types/interfaces';

interface AddressSmallProps {
  address?: string | Address | AccountId | null | Uint8Array;
  className?: string,
}

interface Props extends AddressSmallProps {
  parentAddress: string;
}

function AddressWithParent ({ address, className, parentAddress }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <div>
        <IdentityIcon value={address as Uint8Array}/>
      </div>
      <div>
        <ParentAccount address={parentAddress}/>
        <AccountName
          className={'withSidebar'}
          value={address}
          withSidebar
        >
        </AccountName>
      </div>
    </div>
  );
}

export default React.memo(styled(AddressWithParent)`
  display: flex;
  align-items: center;
  .ui--AddressSmall {
    white-space: nowrap;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
    vertical-align: middle;
  }

  .ui--AccountName {
    max-width: 26rem;
    overflow: hidden;

    @media only screen and (max-width: 1700px) {
      max-width: 24rem;
    }

    @media only screen and (max-width: 1600px) {
      max-width: 22rem;
    }

    @media only screen and (max-width: 1500px) {
      max-width: 20rem;
    }

    @media only screen and (max-width: 1400px) {
      max-width: 18rem;
    }

    @media only screen and (max-width: 1300px) {
      max-width: 16rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 14rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 12rem;
    }
  }
`);
