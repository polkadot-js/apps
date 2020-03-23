import React, {useEffect, useState} from 'react';
import {BareProps} from '@polkadot/react-components/types';
import {Button, Dropdown, Input, Modal} from '@polkadot/react-components';
import {useTranslation} from '../translate';
import styled from "styled-components";
import { useApi } from '@polkadot/react-hooks';
import ApiPromise from "@polkadot/api/promise";
import registry from "@polkadot/react-api/typeRegistry";
import { createType } from '@polkadot/types';
import addressDefaults from '@polkadot/util-crypto/address/defaults';

interface Props extends BareProps {
  onClose: () => void;
}

interface NetworkSpecs {
  color: string;
  decimals: number;
  genesisHash: string;
  // logo: number;
  pathId: string;
  prefix: number;
  title: string;
  unit: string;
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const buildNetworkSpecs = async (api: ApiPromise): Promise<NetworkSpecs> => {
  const [properties, systemChain, systemName, systemVersion, metadata, blockHash] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version(),
    api.runtimeMetadata.asLatest,
    api.rpc.chain.getBlockHash(0)
  ]);
  const DEFAULT_DECIMALS = createType(registry, 'u32', 12);
  const DEFAULT_SS58 = createType(registry, 'u32', addressDefaults.prefix);
  const title = systemChain.toString();
  const defaultPathId = title.replace(/\s/g, '_').toLowerCase();
  const networkSpecs = {
    decimals: properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS).toNumber(),
    prefix: properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber(),
    unit: properties.tokenSymbol.toString(),
    pathId: defaultPathId,
    title,
    color: getRandomColor(),
    genesisHash: blockHash.toString(),
    // metadata: metadata.toString(),
  };
  console.log('networkSpecs is', networkSpecs);
  return networkSpecs;
};

function NetworkSpecs ({ onClose }: Props): React.ReactNode<Props> {
  const {t} = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [pathId, setPathId] = useState<string>('');
  const [colorCode, setColorCode] = useState<string>('');
  const apiProps = useApi();
  if (!apiProps.isApiReady) return null;

  useEffect((): void => {
    const getNetworkSpec = async (): Promise<void> => {
      const networkSpecs = await buildNetworkSpecs(apiProps.api);
      setTitle(networkSpecs.title);
      setColorCode(networkSpecs.color);
      setPathId(networkSpecs.pathId);
    };
    getNetworkSpec();
  }, [apiProps]);

  const _onChangeTitle = (v: string): void => setTitle(v);
  const _onChangePathId = (v: string): void => setPathId(v);
  const _onChangeColorCode = (v: string): void => setColorCode(v);
  const _checkPathIdValid = (): boolean => /^[\w-.]+$/.test(pathId);
  const _checkColorCodeValid = (): boolean => /^#[\da-fA-F]{6}|#[\da-fA-F]{3}$/.test(colorCode);
  const _onSetRandomColor = (): void => setColorCode(getRandomColor());

  return <Modal
    className='settings--networkSpecs-modal'
    header={t('Export Network Specs')}
  >
    <Modal.Content>
      <Input
        autoFocus
        className='full'
        help={t('Name of the network. You can change it, it only for display purpose.')}
        label={t('name')}
        onChange={_onChangeTitle}
        placeholder={t('')}
        value={title}
      />
      <Input
        autoFocus
        className='full'
        help={t('the path id used as the path prefix when deriving new account, all the accounts under this network will have the same prefix')}
        isError={!_checkPathIdValid()}
        label={t('pathId')}
        onChange={_onChangePathId}
        placeholder={t('')}
        value={pathId}
      />
      <Input
        autoFocus
        className='full'
        help={t('the color used to distinguish this network with others, use color code with 3 or 6 digits, like "#FFF" or "#111111"')}
        isError={!_checkColorCodeValid()}
        label={t('color')}
        onChange={_onChangeColorCode}
        placeholder={t('#ffffff')}
        value={colorCode}
      >
        <div className='settings--networkSpecs-colorButton'>
          <Button
            label={t('Generate Random Color')}
            icon='add'
            key='spread'
            onClick={_onSetRandomColor}
          />
          <div className='settings--networkSpecs-colorDisplay' color={colorCode}/>
        </div>
      </Input>
    </Modal.Content>
    <Modal.Actions onCancel={onClose}>
      <Button
        icon='close'
        label={t('Cancel')}
        onClick={onClose}
      />
    </Modal.Actions>
  </Modal>;
}

export default React.memo(styled(NetworkSpecs)`
  position: relative;

  .settings--networkSpecs-modal {
    position: absolute;
    top: .5rem;
    right: 3.5rem;
  }
  
  .settings--networkSpecs-colorButton {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
    .settings--networkSpecs-colorDisplay {
      color: palevioletred;
      flex: 1;
    }
  }
`);
