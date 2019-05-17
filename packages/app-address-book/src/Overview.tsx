// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyringOption from '@polkadot/ui-keyring/options';
import { KeyringOptions } from '@polkadot/ui-keyring/options/types';
import React from 'react';
import styled from 'styled-components';
import { withMulti, withObservable } from '@polkadot/ui-api';

import Account from './Account';
import { ComponentProps } from './types';

type Props = ComponentProps & {
  optionsAll?: KeyringOptions
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
    const { optionsAll } = this.props;

    return (
      <Wrapper>
        <div className='accounts'>
          {
            optionsAll && optionsAll.address && optionsAll.address.map((account) => {

              if (!account.value) {
                return null;
              }

              return (
                <Account
                  accountId={account.value}
                  key={account.value}
                />
              );
            })
          }
          <div className='spacer' />
        </div>
      </Wrapper>
    );
  }
}

export { Overview };

export default withMulti(
  Overview,
  withObservable(keyringOption.optionsSubject, { propName: 'optionsAll' })
);
