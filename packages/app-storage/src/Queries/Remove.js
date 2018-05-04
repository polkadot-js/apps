// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import subjects from '../subjects';
import translate from '../translate';
import cache from './cache';

type Props = I18nProps & {
  value: number;
};

function Remove ({ className, style, value }: Props): React$Node {
  const onRemove = (): void => {
    const current = subjects.queries.getValue();

    delete cache[value];

    subjects.queries.next(
      current
        .filter(({ id }) => id !== value)
        .reduce((next, item) => {
          next.push(item);

          return next;
        }, [])
    );
  };

  return (
    <Button
      disabled={!value}
      icon='close'
      negative
      onClick={onRemove}
    />
  );
}

export default translate(Remove);
