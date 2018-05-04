// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import subjects from '../subjects';
import translate from '../translate';

type Props = I18nProps & {
  value: StorageDef$Key;
};

let id = 0;

function Add ({ className, style, value }: Props): React$Node {
  const onAdd = (): void => {
    if (!value) {
      return;
    }

    const current = subjects.queries.getValue();
    const next = [{
      id: ++id,
      key: value,
      params: subjects.params.getValue().map((s) => s.getValue())
    }];

    subjects.queries.next(
      current.reduce((next, item) => {
        next.push(item);

        return next;
      }, next)
    );
  };

  return (
    <Button
      disabled={!value}
      icon='plus'
      onClick={onAdd}
      primary
    />
  );
}

export default translate(
  withObservable(subjects.next)(Add)
);
