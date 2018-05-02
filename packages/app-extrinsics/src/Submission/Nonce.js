// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

type Props = BareProps & {
  label: string,
  subject: rxjs$BehaviorSubject<BN>,
  value: rxjs$BehaviorSubject<Uint8Array>
};

export default class Nonce extends React.PureComponent<Props> {
  Nonce: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    // NOTE we basically get away with not checking updates since the parent is only created once
    this.Nonce = withObservableParams(props.value)(RxNonce);
  }

  render (): React$Node {
    const { className, label, style, subject } = this.props;

    return (
      <div
        className={['ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <Label>{label}</Label>
          <this.Nonce
            className='ui disabled dropdown selection'
            classNameUpdated='hasUpdated'
            subject={subject}
          />
          <RxNonce
            params={new Uint8Array([209, 114, 167, 76, 218, 76, 134, 89, 18, 195, 43, 160, 168, 10, 87, 174, 105, 171, 174, 65, 14, 92, 203, 89, 222, 232, 78, 47, 68, 50, 219, 79])}
          />
        </div>
      </div>
    );
  }
}
