// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from '../types';
import type { Subjects } from './types';

import './Selection.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import map from '@polkadot/extrinsics-substrate';

import Account from '../Account';
import Extrinsic from '../Extrinsic';
import translate from '../translate';
import Nonce from './Nonce';
import createSubjects from './subjects';

type Props = I18nProps & {
  onQueue: (value: QueueTx) => void
};

type State = {
  value: $Shape<QueueTx>
};

const defaultExtrinsic = map.staking.methods.public.transfer;

let id = 0;

class Selection extends React.PureComponent<Props, State> {
  state: State;
  Submit: React$ComponentType<*>;
  subjects: Subjects;

  constructor (props: Props) {
    super(props);

    this.subjects = createSubjects();

    this.state = {
      value: {
        extrinsic: defaultExtrinsic,
        isValid: false
      }
    };
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

  onQueue = (): void => {
    const { onQueue } = this.props;
    const { value } = this.state;

    onQueue({
      ...value,
      id: ++id
    });
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { value } = this.state;
    const { subjects } = this;

    return (
      <div
        className={['extrinsics--Selection', className].join(' ')}
        style={style}
      >
        <Account
          label={t('display.sender', {
            defaultValue: 'using the selected account'
          })}
          onChange={subjects.sender}
        />
        <Extrinsic
          defaultValue={defaultExtrinsic}
          labelMethod={t('display.method', {
            defaultValue: 'submit the following extrinsic'
          })}
          onChange={subjects.method}
        />
        <Nonce
          label={t('display.nonce', {
            defaultValue: 'with an index'
          })}
          onChange={subjects.index}
          value={subjects.sender}
        />
        <div className='extrinsics--Selection-ButtonRow'>
          <Button
            disabled={!value.isValid}
            onClick={this.onQueue}
            primary
          >
            {t('submit.label', {
              defaultValue: 'Submit Extrinsic'
            })}
          </Button>
        </div>
      </div>
    );
  }
}

export default translate(Selection);
