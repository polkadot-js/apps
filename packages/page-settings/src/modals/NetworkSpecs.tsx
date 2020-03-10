import React from 'react';
import {BareProps} from '@polkadot/react-components/types';
import {Button, Modal} from '@polkadot/react-components';
import {useTranslation} from '../translate';
import styled from "styled-components";
import { useApi } from '@polkadot/react-hooks';
import ApiPromise from "@polkadot/api/promise";
import registry from "@polkadot/react-api/typeRegistry";
import { createType } from '@polkadot/types';
import addressDefaults from '@polkadot/util-crypto/address/defaults';
import uiSettings from "@polkadot/ui-settings";

interface Props extends BareProps {
  onClose: () => void;
}

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const buildNetworkSpecs = async (api: ApiPromise): Promise<any> => {
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

function NetworkSpecs ({ onClose }: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const apiProps = useApi();
  if (!apiProps.isApiReady) return null;
  const networkSpecs = buildNetworkSpecs(apiProps.api);
  return <Modal
    className='settings--networkSpecs-modal'
    header={t('Export Network Specs')}
  >
    <Modal.Content>

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

export default styled(NetworkSpecs)`
  position: relative;

  .settings--networkSpecs-modal {
    position: absolute;
    top: .5rem;
    right: 3.5rem;
  }
`;
