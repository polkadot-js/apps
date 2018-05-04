// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { StorageQuery } from '../types';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';

import subjects from '../subjects';
import translate from '../translate';
import Query from './Query';

type Props = I18nProps & {
  value?: Array<StorageQuery>
};

function Queries ({ className, style, value }: Props): React$Node {
  if (!value || !value.length) {
    return null;
  }

  return (
    <div
      className={['storage--Queries', className].join(' ')}
      style={style}
    >
      {value.map((query) => (
        <Query
          key={query.id}
          value={query}
        />
      ))}
    </div>
  );
}

export default translate(
  withObservable(subjects.queries)(Queries)
);
