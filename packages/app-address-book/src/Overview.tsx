// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps } from './types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import styled from 'styled-components';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import { withMulti, withObservable } from '@polkadot/ui-api';

import Address from './Address';

type Props = ComponentProps & {
  addresses?: SubjectInfo[]
};

const Wrapper = styled.div`
  .accounts {
    display: flex;
    flex-wrap: wrap;

    .spacer {
      flex: 1 1;
      margin: .25rem;
      padding: 1rem 1.5rem;
    }
  }
`;

class Overview extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { addresses } = this.props;

    if (!addresses || Object.keys(addresses).length === 0) {
      return null;
    }

    return (
      <Wrapper>
        <div className='addresses'>
          {Object.keys(addresses).map((address) => (
            <Address
              address={address}
              key={address}
            />
          ))}
          <div className='spacer' />
        </div>
      </Wrapper>
    );
  }
}

export default withMulti(
  Overview,
  withObservable(addressObservable.subject, { propName: 'addresses' })
);
