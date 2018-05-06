// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from '../types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import translate from '../translate';
import createCached from './cached';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

const cache = [];

function Query ({ className, onRemove, style, value: { id, key, params } }: Props): React$Node {
  const CachedQuery = (() => {
    if (!cache[id]) {
      cache[id] = createCached(key, params);
    }

    return cache[id];
  })();

  const _onRemove = (): void => {
    delete cache[id];

    onRemove(id);
  };

  const inputs = Object
    .keys(key.params || {})
    // $FlowFixMe key.params exists
    .map((name) => `${name}: ${key.params[name].type}`)
    .join(', ');

  return (
    <div
      className={['storage--Queries-Query', 'storage--actionrow', className].join(' ')}
      style={style}
    >
      <div className='storage--actionrow-value'>
        <Label>
          {key.section}_{key.name}({inputs}): {key.type}
        </Label>
        <CachedQuery />
      </div>
      <div className='storage--actionrow-button'>
        <Label>&nbsp;</Label>
        <Button
          icon='close'
          negative
          onClick={_onRemove}
        />
      </div>
    </div>
  );
}

export default translate(Query);
