// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../types';

import React from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';
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
        <td className='address relative all'>
          <AddressSmall value={validator.stashId} />
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleExpanded}
        />
      </tr>
      <tr className={`${className} isExpanded ${isExpanded ? '' : 'isLast'} packedTop`}>
        <td />
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
