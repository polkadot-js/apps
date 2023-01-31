// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../types';

import React from 'react';

import { AddressSmall, Badge, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  className?: string;
  toggleFavorite: (stashId: string) => void;
  validator: Validator;
}

interface PropsExpanded {
  className?: string;
  validator: Validator;
}

function ValidatorExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return (
    <tr className={`${className} isExpanded isLast`}>
      <td />
      <td />
      <td />
      <td />
    </tr>
  );
}

function Validator ({ className = '', toggleFavorite, validator }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle();

  return (
    <>
      <tr className={`${className} isExpanded isFirst packedBottom`}>
        <Table.Column.Favorite
          address={validator.stashId}
          isFavorite={validator.isFavorite}
          toggle={toggleFavorite}
        />
        <td className='badge'>
          {validator.isElected
            ? (
              <Badge
                color='blue'
                icon='chevron-right'
              />
            )
            : (
              <Badge
                className='opaque'
                color='gray'
              />
            )
          }
        </td>
        <td className='address relative all'>
          <AddressSmall value={validator.stashId} />
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleExpanded}
        />
      </tr>
      <tr className={`${className} isExpanded ${isExpanded ? '' : 'isLast'} packedTop`}>
        <td colSpan={2} />
        <td />
        <td />
      </tr>
      {isExpanded && (
        <ValidatorExpanded validator={validator} />
      )}
    </>
  );
}

export default React.memo(Validator);
