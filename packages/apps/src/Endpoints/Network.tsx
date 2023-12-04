// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Network } from './types.js';

import React, { useCallback, useMemo } from 'react';

import { ChainImg, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Url from './Url.js';

interface Props {
  affinity?: string; // unused - previous selection
  apiUrl: string;
  className?: string;
  setApiUrl: (network: string, apiUrl: string) => void;
  value: Network;
}

function NetworkDisplay ({ apiUrl, className = '', setApiUrl, value: { isChild, isRelay, isUnreachable, name, nameRelay: relay, paraId, providers, ui } }: Props): React.ReactElement<Props> {
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
    <StyledDiv className={`${className}${isSelected ? ' isSelected highlight--border' : ''}${isUnreachable ? ' isUnreachable' : ''}`}>
      <div
        className={`endpointSection${isChild ? ' isChild' : ''}`}
        onClick={isUnreachable ? undefined : _selectUrl}
      >
        <ChainImg
          className='endpointIcon'
          isInline
          logo={ui.logo || 'empty'}
          withoutHl
        />
        <div className='endpointValue'>
          <div>{name}</div>
          {isSelected && (isRelay || !!paraId) && (
            <div className='endpointExtra'>
              {isRelay
                ? t('Relay chain')
                : paraId && paraId < 1000
                  ? t('{{relay}} System', { replace: { relay } })
                  : paraId && paraId < 2000
                    ? t('{{relay}} Common', { replace: { relay } })
                    : t('{{relay}} Parachain', { replace: { relay } })
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  border-left: 0.25rem solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  margin: 0 0 0.25rem 0;
  padding: 0.375rem 0.5rem 0.375rem 1rem;
  position: relative;

  &.isUnreachable {
    opacity: var(--opacity-light);
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

    &+.ui--Toggle {
      margin-top: 1rem;
    }

    &.isChild .endpointIcon {
      margin-left: 1.25rem;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }

    .endpointValue {
      .endpointExtra {
        font-size: var(--font-size-small);
        opacity: var(--opacity-light);
      }
    }
  }

  // we jiggle our labels somewhat...
  label {
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-normal);
    text-transform: none;
  }
`;

export default React.memo(NetworkDisplay);
