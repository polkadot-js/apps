// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Network } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { ChainImg } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Url from './Url';

interface Props {
  affinity?: string; // unused - previous selection
  apiUrl: string;
  className?: string;
  setApiUrl: (network: string, apiUrl: string) => void;
  value: Network;
}

function NetworkDisplay ({ apiUrl, className = '', setApiUrl, value: { icon, isChild, isRelay, isUnreachable, name, nameRelay: relay, paraId, providers } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isSelected = useMemo(
    () => providers.some(({ url }) => url === apiUrl),
    [apiUrl, providers]
  );

  const _selectUrl = useCallback(
    () => {
      const filteredProviders = providers.filter(({ url }) => !url.startsWith('light://'));

      return setApiUrl(name, filteredProviders[Math.floor(Math.random() * filteredProviders.length)].url);
    },
    [name, providers, setApiUrl]
  );

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl(name, apiUrl),
    [name, setApiUrl]
  );

  return (
    <div className={`${className}${isSelected ? ' isSelected highlight--border' : ''}${isUnreachable ? ' isUnreachable' : ''}`}>
      <div
        className={`endpointSection${isChild ? ' isChild' : ''}`}
        onClick={isUnreachable ? undefined : _selectUrl}
      >
        <ChainImg
          className='endpointIcon'
          isInline
          logo={icon === 'local' ? 'empty' : (icon || 'empty')}
          withoutHl
        />
        <div className='endpointValue'>
          <div>{name}</div>
          {isSelected && (isRelay || !!paraId) && (
            <div className='endpointExtra'>
              {isRelay
                ? t<string>('Relay chain')
                : paraId && paraId < 1000
                  ? t<string>('{{relay}} System', { replace: { relay } })
                  : paraId && paraId < 2000
                    ? t<string>('{{relay}} Common', { replace: { relay } })
                    : t<string>('{{relay}} Parachain', { replace: { relay } })
              }
            </div>
          )}
        </div>
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

export default React.memo(styled(NetworkDisplay)`
  border-left: 0.25rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0 0 0.25rem 0;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  position: relative;

  &.isUnreachable {
    opacity: 0.5;
  }

  &.isSelected,
  &:hover {
    background: var(--bg-table);
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

    .endpointValue {
      .endpointExtra {
        font-size: 0.75rem;
        opacity: 0.8;
      }
    }
  }
`);
