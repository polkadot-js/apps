// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, QueueTx } from './types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import withObservable from '@polkadot/rx-react/with/observable';

import Submission from './Submission';
import Signer from './Signer';
import translate from './translate';

type Props = BaseProps & {};

const queue: rxjs$BehaviorSubject<QueueTx> = new BehaviorSubject(({
  isValid: false,
  status: 'incomplete'
}: $Shape<QueueTx>));

const QueuedSigner = withObservable(queue)(Signer);

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['extrinsics--App', className].join(' ')}
      style={style}
    >
      <Submission subject={queue} />
      <QueuedSigner subject={queue} />
    </div>
  );
}

export default translate(App);
