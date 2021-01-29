// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '@polkadot/react-components/types';
import type { Network } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { ChainImg } from '@polkadot/react-components';

import Url from './Url';

interface Props {
  affinity?: string;
  apiUrl: string;
  className?: string;
  setApiUrl: (network: string, apiUrl: string) => void;
  value: Network;
}

function NetworkDisplay ({ affinity, apiUrl, className = '', setApiUrl, value: { icon, isChild, name, providers } }: Props): React.ReactElement<Props> {
  const isSelected = useMemo(
    () => providers.some(({ url }) => url === apiUrl),
    [apiUrl, providers]
  );

  const _selectUrl = useCallback(
    () => setApiUrl(
      name,
      affinity && providers.find(({ url }) => url === affinity)
        ? affinity
        : providers[0].url
    ),
    [affinity, name, providers, setApiUrl]
  );

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl(name, apiUrl),
    [name, setApiUrl]
  );

  return (
    <div className={`${className}${isSelected ? ' isSelected highlight--border' : ''}`}>
      <div
        className={`endpointSection${isChild ? ' isChild' : ''}`}
        onClick={_selectUrl}
      >
        <ChainImg
          className='endpointIcon'
          isInline
          logo={icon === 'local' ? 'empty' : (icon || 'empty')}
          withoutHl
        />
        <div className='endpointValue'>{name}</div>
      </div>
      {isSelected && providers.map(({ name, url }): React.ReactNode => (
        <Url
          apiUrl={apiUrl}
          key={url}
          label={name}
          setApiUrl={_setApiUrl}
          url={url}
        />
      ))}
    </div>
  );
}

export default React.memo(styled(NetworkDisplay)(({ theme }: ThemeProps) => `
  border-left: 0.25rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0 0 0.25rem 0;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  position: relative;

  &.isSelected,
  &:hover {
    background: ${theme.bgTable};
  }

  .endpointSection {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;

    &.isChild .endpointIcon {
      margin-left: 1.25rem;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }
  }
`));
