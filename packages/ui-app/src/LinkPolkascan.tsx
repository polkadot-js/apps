// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from './types';

import React from 'react';
import styled from 'styled-components';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from './translate';

export type LinkTypes = 'address' | 'block' | 'extrinsic';

type Props = ApiProps & I18nProps & {
  className?: string;
  data: string;
  type: LinkTypes;
};

const BASE = 'https://polkascan.io/pre/';

const CHAINS: Record<string, string> = {
  Alexander: 'alexander'
};

const TYPES: Record<string, string> = {
  address: '/module/account/',
  block: '/system/block/',
  extrinsic: '/system/extrinsic/'
};

class LinkPolkascan extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, currentChain, data, t, type } = this.props;
    const extChain = CHAINS[currentChain];
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
}

export default withMulti(
  styled(LinkPolkascan)`
    margin-top: 1rem;
    text-align: right;
  `,
  translate,
  withApi
);
