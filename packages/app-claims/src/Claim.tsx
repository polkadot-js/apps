/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { BalanceOf, EthereumAddress } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import styled from 'styled-components';
import { withApi, withMulti } from '@polkadot/ui-api';
import { Button, Icon, Input, Inset, Output } from '@polkadot/ui-app';
import { formatBalance/*, hexToU8a, stringToU8a, u8aToString, u8aToHex*/ } from '@polkadot/util';
// import { keccakAsU8a, secp256k1Recover } from '@polkadot/util-crypto';

/*
{
  "address": "0xe71026fcbcecc825f848bcba05cb52bc250bca92",
  "msg": "Pay KSMs to the Kusama account:5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  "sig": "0x98adffe14b1882ba5a861d6aaa10805d52aed56f480e1ece01505a77470f29f15cb4b0a1dc33177761de8270199282baf160f255e1ca0e4c8354b54b0059e40a1c",
  "version": "2"
}
*/

import translate from './translate';

const ClaimInner = styled.div`
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 12rem;
  align-items: center;
  margin: 0 1rem;

  h3 {
    font-family: monospace;
    font-size: 1.5rem;
    max-width: 100%;
    margin: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  h2 {
    margin: 0.5rem 0 2rem
    font-family: monospace;
    font-size: 2.5rem;
    font-weight: 200;
  }
`

interface Props extends ApiProps, I18nProps {
  button: React.ReactNode;
  ethereumAddress: EthereumAddress | null;
};

interface State {
  claim: BalanceOf | null;
  ethereumAddress: EthereumAddress | null;
  isValidAddress: boolean;
  hasClaim: boolean;
  isBusy: boolean;
}

class Claim extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps ({ ethereumAddress }: Props, state: State): Pick<State, never> {
    if (ethereumAddress) {
      return {
        ethereumAddress,
        isValidAddress: true,
        hasClaim: state.claim && state.claim.gten(0)
      };
    }

    return {
      isValidAddress: false,
      hasClaim: false
    };
  }

  public state: State = {
    claim: null,
    ethereumAddress: null,
    hasClaim: false,
    isBusy: false,
    isValidAddress: false,
  }

  public componentDidMount () {
    this.fetchClaim();
  }

  public componentDidUpdate (_: Props, prevState: State) {
    const { ethereumAddress } = this.state;
    if (ethereumAddress !== prevState.ethereumAddress) {
      this.fetchClaim();
    }
  }

  public render (): React.ReactNode {
    const { button, t } = this.props;
    const { claim, ethereumAddress, hasClaim, isBusy, isValidAddress } = this.state;

    if (isBusy || !ethereumAddress) {
      return null;
    }

    return (
      <Inset
        isError={!hasClaim || !claim}
        isSuccess={hasClaim && !!claim}
      >
        <ClaimInner>
          {t('Your Ethereum account')}
            <h3>
              {ethereumAddress.toString()}
            </h3>
            {hasClaim && !!claim
              ? (
                <>
                  {t('has a valid claim for')}
                  <h2>
                    {formatBalance(claim)}
                  </h2>
                  <Button.Group>
                    {button}
                  </Button.Group>
                </>
              )
              : (
                <>
                  {t('does not appear to have a valid claim. Please double check that you have signed the transaction correctly on the correct ETH account.')}
                </>
              )}
            </ClaimInner>
          </Inset>
    );
  }

  private fetchClaim (): void {
    const { api } = this.props;
    const { ethereumAddress } = this.state;

    if (!ethereumAddress) {
      return;
    }

    this.setState(
      {
        isBusy: true
      },
      (): void => {
        api.query.claims.claims<Option<BalanceOf>>(ethereumAddress.toHex())
          .then((claim): void => {
            this.setState({
              claim: claim.unwrapOr(null),
              isBusy: false
            });
          });
      }
    );
  }
}


export default withMulti(
  Claim,
  translate,
  withApi,
);
