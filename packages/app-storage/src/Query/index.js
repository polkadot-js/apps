// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from '../types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import typeToText from '@polkadot/ui-react-app/src/Params/typeToText';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';

import translate from '../translate';
import format from './format';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

const cache = [];

function Query ({ className, onRemove, style, value: { id, key, params } }: Props): React$Node {
  const CachedQuery = (() => {
    if (!cache[id]) {
      const values = params.map(({ value }) => value);

      cache[id] = withStorageDiv(key, { params: values })(
        (value) =>
          format(key.type, value),
        { className: 'ui disabled dropdown selection' }
      );
    }

    return cache[id];
  })();

  const _onRemove = (): void => {
    delete cache[id];

    onRemove(id);
  };

  const inputs = Object
    .keys(key.params || {})
    .map((name, index) => {
      // $FlowFixMe key.params exists
      const formatted = format(key.params[name].type, params[index].value, 12);

      return (
        <span>{name}={formatted}</span>
      );
    });

  return (
    <div
      className={['storage--Query', 'storage--actionrow', className].join(' ')}
      style={style}
    >
      <div className='storage--actionrow-value'>
        <Label>
          {key.section}.{key.name}({inputs}): {typeToText(key.type)}
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
