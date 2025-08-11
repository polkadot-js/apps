// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IFavoriteChainProps, Network } from './types.js';

import React, { useCallback, useMemo } from 'react';

import { ChainImg, Dropdown, Icon, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  affinity?: string; // unused - previous selection
  apiUrl: string;
  className?: string;
  setApiUrl: (network: string, apiUrl: string) => void;
  value: Network;
  isFavorite: boolean;
  toggleFavoriteChain: (chainInfo: IFavoriteChainProps) => void;
}

function NetworkDisplay ({ apiUrl, className = '', isFavorite, setApiUrl, toggleFavoriteChain, value: { isChild, isRelay, isUnreachable, name, nameRelay: relay, paraId, providers, ui } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isSelected = useMemo(
    () => providers.some(({ url }) => url === apiUrl),
    [apiUrl, providers]
  );

  const providersOptions = useMemo(() => {
    return providers.map(({ name, url }) => ({
      text: name,
      value: url
    }));
  }, [providers]);

  const _selectUrl = useCallback(
    () => {
      const filteredProviders = providers.filter(({ url }) => !url.startsWith('light://'));

      if (filteredProviders.length === 0) {
        alert('No WebSocket (wss://) provider available');

        return;
      }

      return setApiUrl(name, filteredProviders[Math.floor(Math.random() * filteredProviders.length)].url);
    },
    [name, providers, setApiUrl]
  );

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl(name, apiUrl),
    [name, setApiUrl]
  );

  const _toggleFavoriteChain = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteChain({ chainName: name, paraId, relay });
  }, [name, paraId, relay, toggleFavoriteChain]);

  return (
    <StyledDiv className={`${className}${isSelected ? ' isSelected highlight--border' : ''}${isUnreachable ? ' isUnreachable' : ''}`}>
      <div
        className={`markFavoriteSection${isChild ? ' isChild' : ''}`}
        onClick={isUnreachable ? undefined : _selectUrl}
      >
        <div className='endpointSection'>
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
        <Icon
          className={isFavorite ? 'isFavorite' : ''}
          icon='star'
          onClick={_toggleFavoriteChain}
        />
      </div>
      {isSelected &&
        <Dropdown
          className='isSmall'
          onChange={_setApiUrl}
          options={providersOptions}
          value={apiUrl}
          withLabel={false}
        />
      }
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

  &.isSelected {
    .markFavoriteSection {
      gap: 1rem;
      padding-bottom: 1rem;
    }
  }

  .markFavoriteSection {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &:hover .ui--Icon {
      opacity: 0.5;
    }

    .ui--Icon {
      scale: 1.1;
      opacity: 0;
      transition: color 0.2s ease;

      &:hover {
        opacity: 0.5;
        stroke: darkorange;
        color: darkorange;
      }

      &.isFavorite {
        opacity: 1;
        stroke: darkorange;
        color: darkorange;
      }
    }
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
