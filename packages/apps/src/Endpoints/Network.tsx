// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnedId } from '@polkadot/app-parachains/types';
import type { Network } from './types';

import React, { useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import useAllIds from '@polkadot/app-parachains/useAllIds';
import { ChainImg } from '@polkadot/react-components';
import { useRelayApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Url from './Url';

interface Props {
  affinity?: string;
  apiUrl: string;
  className?: string;
  relayParas?: OwnedId[];
  setApiUrl: (network: string, apiUrl: string) => void;
  setLinked: (genesisHash: string, paraIds: OwnedId[]) => void;
  value: Network;
}

function NetworkDisplay ({ affinity, apiUrl, className = '', relayParas, setApiUrl, setLinked, value: { genesisHash, icon, isChild, isRelay, name, paraId, providers } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api: relayApi } = useRelayApi(!!isRelay, apiUrl, genesisHash);
  const paraIds = useAllIds(!!relayApi, relayApi);

  useEffect((): void => {
    genesisHash && paraIds.length && setLinked(genesisHash, paraIds);
  }, [genesisHash, paraIds, setLinked]);

  const paraInfo = useMemo(
    () => relayParas
      ? relayParas.find((p) => p.paraId.eq(paraId))
      : null,
    [paraId, relayParas]
  );

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
        {paraInfo && (
          <div className='endpointExtra'>{
            // paraInfo.paraId.ltn(1000)
            //   ? t('system')
            //   : paraInfo.paraId.ltn(2000)
            //     ? t('common')
            paraInfo.isChain
              ? t('chain')
              : paraInfo.isThread
                ? t('thread')
                : ''
          }</div>
        )}
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

    .endpointExtra {
      font-size: 0.75em;
      justify-self: flex-end;
      opacity: 0.65;
      text-align: right;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }

    .endpointValue {
      flex: 1 1;
    }
  }
`);
