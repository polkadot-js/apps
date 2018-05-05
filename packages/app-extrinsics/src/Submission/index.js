// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';
import type { Subjects } from './types';

import './Submission.css';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';

import Account from '../Account';
import Extrinsic from '../Extrinsic';
import translate from '../translate';
import Nonce from './Nonce';
import Submit from './Submit';
import createSubjects from './subjects';

type Props = I18nProps & {
  subject: rxjs$BehaviorSubject<QueueTx>
};

class Submission extends React.PureComponent<Props> {
  Submit: React$ComponentType<*>;
  subjects: Subjects;

  constructor (props: Props) {
    super(props);

    this.subjects = createSubjects();
    this.Submit = withObservable(this.subjects.call)(Submit);
  }

  componentWillMount () {
    this.subjects.index.subscribe(this.onChange);
    this.subjects.method.subscribe(this.onChange);
    this.subjects.sender.subscribe(this.onChange);
  }

  onChange = (): void => {
    const index = this.subjects.index.getValue();
    const message = this.subjects.method.getValue();
    const publicKey = this.subjects.sender.getValue();
    const isValid = !!(publicKey && publicKey.length && message && message.isValid);

    this.subjects.call.next({
      data: message.data,
      extrinsic: message.extrinsic,
      isValid,
      index,
      publicKey,
      status: 'incomplete'
    });
  };

  render (): React$Node {
    const { className, subject, style, t } = this.props;
    const { Submit, subjects } = this;

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
          labelMethod={t('display.method', {
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
          <Submit subject={subject} />
        </div>
      </div>
    );
  }
}

export default translate(Submission);
