// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

import translate from './translate';
import Query from './Query';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value?: Array<StorageQuery>
};

function Queries ({ className, onRemove, style, value }: Props) {
  if (!value || !value.length) {
    return null;
  }

  return (
    <div
      className={classes('storage--Queries', className)}
      style={style}
    >
      {value.map((query) =>
        <Query
          key={query.id}
          onRemove={onRemove}
          value={query}
        />
      )}
    </div>
  );
}

export default translate(Queries);
