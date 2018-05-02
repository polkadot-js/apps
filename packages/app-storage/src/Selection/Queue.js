// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import { queries } from '../subjects';
import translate from '../translate';

type Props = I18nProps & {
  value: QueueTx;
};

let id = 0;

function Queue ({ className, subject, style, t, value }: Props): React$Node {
  const onQueue = (): void => {
    if (!value) {
      return;
    }

    id++;

    const prev = queries.getValue();
    const next = [{
      id,
      key: value
    }];

    queries.next(
      prev.reduce((next, item) => {
        next.push(item);

        return next;
      }, next)
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

export default translate(Queue);
