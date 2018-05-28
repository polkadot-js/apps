// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { EncodingVersions } from '@polkadot/extrinsics-codec/types';
import type { Extrinsic$Method } from '@polkadot/extrinsics/types';
import type { BareProps } from '@polkadot/ui-app/types';
import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { RawParam } from '@polkadot/ui-app/Params/types';
import type { EncodedMessage } from '@polkadot/ui-signer/types';

import React from 'react';

import encode from '@polkadot/extrinsics-codec/encode/extrinsic';
import InputExtrinsic from '@polkadot/ui-app/InputExtrinsic';
import Params from '@polkadot/ui-app/Params';
import classes from '@polkadot/ui-app/util/classes';
import isUndefined from '@polkadot/util/is/undefined';
import withApi from '@polkadot/ui-react-rx/with/api';

import paramComponents from './Params';

type Props = BareProps & ApiProps & {
  defaultValue: Extrinsic$Method,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (encoded: EncodedMessage) => void
};

type State = {
  extrinsic: Extrinsic$Method,
  values: Array<RawParam>,
  apiSupport: EncodingVersions
};

class Extrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: props.defaultValue,
      values: [],
      apiSupport: 'poc-1'
    };
  }

  componentDidMount () {
    // FIXME should be shared component, no unmount here
    this.props.api.system.version().subscribe((nodeVersion?: string) => {
      this.setState({
        apiSupport: nodeVersion === undefined || nodeVersion === '0.1.0'
          ? 'poc-1'
          : 'latest'
      });
    });
  }

  render (): React$Node {
    const { className, defaultValue, isError, isPrivate, labelMethod, labelSection, style } = this.props;
    const { extrinsic } = this.state;

    return (
      <div
        className={classes('extrinsics--Extrinsic', className)}
        style={style}
      >
        <InputExtrinsic
          defaultValue={defaultValue}
          isError={isError}
          isPrivate={isPrivate}
          labelMethod={labelMethod}
          labelSection={labelSection}
          onChange={this.onChangeExtrinsic}
        />
        <Params
          item={extrinsic}
          onChange={this.onChangeValues}
          overrides={paramComponents}
        />
      </div>
    );
  }

  nextState (newState: $Shape<State>): void {
    this.setState(newState, () => {
      const { onChange } = this.props;
      const { apiSupport, extrinsic, values } = this.state;
      const params = Object.values(extrinsic.params);
      const isValid = values.length === params.length &&
        params.reduce((isValid, param, index) =>
          isValid &&
          !isUndefined(values[index]) &&
          !isUndefined(values[index].value) &&
          values[index].isValid, true);
      const value = isValid && extrinsic.params
        ? encode(extrinsic, values.map((p) => p.value), apiSupport)
        : new Uint8Array([]);

      onChange({
        extrinsic,
        isValid,
        values: [value]
      });
    });
  }

  onChangeExtrinsic = (extrinsic: Extrinsic$Method): void => {
    this.nextState({ extrinsic });
  };

  onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values });
  }
}

export default withApi(Extrinsic);
