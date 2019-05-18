// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';

import { AddressSummary, Balance, Bonded, Nonce, Unlocking } from '@polkadot/ui-app';

import translate from './translate';

type Props = I18nProps & {
  accountId: string
};

const Wrapper = styled.article`
  position: relative;
  flex: 1 1;
  min-width: 32%;
  max-width: 32%;
  justify-content: space-around;

  .ui--AddressSummary{
    justify-content: space-around;
  }

  @media (max-width: 1530px){
      min-width: 49%;
      max-width: 49%;
  }
`;

class Account extends React.PureComponent<Props> {
  render () {
    const { accountId } = this.props;

    return (
      <Wrapper className='overview--Account'>
        <AddressSummary
          value={accountId}
          identIconSize={96}
          isEditable
          withAvailable
          withBalance={false}
          withNonce={false}
          withTags
        >
          <div className='account--Account-expand'>
            <div className='account--Account-balances'>
              {this.renderTotal()}
              {this.renderBonded()}
              {this.renderUnlocking()}
              {this.renderNonce()}
            </div>
            {this.renderButtons()}
          </div>
        </AddressSummary>
      </Wrapper>
    );
  }

  private renderTotal () {
    const { accountId, t } = this.props;

    return (
      <Balance
        className='accounts--Account-balances-balance'
        label={t('total ')}
        params={accountId}
      />
    );
  }

  private renderBonded () {
    const { accountId, t } = this.props;

    return (
      <Bonded
        className='accounts--Account-balances-bonded'
        label={t('bonded ')}
        params={accountId}
      />
    );
  }

  private renderNonce () {
    const { accountId, t } = this.props;

    return (
      <Nonce
        className='accounts--Account-balances-nonce'
        params={accountId}
      >
        {t(' transactions')}
      </Nonce>
    );

  }

  private renderUnlocking () {
    const { accountId, t } = this.props;

    return (
      <Unlocking
        className='accounts--Account-balances-unlocking'
        params={accountId}
      />
    );
  }

  private renderButtons () {
    return <div>Buttons</div>;
  }
}

export default translate(Account);
