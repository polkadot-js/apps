// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './Queries.css';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';

import { queries } from '../subjects';
import translate from '../translate';
import Query from './Query';

type Props = I18nProps & {};

function Queries ({ className, subject, style, value }: Props): React$Node {
  if (!value || !value.length) {
    return null;
  }

  return value.map((query) => {
    const { id } = query;

    return (
      <Query
        key={id}
        query={query}
      />
    );
  });
}

export default translate(
  withObservable(queries)(Queries)
);
