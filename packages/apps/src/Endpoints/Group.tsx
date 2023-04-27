// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types.js';

import React, { useCallback, useMemo } from 'react';

import { Icon, styled } from '@polkadot/react-components';

import Network from './Network.js';

interface Props {
  affinities: Record<string, string>;
  apiUrl: string;
  children?: React.ReactNode;
  className?: string;
  index: number;
  isSelected: boolean;
  setApiUrl: (network: string, apiUrl: string) => void;
  setGroup: (groupIndex: number) => void;
  value: Group;
}

function GroupDisplay ({ affinities, apiUrl, children, className = '', index, isSelected, setApiUrl, setGroup, value: { header, isSpaced, networks } }: Props): React.ReactElement<Props> {
  const _setGroup = useCallback(
    () => setGroup(isSelected ? -1 : index),
    [index, isSelected, setGroup]
  );

  const filtered = useMemo(
    () => networks.filter(({ isUnreachable }) => !isUnreachable),
    [networks]
  );

  return (
    <StyledDiv className={`${className}${isSelected ? ' isSelected' : ''}`}>
      <div
        className={`groupHeader${isSpaced ? ' isSpaced' : ''}`}
        onClick={_setGroup}
      >
        <Icon icon={isSelected ? 'caret-up' : 'caret-down'} />
        {header}
      </div>
      {isSelected && (
        <>
          <div className='groupNetworks'>
            {filtered.map((network, index): React.ReactNode => (
              <Network
                affinity={affinities[network.name]}
                apiUrl={apiUrl}
                key={index}
                setApiUrl={setApiUrl}
                value={network}
              />
            ))}
          </div>
          {children}
        </>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .groupHeader {
    border-radius: 0.25rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.75rem 1rem;
    position: relative;
    text-transform: uppercase;

    &:hover {
      background: var(--bg-table);
    }

    &.isSpaced {
      margin-top: 0.75rem;
    }

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .groupNetworks {
    padding: 0.25rem 0 0.5rem 1rem;
  }
`;

export default React.memo(GroupDisplay);
