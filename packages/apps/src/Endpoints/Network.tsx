// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '@polkadot/react-components/types';
import { Network } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { ChainImg } from '@polkadot/react-components';

import Url from './Url';

interface Props {
  apiUrl: string;
  className?: string;
  setApiUrl: (apiUrl: string) => void;
  value: Network;
}

function NetworkDisplay ({ apiUrl, className = '', setApiUrl, value: { icon, isChild, name, providers } }: Props): React.ReactElement<Props> {
  const isSelected = useMemo(
    () => providers.some(({ url }) => url === apiUrl),
    [apiUrl, providers]
  );

  const _selectFirst = useCallback(
    () => setApiUrl(providers[0].url),
    [providers, setApiUrl]
  );

  return (
    <div className={`${className}${isSelected ? ' isSelected highlight--border' : ''}`}>
      <div
        className={`endpointSection${isChild ? ' isChild' : ''}`}
        onClick={_selectFirst}
      >
        <ChainImg
          className='endpointIcon'
          logo={icon === 'local' ? 'empty' : icon}
        />
        <div className='endpointValue'>{name}</div>
      </div>
      {isSelected && providers.map(({ name, url }): React.ReactNode => (
        <Url
          apiUrl={apiUrl}
          key={url}
          label={name}
          setApiUrl={setApiUrl}
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

  .endpointIcon {
    height: 24px;
    margin-right: 0.75rem;
    width: 24px;
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
