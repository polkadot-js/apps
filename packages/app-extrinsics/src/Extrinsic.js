// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BareProps } from '@polkadot/ui-react-app/types';
import type { EncodedMessage } from '../types';

import React from 'react';
import encode from '@polkadot/extrinsics-codec/encode/extrinsic';
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
  onChange?: (values: EncodedMessage) => void
};

type State = {
  extrinsic: Extrinsic,
  values: Array<RawParam>
};

export default class ExtrinsicDisplay extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: props.defaultValue,
      isValid: false
    };
  }

  onChange = (): void => {
    const { onChange } = this.props;
    const { extrinsic, values } = this.state;
    const params = Object.values(extrinsic.params || {});
    const isValid = values.length === params.length &&
      params.reduce((isValid, param, index) =>
        isValid &&
        !isUndefined(values[index]) &&
        !isUndefined(values[index].value) &&
        values[index].isValid, true);
    const data = isValid && extrinsic.params
      ? encode(extrinsic, values.map((p) => p.value))
      : new Uint8Array([]);

    onChange && onChange({
      data,
      extrinsic,
      isValid
    });
  }

  onChangeExtrinsic = (extrinsic: Extrinsic): void => {
    this.setState({ extrinsic }, this.onChange);
  };

  onChangeValues = (values: Array<RawParam>): void => {
    this.setState({ values }, this.onChange);
  }

  render (): React$Node {
    const { className, defaultValue, isError, isPrivate, labelMethod, labelSection, style } = this.props;
    const { extrinsic } = this.state;

    return (
      <div
        className={['extrinsics--Extrinsic', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='full'>
          <InputExtrinsic
            defaultValue={defaultValue}
            isError={isError}
            isPrivate={isPrivate}
            labelMethod={labelMethod}
            labelSection={labelSection}
            onChange={this.onChangeExtrinsic}
          />
        </div>
        <Params
          extrinsic={extrinsic}
          onChange={this.onChangeValues}
          overrides={paramComponents}
        />
      </div>
    );
  }
}
