// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import { queries, subject, values } from '../subjects';
import translate from '../translate';

type Props = I18nProps & {
  value: StorageDef$Key;
};

let id = 0;

function Queue ({ className, style, t, value }: Props): React$Node {
  const onQueue = (): void => {
    if (!value) {
      return;
    }

    id++;

    queries.next(
      queries.getValue().reduce((next, item) => {
        next.push(item);

        return next;
      }, [{
        id,
        key: value,
        params: values.getValue().map((s) => s.getValue())
      }])
    );
  };

  return (
    <Button
      disabled={!value}
      onClick={onQueue}
      primary
    >
      {t('queue.label', {
        defaultValue: 'Query Storage'
      })}
    </Button>
  );
}

export default translate(
  withObservable(subject)(Queue)
);
