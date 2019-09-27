// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React, { useContext } from 'react';
import styled from 'styled-components';
import { ApiContext } from '@polkadot/react-api';

import translate from './translate';

export type LinkTypes = 'address' | 'block' | 'extrinsic';

interface Props extends I18nProps {
  className?: string;
  data: string;
  type: LinkTypes;
}

const BASE = 'https://polkascan.io/pre/';

const CHAINS: Record<string, string> = {
  Alexander: 'alexander',
  Kusama: 'kusama-cc1', // old name via W3F nodes
  'Kusama CC1': 'kusama-cc1',
  'Kusama CC2': 'kusama-cc2'
};

const TYPES: Record<string, string> = {
  address: '/module/account/',
  block: '/system/block/',
  extrinsic: '/system/extrinsic/'
};

function LinkPolkascan ({ className, data, t, type }: Props): React.ReactElement<Props> | null {
  const { systemChain } = useContext(ApiContext);
  const extChain = CHAINS[systemChain];
  const extType = TYPES[type];

  if (!extChain || !extType) {
    return null;
  }

  return (
    <div className={className}>
      <a
        href={`${BASE}${extChain}${extType}${data}`}
        rel='noopener noreferrer'
        target='_blank'
      >
        {t('View this {{type}} on Polkascan.io', { replace: { type } })}
      </a>
    </div>
  );
}

export default translate(
  styled(LinkPolkascan)`
    margin-top: 1rem;
    text-align: right;
  `
);
