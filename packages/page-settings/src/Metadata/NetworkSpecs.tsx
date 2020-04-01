// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChainInfo } from '../types';

import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { Button, Columar, Column, Input, Spinner } from '@polkadot/react-components';
import { useApi, useDebounce } from '@polkadot/react-hooks';
import { QrNetworkSpecs } from '@polkadot/react-qr';
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
  decimals: 0,
  prefix: 0,
  unit: 'UNIT',
  title: '',
  color: '#FFFFFF',
  genesisHash: ''
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
      prefix: chainInfo.ss58Format,
      unit: chainInfo.tokenSymbol,
      title: systemChain,
      genesisHash: chainInfo.genesisHash
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
        <Input
          className='full'
          help={t('Name of the network. It only for display purpose.')}
          isDisabled
          label={t('Network Name')}
          value={networkSpecs.title}
        />
        <Input
          className='full'
          help={t('The color used to distinguish this network with others, use color code with 3 or 6 digits, like "#FFF" or "#111111"')}
          isError={!_checkColorValid()}
          label={t('Color')}
          onChange={_onChangeColor}
          value={networkSpecs.color}
        >
          <div className='settings--networkSpecs-colorButton'>
            <Button
              icon='sync'
              key='spread'
              label={t('Random')}
              onClick={_onSetRandomColor}
            />
            <ChainColorIndicator color={networkSpecs.color}/>
          </div>
        </Input>
        <Input
          className='full'
          help={t('Genesis Hash refers to initial state of the chain, it cannot be changed once the chain is launched')}
          isDisabled
          label={t('Genesis Hash')}
          value={networkSpecs.genesisHash}
        />
        <Input
          className='full'
          help={t('Unit decides the name of 1 unit token, e.g. "DOT" for Polkadot')}
          isDisabled
          label={t('Unit')}
          value={networkSpecs.unit}
        />
        <Input
          className='full'
          help={t('Prefix indicates the his network, is a number between 0 ~ 255 describes the precise format of the bytes of the address')}
          isDisabled
          label={t('Address Prefix')}
          value={networkSpecs.prefix}
        />
        <Input
          className='full'
          help={t('Decimals decides the smallest unit of the token, which is 1/10^decimals')}
          isDisabled
          label={t('Decimals')}
          value={networkSpecs.decimals}
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
`);
