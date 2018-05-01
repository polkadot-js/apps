// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import translate from '../translate';

type Props = I18nProps & {
  subject: rxjs$BehaviorSubject<QueueTx>,
  value: QueueTx;
};

function Submit ({ className, subject, style, t, value }: Props): React$Node {
  const onSubmit = (): void => {
    subject.next({
      ...value,
      status: 'queued'
    });
  };

  return (
    <Button
      disabled={!value.isValid}
      onClick={onSubmit}
      primary
    >
      {t('submit.label', {
        defaultValue: 'Submit Extrinsic'
      })}
    </Button>
  );
}

export default translate(Submit);
