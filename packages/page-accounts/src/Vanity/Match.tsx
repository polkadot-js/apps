// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Button, IdentityIcon } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

interface Props {
  address: string;
  className?: string;
  count: number;
  offset: number;
  onCreateToggle: (seed: string) => void;
  onRemove: (address: string) => void;
  seed: Uint8Array;
}

function Match ({ address, className = '', count, offset, onCreateToggle, onRemove, seed }: Props): React.ReactElement<Props> {
  const hexSeed = useMemo(
    () => u8aToHex(seed),
    [seed]
  );
  const _onCreate = useCallback(
    (): void => onCreateToggle(hexSeed),
    [hexSeed, onCreateToggle]
  );
  const _onRemove = useCallback(
    (): void => onRemove(address),
    [address, onRemove]
  );

  return (
    <tr className={className}>
      <td
        className='number'
        colSpan={2}
      >
        <IdentityIcon
          className='vanity--Match-icon'
          value={address}
        />
      </td>
      <td className='address all'>
        <div className='vanity--Match-addr'>
          <span className='no'>{address.slice(0, offset)}</span><span className='yes'>{address.slice(offset, count + offset)}</span><span className='no'>{address.slice(count + offset)}</span>
        </div>
      </td>
      <td className='hash'>
        {hexSeed}
      </td>
      <td className='button'>
        <Button
          icon='plus'
          onClick={_onCreate}
        />
        <Button
          icon='times'
          onClick={_onRemove}
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Match)`
  text-align: center;

  &:hover {
    background: #f9f8f7;
  }

  .vanity--Match-addr {
    font-size: 1.25rem;

    .no {
      color: inherit;
    }

    .yes {
      color: red;
    }
  }

  .vanity--Match-buttons,
  .vanity--Match-data,
  .vanity--Match-icon {
    display: inline-block;
    vertical-align: middle;
  }

  .vanity--Match-item {
    display: inline-block;
    font-family: monospace;
    margin: 0 auto;
    padding: 0.5em;
    position: relative;
  }

  .vanity--Match-seed {
    opacity: 0.45;
    padding: 0 1rem;
  }
`);
