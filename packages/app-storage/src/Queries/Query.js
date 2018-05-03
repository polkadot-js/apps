// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from '../types';

import './Queries.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Div from '@polkadot/rx-react/Div';
import withStorage from '@polkadot/rx-react/with/storage';

import transform from './transform';

type Props = I18nProps & {
  value: StorageQuery
};

const Cache = [];

export default function Query ({ className, style, value: { id, key, params } }: Props): React$Node {
  const Value = (() => {
    if (!Cache[id]) {
      Cache[id] = withStorage(key, { params, transform })(({ hasUpdated, value }) => (
        <Div
          className='ui disabled dropdown selection'
          classNameUpdated='hasUpdated'
          hasUpdated={hasUpdated}
          value={value}
        />
      ));
    }

    return Cache[id];
  })();

  return (
    <div
      className={['storage--Queries-Query', className].join(' ')}
      style={style}
    >
      <Label>
        {JSON.stringify(key)}
      </Label>
      <Value />
    </div>
  );
}
