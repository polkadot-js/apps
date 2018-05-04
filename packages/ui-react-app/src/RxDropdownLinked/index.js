// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Section$Item } from '@polkadot/primitives/section';
import type { BareProps } from '../types';

import './RxDropdownLinked.css';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import withObservable from '@polkadot/rx-react/with/observable';

import SelectItem from './SelectItem';
import SelectSection from './SelectSection';

type Props = BareProps & {
  createItems: (section: string) => Array<*>,
  createSections: () => Array<*>,
  isError?: boolean,
  labelItem?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: Section$Item) => void,
  subject: rxjs$BehaviorSubject<string>
};

export default class RxDropdownLinked extends React.PureComponent<Props> {
  sectionSubject: rxjs$Subject<string>;
  subscriptions: Array<rxjs$ISubscription>
  SelectKey: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.sectionSubject = new BehaviorSubject(props.subject.getValue().section);
    this.SelectItem = withObservable(props.subject)(SelectItem);
  }

  componentWillMount () {
    this.subscriptions = [
      this.sectionSubject.subscribe((section) => {
        const { createItems, subject } = this.props;
        const current = subject.getValue();

        if (current.section === section) {
          return;
        }

        const [{ expanded }] = createItems(section);

        subject.next(expanded);
      })
    ];
  }

  componentWillUnmount () {
    this.subscriptions.forEach((s) =>
      s.unsubscribe()
    );
  }

  render (): React$Node {
    const { className, createItems, createSections, labelItem, labelSection, onChange, style, subject } = this.props;
    const SelectItem = this.SelectItem;

    return (
      <div
        className={['ui--RxDropdownLinked', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            createOptions={createSections}
            label={labelSection}
            subject={this.sectionSubject}
          />
        </div>
        <div className='large'>
          <SelectItem
            createOptions={createItems}
            label={labelItem}
            onChange={onChange}
            subject={subject}
          />
        </div>
      </div>
    );
  }
}
