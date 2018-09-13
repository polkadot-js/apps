// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { SectionItem } from '@polkadot/params/types';
import { Extrinsics } from '@polkadot/extrinsics/types';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { EncodedMessage } from '@polkadot/ui-signer/types';

import React from 'react';

import encode from '@polkadot/extrinsics/codec/encode/extrinsic';
import InputExtrinsic from '@polkadot/ui-app/InputExtrinsic';
import Params from '@polkadot/ui-app/Params';
import isUndefined from '@polkadot/util/is/undefined';
import withApi from '@polkadot/ui-react-rx/with/api';

import paramComponents from './Params';

type Props = BareProps & ApiProps & {
  defaultValue: SectionItem<Extrinsics>,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (encoded: EncodedMessage) => void,
  withLabel?: boolean
};

type State = {
  extrinsic: SectionItem<Extrinsics>,
  values: Array<RawParam>
};

class Extrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: props.defaultValue,
      values: []
    };
  }

  render () {
    const { defaultValue, isDisabled, isError, isPrivate, labelMethod, labelSection, withLabel } = this.props;
    const { extrinsic } = this.state;

    return (
      <div className='extrinsics--Extrinsic'>
        <InputExtrinsic
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          isPrivate={isPrivate}
          labelMethod={labelMethod}
          labelSection={labelSection}
          onChange={this.onChangeExtrinsic}
          withLabel={withLabel}
        />
        <Params
          item={extrinsic}
          onChange={this.onChangeValues}
          overrides={paramComponents}
        />
      </div>
    );
  }

  nextState (newState: State): void {
    this.setState(newState, () => {
      const { apiSupport, onChange } = this.props;
      const { extrinsic, values } = this.state;
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
        isValid,
        values: [value]
      });
    });
  }

  onChangeExtrinsic = (extrinsic: SectionItem<Extrinsics>): void => {
    this.nextState({ extrinsic, values: [] } as State);
  }

  onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }
}

export default withApi(Extrinsic);
