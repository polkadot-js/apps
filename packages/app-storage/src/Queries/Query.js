// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from '../types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Div from '@polkadot/rx-react/Div';
import withStorage from '@polkadot/rx-react/with/storage';

import translate from '../translate';
import Remove from './Remove';
import cache from './cache';
import createTransform from './transform';

type Props = I18nProps & {
  value: StorageQuery
};

function Query ({ className, style, value: { id, key, params } }: Props): React$Node {
  const CachedQuery = (() => {
    if (!cache[id]) {
      const transform = createTransform(key);

      cache[id] = withStorage(key, { params, transform })(
        Div, { className: 'ui disabled dropdown selection' }
      );
    }

    return cache[id];
  })();

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
        <Remove value={id} />
      </div>
    </div>
  );
}

export default translate(Query);
