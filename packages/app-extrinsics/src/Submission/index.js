// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, QueueTx } from '../types';

import './Submission.css';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';

import Account from '../Account';
import Extrinsic from '../Extrinsic';
import translate from '../translate';
import Nonce from './Nonce';
import Submit from './Submit';
import createSubjects from './subjects';

type Props = BaseProps & {
  subject: rxjs$BehaviorSubject<QueueTx>
};

function Submission ({ className, subject, style, t }: Props): React$Node {
  const subjects = createSubjects();
  const Button = withObservable(subjects.call)(Submit);

  return (
    <div
      className={['extrinsics--Submission', className].join(' ')}
      style={style}
    >
      <Account
        label={t('display.sender', {
          defaultValue: 'using the selected account'
        })}
        subject={subjects.sender}
      />
      <Extrinsic
        label={t('display.method', {
          defaultValue: 'submit the following extrinsic'
        })}
        subject={subjects.method}
      />
      <Nonce
        label={t('display.nonce', {
          defaultValue: 'with an index'
        })}
        subject={subjects.index}
        value={subjects.sender}
      />
      <div className='extrinsics--Submission-ButtonRow'>
        <Button subject={subject} />
      </div>
    </div>
  );
}

export default translate(Submission);
