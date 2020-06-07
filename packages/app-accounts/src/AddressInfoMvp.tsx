// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withMulti } from '@polkadot/react-api/hoc';
import { useAccounts } from '@polkadot/react-hooks';
import FormatBalance from '@polkadot/app-generic-asset/FormatBalance';
import assetsRegistry, {SPENDING_ASSET_NAME, STAKING_ASSET_NAME} from '@polkadot/app-generic-asset/assetsRegistry';
import { useApi, useCall } from '@polkadot/react-hooks';

import Label from '@polkadot/react-components/Label';
import { useTranslation } from './translate';
import { AssetId } from '@cennznet/types/runtime';

// true to display, or (for bonded) provided values [own, ...all extras]
export interface BalanceActiveType {
  available?: boolean;
  bonded?: boolean | BN[];
  extraInfo?: [React.ReactNode, React.ReactNode][];
  locked?: boolean;
  redeemable?: boolean;
  reserved?: boolean;
  total?: boolean;
  unlocking?: boolean;
  vested?: boolean;
}

export interface CryptoActiveType {
  crypto?: boolean;
  nonce?: boolean;
}

interface Props extends BareProps {
  address: string;
  children?: React.ReactNode;
  extraInfo?: [string, string][];
  withBalance?: boolean | BalanceActiveType;
  withBalanceToggle?: false;
  withExtended?: boolean | CryptoActiveType;
  withHexSessionId?: (string | null)[];
  withRewardDestination?: boolean;
}

function renderBalances (props: Props, allAccounts: string[], t: (key: string) => string): React.ReactNode {
  const { address } = props;

  const { api } = useApi();

    // Populate staking/CENNZ and spending/CPAY IDs from the connected chain
    const stakingAssetId = useCall<AssetId>(api.query.genericAsset.stakingAssetId as any, []);
    if (stakingAssetId) {
      assetsRegistry.add(
        stakingAssetId.toNumber().toString(),
        STAKING_ASSET_NAME
      );
    }
  
    const spendingAssetId = useCall<AssetId>(api.query.genericAsset.spendingAssetId as any, []);
    if (spendingAssetId) {
      assetsRegistry.add(
        spendingAssetId.toNumber().toString(),
        SPENDING_ASSET_NAME
      );
    }

  const cennzBalance = useCall<'Balance'>(api.query.genericAsset.freeBalance as any, [assetsRegistry.getStakingAssetId(), address]);
  const cpayBalance = useCall<'Balance'>(api.query.genericAsset.freeBalance as any, [assetsRegistry.getSpendingAssetId(), address]);

  return (
    <>
        <>
        <Label label={t('balances')} />
        <FormatBalance
            className='result'
            value={cennzBalance}
            symbol={STAKING_ASSET_NAME}
        />
        </>
        <>
        <Label/>
        <FormatBalance
            className='result'
            value={cpayBalance}
            symbol={SPENDING_ASSET_NAME}
        />
        </>
    </>
  );
}

function AddressInfo (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const { className, children } = props;

  return (
    <div className={`ui--AddressInfo ${className} ui--AddressInfo-expander`}>
      <div className={'column column--expander'}>
        {renderBalances(props, allAccounts, t)}
      </div>
      {children && (
        <div className='column'>
          {children}
        </div>
      )}
    </div>
  );
}

export default withMulti(
  styled(AddressInfo)`
    align-items: flex-start;
    display: flex;
    flex: 1;
    white-space: nowrap;

    &:not(.ui--AddressInfo-expander) {
      justify-content: center;
    }

    .column {
      justify-content: start;

      &.column--expander {
        text-align: left;
        width: 15rem;

        details[open] summary {
          .body {
            opacity: 0;
          }
        }

        details summary {
          width: 100%;

          .body {
            display: inline-block;
            text-align: right;
            min-width: 12rem;
          }
        }
      }

      &:not(.column--expander) {
        flex: 1;
        display: grid;
        opacity: 1;

        label {
          grid-column: 1;
          padding-right: 0.5rem;
          text-align: right;
          vertical-align: middle;

          .help.circle.icon {
            display: none;
          }
        }

        .result {
          grid-column: 2;

          .icon {
            margin-left: .3em;
            margin-right: 0;
            padding-right: 0 !important;
          }

          button.ui.icon.primary.button.icon-button {
            background: white !important;
          }
        }
      }
    }
  `,
);
