// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { EncodedParams } from '../types';
import type { Subjects } from './types';

import React from 'react';
import encodeExtrinsic from '@polkadot/extrinsics-codec/encode/extrinsic';
import withObservable from '@polkadot/rx-react/with/observable';
import InputExtrinsic from '@polkadot/ui-react-app/src/InputExtrinsic';
import isUndefined from '@polkadot/util/is/undefined';

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
    this.subjects.params.subscribe(this.onChange);
    this.subjects.method.subscribe(this.onChange);
  }

  componentWillUnmount () {
    // FIXME unsubscribe
  }

  onChange = (): void => {
    const extrinsic = this.subjects.method.getValue();
    const values = this.subjects.params.getValue();
    const isValid = !!extrinsic.params &&
      Object
        .values(extrinsic.params)
        .reduce((isValid, param, index) => {
          return isValid &&
            !isUndefined(values[index]) &&
            !isUndefined(values[index].value) &&
            values[index].isValid;
        }, !!values);
    const raw = values.map((param) => param && param.value);
    const data = extrinsic.params && encodeExtrinsic(extrinsic, raw);

    this.props.subject.next({
      data,
      extrinsic,
      isValid
    });
  };

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
