// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ChainInfo } from '../types';

import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { Button, ChainImg, Columar, Column, Input, QrNetworkSpecs, Spinner } from '@polkadot/react-components';
import { useApi, useDebounce } from '@polkadot/react-hooks';
import { NetworkSpecsStruct } from '@polkadot/ui-settings';

import ChainColorIndicator from './ChainColorIndicator';
import { useTranslation } from '../translate';

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

  if (!isApiReady) {
    return <Spinner />;
  }

  return (
    <Columar className={className}>
      <Column>
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
        <Input
          className='full'
          help={t<string>('The color used to distinguish this network with others, use color code with 3 or 6 digits, like "#FFF" or "#111111"')}
          isError={!_checkColorValid()}
          label={t<string>('Color')}
          onChange={_onChangeColor}
          value={networkSpecs.color}
        >
          <div className='settings--networkSpecs-colorButton'>
            <Button
              icon='sync'
              key='spread'
              label={t<string>('Random')}
              onClick={_onSetRandomColor}
            />
            <ChainColorIndicator color={networkSpecs.color}/>
          </div>
        </Input>
        <Input
          className='full'
          help={t<string>('Genesis Hash refers to initial state of the chain, it cannot be changed once the chain is launched')}
          isDisabled
          label={t<string>('Genesis Hash')}
          value={networkSpecs.genesisHash}
        />
        <Input
          className='full'
          help={t<string>('Unit decides the name of 1 unit token, e.g. "DOT" for Polkadot')}
          isDisabled
          label={t<string>('Unit')}
          value={networkSpecs.unit}
        />
        <Input
          className='full'
          help={t<string>('Prefix indicates the ss58 address format in this network, it is a number between 0 ~ 255 that describes the precise format of the bytes of the address')}
          isDisabled
          label={t<string>('Address Prefix')}
          value={networkSpecs.prefix.toString()}
        />
        <Input
          className='full'
          help={t<string>('Decimals decides the smallest unit of the token, which is 1/10^decimals')}
          isDisabled
          label={t<string>('Decimals')}
          value={networkSpecs.decimals.toString()}
        />
      </Column>
      <Column>
        <QrNetworkSpecs
          className='settings--networkSpecs-qr'
          networkSpecs={debouncedQrData}
        />
      </Column>
    </Columar>
  );
}

export default React.memo(styled(NetworkSpecs)`
  top: .3rem;

  .settings--networkSpecs-colorButton {
    display: flex;
    flex-direction: row;
  }

  .settings--networkSpecs-qr {
    margin: 0.25rem auto;
    max-width: 15rem;
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
`);
