// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputExtrinsic

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import './InputStorage.css';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import withObservable from '@polkadot/rx-react/with/observable';
import map from '@polkadot/storage-substrate/keys';

import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';

type Props = I18nProps & {
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject: rxjs$BehaviorSubject<StorageDef$Key>
};

class InputStorage extends React.PureComponent<Props> {
  sectionSubject: rxjs$Subject<string>;
  subscriptions: Array<rxjs$ISubscription>
  SelectKey: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.sectionSubject = new BehaviorSubject(props.subject.getValue().section);
    this.SelectKey = withObservable(props.subject)(SelectKey);
  }

  componentWillMount () {
    this.subscriptions = [
      this.sectionSubject.subscribe((section) => {
        const { subject } = this.props;
        const current = subject.getValue();

        if (current.section === section) {
          return;
        }

        const options = keyOptions(section);

        subject.next(
          // $FlowFixMe we have string to be generix, but...
          map[section].keys[options[0].value]
        );
      })
    ];
  }

  componentWillUnmount () {
    this.subscriptions.forEach((s) =>
      s.unsubscribe()
    );
  }

  render (): React$Node {
    const { className, labelMethod, labelSection, onChange, style, subject } = this.props;
    const SelectKey = this.SelectKey;

    return (
      <div
        className={['ui--InputStorage', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection}
            subject={this.sectionSubject}
          />
        </div>
        <div className='large'>
          <SelectKey
            label={labelMethod}
            onChange={onChange}
            subject={subject}
          />
        </div>
      </div>
    );
  }
}

export default translate(InputStorage);
