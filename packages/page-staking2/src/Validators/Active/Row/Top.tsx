// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../../types.js';
import type { UseHeartbeat } from '../../types.js';

import React from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';

import Status from '../Status.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  heartbeat?: UseHeartbeat;
  isExpanded: boolean;
  toggleExpanded: () => void;
  toggleFavorite: (stashId: string) => void;
  validator: Validator;
}

function Top ({ children, className = '', heartbeat, isExpanded, toggleExpanded, toggleFavorite, validator }: Props): React.ReactElement<Props> {
  return (
    <tr className={`${className} isExpanded isFirst packedBottom`}>
      <Table.Column.Favorite
        address={validator.stashId}
        isFavorite={validator.isFavorite}
        toggle={toggleFavorite}
      />
      <td
        className='statusInfo'
        rowSpan={2}
      >
        <Status
          heartbeat={heartbeat}
          validator={validator}
        />
      </td>
      <td className='address relative all'>
        <AddressSmall value={validator.stashId} />
        {children}
      </td>
      <Table.Column.Expand
        isExpanded={isExpanded}
        toggle={toggleExpanded}
      />
    </tr>
  );
}

export default React.memo(Top);
