// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';
import Icon from './Icon';
import Tooltip from './Tooltip';

export type LinkTypes = 'address' | 'block' | 'council' | 'extrinsic' | 'proposal' | 'referendum' | 'treasury';

interface Props {
  className?: string;
  data: BN | number | string;
  type: LinkTypes;
  withShort?: boolean;
}

interface Explorer {
  isActive: boolean;
  chains: Record<string, string>;
  paths: Partial<Record<LinkTypes, string>>;
  create: (chain: string, path: string, data: BN | number | string) => string;
}

const EXPLORERS: Record<string, Explorer> = {
  Commonwealth: {
    isActive: true,
    chains: {
      Edgeware: 'edgeware',
      Kusama: 'kusama',
      'Kusama CC3': 'kusama'
    },
    paths: {
      council: 'proposal/councilmotion',
      proposal: 'proposal/democracyproposal',
      referendum: 'proposal/referendum',
      treasury: 'proposal/treasuryproposal'
    },
    create: (chain: string, path: string, data: BN | number | string): string =>
      `https://commonwealth.im/${chain}/${path}/${data.toString()}`
  },
  Polkascan: {
    isActive: true,
    chains: {
      Edgeware: 'edgeware',
      Kulupu: 'kulupu',
      Kusama: 'kusama',
      'Kusama CC3': 'kusama',
      Westend: 'westend'
    },
    paths: {
      address: 'module/account',
      block: 'system/block',
      council: 'council/motion',
      extrinsic: 'system/extrinsic',
      proposal: 'democracy/proposal',
      referendum: 'democracy/referendum',
      treasury: 'treasury/proposal'
    },
    create: (chain: string, path: string, data: BN | number | string): string =>
      `https://polkascan.io/pre/${chain}/${path}/${data.toString()}`
  },
  Subscan: {
    isActive: false,
    chains: {
      Kusama: 'kusama',
      'Kusama CC3': 'kusama'
    },
    paths: {
      address: 'account',
      block: 'block',
      extrinsic: 'extrinsic'
    },
    create: (chain: string, path: string, data: BN | number | string): string =>
      `https://${chain}.subscan.io/${path}/${data.toString()}`
  }
};

function genLinks (systemChain: string, { data, type, withShort }: Props): React.ReactNode[] {
  return Object
    .entries(EXPLORERS)
    .map(([name, { isActive, chains, paths, create }]): React.ReactNode | null => {
      const extChain = chains[systemChain];
      const extPath = paths[type];

      if (!isActive || !extChain || !extPath) {
        return null;
      }

      const trigger = `${name}-${type}-${data}`;
      const link = create(extChain, extPath, data);

      return (
        <a
          data-for={trigger}
          data-tip={true}
          href={link}
          key={name}
          rel='noopener noreferrer'
          target='_blank'
        >
          {withShort
            ? <Icon name='external' />
            : name
          }
          <Tooltip
            place='top'
            text={name}
            trigger={trigger}
          />
        </a>
      );
    })
    .filter((node): node is React.ReactNode => !!node);
}

function LinkExternal ({ className, data, type, withShort }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const links = useMemo((): React.ReactNode[] => {
    return genLinks(systemChain, { data, type, withShort });
  }, [systemChain, data, type, withShort]);

  if (!links.length) {
    return null;
  }

  return (
    <div className={`${className} ${withShort ? 'withShort' : ''}`}>
      {!withShort && <div>{t('View this externally')}</div>}<div>{links.map((link, index) => <span key={index}>{link}</span>)}</div>
    </div>
  );
}

export default styled(LinkExternal)`
  margin-top: 0.75rem;
  text-align: right;

  > div {
    display: block;
    whitespace: nowrap;

    > span+span {
      margin-left: 0.3rem;
    }
  }
`;
