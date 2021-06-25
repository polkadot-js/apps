// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NetworkSpecsStruct } from '@polkadot/ui-settings/types';
import type { ChainInfo } from '../types';

import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import styled from 'styled-components';

import { ChainImg, Input, QrNetworkSpecs, Spinner, Table } from '@polkadot/react-components';
import { useApi, useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ChainColorIndicator from './ChainColorIndicator';

interface Props {
  chainInfo: ChainInfo | null;
  className?: string;
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
  const [qrData, setQrData] = useState<NetworkSpecsStruct>(initialState);
  const debouncedQrData = useDebounce(qrData, 500);

  const reducer = (state: NetworkSpecsStruct, delta: Partial<NetworkSpecsStruct>): NetworkSpecsStruct => {
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
    (): void => setNetworkSpecs({ color: getRandomColor() }),
    []
  );
  const _checkColorValid = useCallback(
    (): boolean => /^#[\da-fA-F]{6}|#[\da-fA-F]{3}$/.test(networkSpecs.color),
    [networkSpecs]
  );

  const headerRef = useRef([
    [t('chain specifications'), 'start', '2']
  ]);

  if (!isApiReady) {
    return <Spinner />;
  }

  return (
    <Table
      className={className}
      empty={t<string>('No open tips')}
      header={headerRef.current}
    >

      <tr>
        <td>
          <div className='settings--networkSpecs-name'>
            <Input
              className='full'
              help={t<string>('Name of the network. It is only for display purposes.')}
              isDisabled
              label={t<string>('Network Name')}
              value={networkSpecs.title}
            />
            <ChainImg className='settings--networkSpecs-logo' />
          </div>
        </td>
        <td rowSpan={6}>
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
                help={t<string>('The color used to distinguish this network with others, use color code with 3 or 6 digits, like "#FFF" or "#111111"')}
                isError={!_checkColorValid()}
                label={t<string>('Color')}
                onChange={_onChangeColor}
                value={networkSpecs.color}
              />
              <a className='settings--networkSpecs-colorChangeButton'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  _onSetRandomColor();
                }}>
                              generate random color
              </a>
            </div>
            <ChainColorIndicator
              className='settings--networkSpecs-colorBar'
              color={networkSpecs.color} />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <Input
            className='full'
            help={t<string>('Genesis Hash refers to initial state of the chain, it cannot be changed once the chain is launched')}
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
            help={t<string>('Unit decides the name of 1 unit token, e.g. "DOT" for Polkadot')}
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
            help={t<string>('Prefix indicates the ss58 address format in this network, it is a number between 0 ~ 255 that describes the precise format of the bytes of the address')}
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
            help={t<string>('Decimals decides the smallest unit of the token, which is 1/10^decimals')}
            isDisabled
            label={t<string>('Decimals')}
            value={networkSpecs.decimals.toString()}
          />
        </td>
      </tr>
    </Table>
  );
}

export default React.memo(styled(NetworkSpecs)`

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

`);
