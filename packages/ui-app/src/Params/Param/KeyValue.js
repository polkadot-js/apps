// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import bnToU8a from '@polkadot/util/bn/toU8a';
import u8aConcat from '@polkadot/util/u8a/concat';
import hexToU8a from '@polkadot/util/hex/toU8a';

import Input from '../../Input';
import Bare from './Bare';

type State$Param = {
  isValid: boolean,
  u8a: Uint8Array
}

type State = {
  key: State$Param,
  value: State$Param
};

export default class KeyValue extends React.PureComponent<Props, State> {
  state: State = {
    key: {
      isValid: false,
      u8a: new Uint8Array([])
    },
    value: {
      isValid: false,
      u8a: new Uint8Array([])
    }
  };

  render (): React$Node {
    const { className, isDisabled, label, style, withLabel } = this.props;
    const { key, value } = this.state;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='medium'
          isDisabled={isDisabled}
          isError={!key.isValid}
          label={label}
          onChange={this.onChangeKey}
          placeholder='0x...'
          type='text'
          withLabel={withLabel}
        />
        <Input
          className='medium'
          isDisabled={isDisabled}
          isError={!value.isValid}
          onChange={this.onChangeValue}
          placeholder='0x...'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  createParam (hex: string, length: number = -1): State$Param {
    let u8a;

    try {
      u8a = hexToU8a(hex);
    } catch (error) {
      u8a = new Uint8Array([]);
    }

    const isValidLength = length !== -1
      ? u8a.length === length
      : u8a.length !== 0;

    return {
      isValid: isValidLength,
      u8a
    };
  }

  nextState (newState: $Shape<State>): void {
    this.setState(
      (prevState: State, { onChange }: Props) => {
        const { key = prevState.key, value = prevState.value } = newState;

        onChange({
          isValid: key.isValid && value.isValid,
          value: u8aConcat(
            u8aConcat(bnToU8a(key.u8a.length, 32, true), key.u8a),
            u8aConcat(bnToU8a(value.u8a.length, 32, true), value.u8a)
          )
        });

        return newState;
      }
    );
  }

  onChangeKey = (key: string): void => {
    this.nextState({ key: this.createParam(key) });
  };

  onChangeValue = (value: string): void => {
    this.nextState({ value: this.createParam(value) });
  };
}
