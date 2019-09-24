// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/types';
import { BalanceOf, EthereumAddress } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiContext } from '@polkadot/react-api';
import { Button, Card } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

import translate from './translate';
import { addrToChecksum } from './util';

interface Props extends I18nProps {
  button: React.ReactNode;
  ethereumAddress: EthereumAddress | null;
}

function Claim ({ button, className, ethereumAddress, t }: Props): React.ReactElement<Props> | null {
  const { api } = useContext(ApiContext);
  const [claimValue, setClaimValue] = useState<BalanceOf | null>(null);
  const [claimAddress, setClaimAddress] = useState<EthereumAddress | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const _fetchClaim = (address: EthereumAddress): void => {
    setIsBusy(true);

    api.query.claims
      .claims<Option<BalanceOf>>(address)
      .then((claim): void => {
        setClaimValue(claim.unwrapOr(null));
        setIsBusy(false);
      })
      .catch((): void => setIsBusy(false));
  };

  useEffect((): void => {
    if (ethereumAddress !== claimAddress) {
      setClaimAddress(ethereumAddress);
      ethereumAddress && _fetchClaim(ethereumAddress);
    }
  }, [ethereumAddress]);

  if (isBusy || !claimAddress) {
    return null;
  }

  const hasClaim = claimValue && claimValue.gten(0);

  return (
    <Card
      isError={!hasClaim}
      isSuccess={!!hasClaim}
    >
      <div className={className}>
        {t('Your Ethereum account')}
        <h3>{addrToChecksum(claimAddress.toString())}</h3>
        {hasClaim && claimValue
          ? (
            <>
              {t('has a valid claim for')}
              <h2>{formatBalance(claimValue)}</h2>
              <Button.Group>{button}</Button.Group>
            </>
          )
          : (
            <>
              {t('does not appear to have a valid claim. Please double check that you have signed the transaction correctly on the correct ETH account.')}
            </>
          )}
      </div>
    </Card>
  );
}

export default translate(
  styled(Claim)`
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
      margin: 0.5rem 0 2rem;
      font-family: monospace;
      font-size: 2.5rem;
      font-weight: 200;
    }
  `
);
