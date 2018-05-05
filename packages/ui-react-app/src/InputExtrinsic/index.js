// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputExtrinsic

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

import './InputExtrinsic.css';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import map from '@polkadot/extrinsics-substrate';
import withObservable from '@polkadot/rx-react/with/observable';

import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';

type Props = I18nProps & {
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject: rxjs$BehaviorSubject<Extrinsic>
};

class InputExtrinsic extends React.PureComponent<Props> {
  sectionSubject: rxjs$Subject<string>;
  SelectMethod: React$ComponentType<*>;
  subscriptions: Array<rxjs$ISubscription>

  constructor (props: Props) {
    super(props);

    this.sectionSubject = new BehaviorSubject(props.subject.getValue().section);
    this.SelectMethod = withObservable(props.subject)(SelectMethod);
  }

  componentWillMount () {
    this.subscriptions = [
      this.sectionSubject.subscribe((section) => {
        const { isPrivate = false, subject } = this.props;
        const current = subject.getValue();

        if (current.section === section) {
          return;
        }

        const type = isPrivate ? 'private' : 'public';
        const options = methodOptions(section, type);

        subject.next(
          // $FlowFixMe we have string to be generix, but...
          map[section].methods[type][options[0].value]
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
    const { className, isPrivate = false, labelMethod, labelSection, onChange, style, subject } = this.props;
    const type = isPrivate ? 'private' : 'public';
    const SelectMethod = this.SelectMethod;

    return (
      <div
        className={['ui--InputExtrinsic', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection}
            subject={this.sectionSubject}
            type={type}
          />
        </div>
        <div className='large'>
          <SelectMethod
            label={labelMethod}
            onChange={onChange}
            subject={subject}
            type={type}
          />
        </div>
      </div>
    );
  }
}

export default translate(InputExtrinsic);
