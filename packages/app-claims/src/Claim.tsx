/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { BalanceOf, EthereumAddress } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import styled from 'styled-components';
import { withApi, withMulti } from '@polkadot/react-api';
import { Button, Card } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

import translate from './translate';
import { addrToChecksum } from './util';

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
`;

interface Props extends ApiProps, I18nProps {
  button: React.ReactNode;
  ethereumAddress: EthereumAddress | null;
}

interface State {
  claim: BalanceOf | null;
  ethereumAddress: EthereumAddress | null;
  hasClaim: boolean;
  isBusy: boolean;
}

class Claim extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps ({ ethereumAddress }: Props, state: State): Pick<State, never> {
    if (ethereumAddress) {
      return {
        ethereumAddress,
        hasClaim: state.claim && state.claim.gten(0)
      };
    }

    return {
      hasClaim: false
    };
  }

  public state: State = {
    claim: null,
    ethereumAddress: null,
    hasClaim: false,
    isBusy: false
  }

  public componentDidMount (): void {
    this.fetchClaim();
  }

  public componentDidUpdate (_: Props, prevState: State): void {
    const { ethereumAddress } = this.state;
    if (ethereumAddress !== prevState.ethereumAddress) {
      this.fetchClaim();
    }
  }

  public render (): React.ReactNode {
    const { button, t } = this.props;
    const { claim, ethereumAddress, hasClaim, isBusy } = this.state;

    if (isBusy || !ethereumAddress) {
      return null;
    }

    return (
      <Card
        isError={!hasClaim || !claim}
        isSuccess={hasClaim && !!claim}
      >
        <ClaimInner>
          {t('Your Ethereum account')}
          <h3>{addrToChecksum(ethereumAddress.toString())}</h3>
          {hasClaim && !!claim
            ? (
              <>
                {t('has a valid claim for')}
                <h2>{formatBalance(claim)}</h2>
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
      </Card>
    );
  }

  private fetchClaim (): void {
    const { api } = this.props;
    const { ethereumAddress } = this.state;

    if (!ethereumAddress) {
      return;
    }

    this.setState({ isBusy: true }, (): void => {
      api.query.claims
        .claims<Option<BalanceOf>>(ethereumAddress.toHex())
        .then((claim): void => {
          this.setState({
            claim: claim.unwrapOr(null),
            isBusy: false
          });
        });
    });
  }
}

export default withMulti(
  Claim,
  translate,
  withApi
);
