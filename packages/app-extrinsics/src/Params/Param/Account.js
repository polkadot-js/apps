// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import BaseAccount from '../../Account';

export default class Account extends React.PureComponent<Props> {
  account: rxjs$BehaviorSubject<Uint8Array>;

  constructor (props: Props) {
    super(props);

    this.account = new BehaviorSubject(new Uint8Array([]));
  }

  componentWillMount () {
    this.account.subscribe((value: Uint8Array) =>
      this.props.subject.next({
        isValid: !!(value && value.length),
        value
      })
    );
  }

  componentWillUnmount () {
    // FIXME: unsubscribe
  }

  render (): React$Node {
    const { isError, label } = this.props;

    return (
      <BaseAccount
        isError={isError}
        label={label}
        subject={this.account}
      />
    );
  }
}
