// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NetworkSpecsStruct } from '@polkadot/ui-settings/types';
import type { ChainInfo, ChainType } from '../types.js';

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { ChainImg, Input, QrNetworkSpecs, Spinner, styled, Table } from '@polkadot/react-components';
import { useApi, useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ChainColorIndicator from './ChainColorIndicator.js';

interface Props {
  chainInfo: ChainInfo | null;
  className?: string;
}

// TODO-MOONBEAM: update NetworkSpecsStruct in @polkadot/ui-settings/types
interface NetworkSpecsStructWithType extends NetworkSpecsStruct{
  chainType: ChainType
}

function getRandomColor (): string {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

const initialState = {
  chainType: 'substrate' as ChainType,
  color: '#FFFFFF',
  decimals: 0,
  genesisHash: '',
  prefix: 0,
  title: '',
  unit: 'UNIT'
};

function NetworkSpecs ({ chainInfo, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isApiReady, systemChain } = useApi();
  const [qrData, setQrData] = useState<NetworkSpecsStructWithType>(initialState);
  const debouncedQrData = useDebounce(qrData, 500);

  const reducer = (state: NetworkSpecsStructWithType, delta: Partial<NetworkSpecsStructWithType>): NetworkSpecsStructWithType => {
    const newState = {
      ...state,
      ...delta
    };

    setQrData(newState);

    return newState;
  };

  const [networkSpecs, setNetworkSpecs] = useReducer(reducer, initialState);

  useEffect((): void => {
    chainInfo && setNetworkSpecs({
      chainType: chainInfo.chainType,
      color: chainInfo.color || getRandomColor(),
      decimals: chainInfo.tokenDecimals,
      genesisHash: chainInfo.genesisHash,
      prefix: chainInfo.ss58Format,
      title: systemChain,
      unit: chainInfo.tokenSymbol
    });
  }, [chainInfo, systemChain]);

  const _onChangeColor = useCallback(
    (color: string): void => setNetworkSpecs({ color }),
    []
  );

  const _onSetRandomColor = useCallback(
    (event: React.MouseEvent<unknown>): void => {
      event.preventDefault();
      event.stopPropagation();

      setNetworkSpecs({ color: getRandomColor() });
    },
    []
  );
  const _checkColorValid = useCallback(
    (): boolean => /^#[\da-fA-F]{6}|#[\da-fA-F]{3}$/.test(networkSpecs.color),
    [networkSpecs]
  );

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t<string>('chain specifications'), 'start', 2]
  ]);

  if (!isApiReady) {
    return <Spinner />;
  }

  return (
    <StyledTable
      className={className}
      empty={t<string>('No open tips')}
      header={headerRef.current}
    >

      <tr>
        <td>
          <div className='settings--networkSpecs-name'>
            <Input
              className='full'
              isDisabled
              label={t<string>('Network Name')}
              value={networkSpecs.title}
            />
            <ChainImg className='settings--networkSpecs-logo' />
          </div>
        </td>
        <td rowSpan={7}>
          {qrData.genesisHash && (
            <QrNetworkSpecs
              className='settings--networkSpecs-qr'
              networkSpecs={debouncedQrData}
            />
          )}
        </td>
      </tr>
      <tr>
        <td>
          <div className='settings--networkSpecs-color'>
            <div>
              <Input
                className='full settings--networkSpecs-colorInput'
                isError={!_checkColorValid()}
                label={t<string>('Color')}
                onChange={_onChangeColor}
                value={networkSpecs.color}
              />
              <a
                className='settings--networkSpecs-colorChangeButton'
                onClick={_onSetRandomColor}
              >
                {t<string>('generate random color')}
              </a>
            </div>
            <ChainColorIndicator
              className='settings--networkSpecs-colorBar'
              color={networkSpecs.color}
            />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t<string>('Genesis Hash')}
            value={networkSpecs.genesisHash}
          />
        </td>
      </tr>
      <tr>
        <td>

          <Input
            className='full'
            isDisabled
            label={t<string>('Unit')}
            value={networkSpecs.unit}
          />
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t<string>('Address Prefix')}
            value={networkSpecs.prefix.toString()}
          />
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t<string>('Decimals')}
            value={networkSpecs.decimals.toString()}
          />
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            isDisabled
            label={t<string>('Chain Type')}
            value={networkSpecs.chainType}
          />
        </td>
      </tr>
    </StyledTable>
  );
}

const StyledTable = styled(Table)`
  td {
    padding: 0;

    .input.ui--Input input {
      border: none !important;
      background: transparent;
    }
  }

  .settings--networkSpecs-name {
    position: relative;

    .settings--networkSpecs-logo {
      height: 32px;
      left: 12px;
      position: absolute;
      top: 1rem;
      width: 32px;
    }
  }

  .settings--networkSpecs-color {
    position: relative;

    > div:first-child {
      display: flex;

      .settings--networkSpecs-colorInput {
        min-width: 124px;
      }

      .settings--networkSpecs-colorChangeButton {
        user-select: none;
        cursor: pointer;
        background: transparent;
        border: none;
        outline: none;
        align-self: flex-end;
        padding-bottom: 0.9rem;
      }
    }

    .settings--networkSpecs-colorBar {
      border-radius: 50%;
      border: 1px solid grey;
      height: 32px;
      left: 12px;
      position: absolute;
      top: 1rem;
      width: 32px;
    }
  }

  .settings--networkSpecs-qr {
    margin: 0.25rem auto;
    max-width: 15rem;

    img {
      border: 1px solid white;
    }
  }
`;

export default React.memo(NetworkSpecs);
