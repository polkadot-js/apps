// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';

import { AddressSummary, Available, Balance, Bonded, CryptoType, Nonce, Unlocking } from '@polkadot/ui-app';

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

  .ui--AddressSummary {
    justify-content: space-around;
  }

  .ui--AddressSummary-base,
  .ui--AddressSummary-children {
    flex: 1;
  }

  .accounts--Account-balances-available,
  .accounts--Account-balances-balance,
  .accounts--Account-balances-bonded,
  .accounts--Account-details-crypto,
  .accounts--Account-details-nonce,
  .accounts--Account-balances-unlocking {
    display: flex;
    justify-content: center;
    color: #4e4e4e;
    opacity: 1;
  }

  /* FIXME this is a hack to act as if the element was removed from the flow */
  .action-locked,
  .action-redeemable {
    position: relative;
    margin-left: -2.5em;
    left: 1.5em;
  }

  .label-available,
  .label-balance,
  .label-bonded,
  .label-cryptotype,
  .label-locked,
  .label-nonce,
  .label-redeemable {
    font-weight: bold;
    text-align: right;
    flex:1;
    padding-right: .5em;
  }

  .result-available,
  .result-balance,
  .result-bonded,
  .result-cryptotype,
  .result-locked,
  .result-nonce,
  .result-redeemable {
    text-align: left;
    flex:1;
    padding-left: .5em;
  }

  @media (max-width: 1530px) {
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
          withBalance={false}
          withNonce={false}
          withTags
        >
          <div className='account--Account-expand'>
            <div className='account--Account-balances'>
              {this.renderTotal()}
              {this.renderAvailable()}
              {this.renderBonded()}
              {this.renderUnlocking()}
              <br/>
              {this.renderNonce()}
              {this.renderCryptoType()}
            </div>
            {this.renderButtons()}
          </div>
        </AddressSummary>
      </Wrapper>
    );
  }

  private renderAvailable () {
    const { accountId, t } = this.props;

    return (
      <Available
        className='accounts--Account-balances-available'
        label={t('available')}
        params={accountId}
      />
    );
  }

  private renderBonded () {
    const { accountId, t } = this.props;

    return (
      <Bonded
        className='accounts--Account-balances-bonded'
        label={t('bonded')}
        params={accountId}
      />
    );
  }

  private renderCryptoType () {
    const { accountId, t } = this.props;

    return (
      <CryptoType
        accountId={accountId}
        className='accounts--Account-details-crypto'
        label={t('crypto type')}
      />
    );
  }

  private renderNonce () {
    const { accountId, t } = this.props;

    return (
      <Nonce
        className='accounts--Account-details-nonce'
        params={accountId}
        label={t('transactions')}
      />
    );
  }
  
  private renderTotal () {
    const { accountId, t } = this.props;

    return (
      <Balance
        className='accounts--Account-balances-balance'
        label={t('total')}
        params={accountId}
      />
    );
  }

  private renderUnlocking () {
    const { accountId } = this.props;

    return (
      <Unlocking
        className='accounts--Account-balances-unlocking'
        params={accountId}
      />
    );
  }

  private renderButtons () {
    return <div></div>;
  }
}

export default translate(Account);
