// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { getSystemChainColor } from '@polkadot/apps-config/ui/general';
import { Button, Input, Modal } from '@polkadot/react-components';
import { BareProps } from '@polkadot/react-components/types';
import { useApi, useDebounce } from '@polkadot/react-hooks';
import registry from '@polkadot/react-api/typeRegistry';
import ApiPromise from '@polkadot/api/promise';
import { createType } from '@polkadot/types';
import addressDefaults from '@polkadot/util-crypto/address/defaults';
import { QrNetworkSpecs } from '@polkadot/react-qr';
import { NetworkSpecsStruct } from '@polkadot/ui-settings';

import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../translate';

interface Props extends BareProps {
  onClose: () => void;
}

function getRandomColor (): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const buildNetworkSpecs = async (api: ApiPromise, systemChain: string, systemName: string): Promise<Partial<NetworkSpecsStruct>> => {
  const [properties, blockHash] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.chain.getBlockHash(0)
  ]);
  const DEFAULT_DECIMALS = createType(registry, 'u32', 12);
  const DEFAULT_SS58 = createType(registry, 'u32', addressDefaults.prefix);
  const title = systemChain.toString();
  const defaultPathId = title.replace(/\s/g, '_').toLowerCase();
  const chainColor = getSystemChainColor(systemChain, systemName) || getRandomColor();
  return {
    color: chainColor,
    decimals: properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS).toNumber(),
    prefix: properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber(),
    unit: properties.tokenSymbol.toString(),
    pathId: defaultPathId,
    title,
    genesisHash: blockHash.toString()
  };
};

function NetworkSpecs ({ className, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const initialState = {
    decimals: 0,
    prefix: 0,
    unit: 'UNIT',
    pathId: '',
    title: '',
    color: getRandomColor(),
    genesisHash: ''
  };
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

  const { api, systemChain, systemName, isApiReady } = useApi();
  if (!isApiReady) return null;

  useEffect((): void => {
    const getNetworkSpec = async (): Promise<void> => {
      const defaultNetworkSpecs = await buildNetworkSpecs(api, systemChain, systemName);
      setNetworkSpecs(defaultNetworkSpecs);
    };
    getNetworkSpec();
  }, [api]);

  type inputListener = (v: string) => void;
  const _onChangeValue = (k: keyof NetworkSpecsStruct): inputListener => (v: string): void => setNetworkSpecs({ [k]: v });
  const _onSetRandomColor = (): void => setNetworkSpecs({ color: getRandomColor() });
  const _checkPathIdValid = (): boolean => /^[\w-.]+$/.test(networkSpecs.pathId);
  const _checkColorValid = (): boolean => /^#[\da-fA-F]{6}|#[\da-fA-F]{3}$/.test(networkSpecs.color);

  return <Modal
    className={className}
    header={t('Export Network Specs')}
  >
    <Modal.Content>
      <Input
        className='full'
        help={t('Name of the network. It only for display purpose.')}
        label={t('Network Name')}
        onChange={_onChangeValue('title')}
        value={networkSpecs.title}
      />
      <Input
        autoFocus
        className='full'
        help={t('the path id used as the path prefix when deriving new account, all the accounts under this network will have the same prefix')}
        isError={!_checkPathIdValid()}
        label={t('Path ID')}
        onChange={_onChangeValue('pathId')}
        value={networkSpecs.pathId}
      />
      <Input
        className='full'
        help={t('The color used to distinguish this network with others, use color code with 3 or 6 digits, like "#FFF" or "#111111"')}
        isError={!_checkColorValid()}
        label={t('Color')}
        onChange={_onChangeValue('color')}
        value={networkSpecs.color}
      >
        <div className='settings--networkSpecs-colorButton'>
          <Button
            label={t('Generate Random Color')}
            icon='sync'
            key='spread'
            onClick={_onSetRandomColor}
          />
          <ColoredComponent color={networkSpecs.color}/>
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
        classNtame='full'
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
      <QrNetworkSpecs className='settings--networkSpecs-qr' networkSpecs={debouncedQrData}/>
    </Modal.Content>
    <Modal.Actions onCancel={onClose} withOr={false}>
    </Modal.Actions>
  </Modal>;
}

interface ColoredComponentProps extends BareProps {
  color: string;
}
const ColoredComponent = React.memo(styled(({ color, className }: ColoredComponentProps) => (<div color={color} className={className}/>))`
    background-color: ${(props: ColoredComponentProps): string => props.color};
    width: 100px;
    flex: 1;
    border-radius: 4px;
`);

export default React.memo(styled(NetworkSpecs)`
  position: absolute;
  top: .3rem;
  
  .settings--networkSpecs-colorButton {
    display: flex;
    flex-direction: row;
  }
  
  .settings--networkSpecs-qr {
    margin: 0 auto;
    max-width: 30rem;
  }
`);
