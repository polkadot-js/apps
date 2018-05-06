// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BareProps } from '@polkadot/ui-react-app/types';
import type { EncodedParams } from '../types';

import React from 'react';
import encodeExtrinsic from '@polkadot/extrinsics-codec/encode/extrinsic';
import InputExtrinsic from '@polkadot/ui-react-app/src/InputExtrinsic';
import Params from '@polkadot/ui-react-app/src/Params';
import isUndefined from '@polkadot/util/is/undefined';

import paramComponents from './Params';

type Props = BareProps & {
  defaultValue: Extrinsic,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: rxjs$BehaviorSubject<EncodedParams>
};

type State = {
  extrinsic: Extrinsic,
  params: Array<RawParam>
};

export default class ExtrinsicDisplay extends React.PureComponent<Props, State> {
  state: State;
  Params: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: props.defaultValue
    };
  }

  onChange = (): void => {
    const { extrinsic } = this.state.getValue();
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
    const data = extrinsic.params
      ? encodeExtrinsic(extrinsic, raw)
      : new Uint8Array([]);

    this.props.subject.next({
      data,
      extrinsic,
      isValid
    });
  };

  onChangeExtrinsic = (extrinsic: Extrinsic): void => {
    this.setState({ extrinsic, isValid: false }, () => {});
  }

  render (): React$Node {
    const { className, isError, isPrivate, labelMethod, labelSection, style } = this.props;
    const { extrinsic } = this.state;

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
            onChange={this.onChangeExtrinsic}
          />
        </div>
        <Params
          overrides={paramComponents}
          value={extrinsic}
        />
      </div>
    );
  }
}
