// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from './types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import withObservable from '@polkadot/rx-react/with/observable';

import Signer from './Signer';
import Submission from './Submission';
import Status from './Status';
import translate from './translate';

type Props = I18nProps & {};

const CLOSE_STATUS = ['cancelled', 'error', 'sent'];

const queue: rxjs$BehaviorSubject<QueueTx> = new BehaviorSubject(({
  isValid: false,
  status: 'incomplete'
}: $Shape<QueueTx>));

const QueuedSigner = withObservable(queue)(Signer);
const QueuedStatus = withObservable(queue)(Status);

queue.subscribe(({ status }) => {
  if (CLOSE_STATUS.includes(status)) {
    setTimeout(() => {
      const tx = queue.getValue();

      if (CLOSE_STATUS.includes(tx.status)) {
        queue.next({
          ...tx,
          status: 'incomplete'
        });
      }
    }, 5000);
  }
});

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['extrinsics--App', className].join(' ')}
      style={style}
    >
      <Submission subject={queue} />
      <QueuedSigner subject={queue} />
      <QueuedStatus />
    </div>
  );
}

export default translate(App);
