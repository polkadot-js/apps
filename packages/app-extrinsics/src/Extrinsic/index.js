// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { EncodedParams } from '../types';
import type { Subjects } from './types';

import React from 'react';
import withObservable from '@polkadot/rx-react/with/observable';
import InputExtrinsic from '@polkadot/ui-react-app/src/InputExtrinsic';

import Params from '../Params';
import createSubjects from './subjects';

type Props = BareProps & {
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  subject: rxjs$BehaviorSubject<EncodedParams>
};

export default class Extrinsic extends React.PureComponent<Props> {
  subjects: Subjects;
  Params: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.subjects = createSubjects(props.subject);
    this.Params = withObservable(this.subjects.method)(Params);
  }

  componentWillMount () {
    this.subjects.subscribe();
  }

  componentWillUnmount () {
    // FIXME unsubscribe
  }

  render (): React$Node {
    const { className, isError, isPrivate, labelMethod, labelSection, style } = this.props;

    return (
      <div
        className={['extrinsics--Extrinsic', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='full'>
          <InputExtrinsic
            isError={isError}
            isPrivate={isPrivate}
            labelMethod={labelMethod}
            labelSection={labelSection}
            subject={this.subjects.method}
          />
        </div>
        <this.Params
          subject={this.subjects.params}
        />
      </div>
    );
  }
}
