// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import Icon from './Icon';

export type LinkTypes = 'address' | 'block' | 'extrinsic';

interface Props {
  className?: string;
  data: string;
  type: LinkTypes;
  withShort?: boolean;
}

const BASE = 'https://polkascan.io/pre/';

const CHAINS: Record<string, string> = {
  Alexander: 'alexander',
  Kulupu: 'kulupu',
  Kusama: 'kusama-cc1', // old name via W3F nodes
  'Kusama CC1': 'kusama-cc1',
  'Kusama CC2': 'kusama-cc2',
  'Kusama CC3': 'kusama-cc3'
};

const TYPES: Record<string, string> = {
  address: '/module/account/',
  block: '/system/block/',
  extrinsic: '/system/extrinsic/'
};

function LinkPolkascan ({ className, data, type, withShort }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const extChain = CHAINS[systemChain];
  const extType = TYPES[type];

  if (!extChain || !extType) {
    return null;
  }

  return (
    <div className={`${className} ${withShort ? 'withShort' : ''}`}>
      <a
        href={`${BASE}${extChain}${extType}${data}`}
        rel='noopener noreferrer'
        target='_blank'
      >
        {withShort
          ? <Icon name='external' />
          : t('View this {{type}} on Polkascan.io', { replace: { type } })
        }
      </a>
    </div>
  );
}

export default styled(LinkPolkascan)`
  margin-top: 1rem;
  text-align: right;
`;
