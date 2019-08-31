// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Compact } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { hexToU8a, u8aConcat } from '@polkadot/util';

import Bare from './Bare';

interface StateParam {
  isValid: boolean;
  u8a: Uint8Array;
}

interface State {
  key: StateParam;
  value: StateParam;
}

export default class KeyValue extends React.PureComponent<Props, State> {
  public state: State = {
    key: {
      isValid: false,
      u8a: new Uint8Array([])
    },
    value: {
      isValid: false,
      u8a: new Uint8Array([])
    }
  };

  public render (): React.ReactNode {
    const { className, isDisabled, label, onEnter, style, withLabel } = this.props;
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
          onEnter={onEnter}
          placeholder='0x...'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  public static createParam (hex: string, length = -1): StateParam {
    let u8a;

    try {
      u8a = hexToU8a(hex);
    } catch (error) {
      u8a = new Uint8Array([]);
    }

    const isValid = length !== -1
      ? u8a.length === length
      : u8a.length !== 0;

    return {
      isValid,
      u8a: Compact.addLengthPrefix(u8a)
    };
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State, { onChange }: Props): State => {
        const { key = prevState.key, value = prevState.value } = newState;

        onChange && onChange({
          isValid: key.isValid && value.isValid,
          value: u8aConcat(
            key.u8a,
            value.u8a
          )
        });

        return newState as State;
      }
    );
  }

  private onChangeKey = (key: string): void => {
    this.nextState({ key: KeyValue.createParam(key) });
  }

  private onChangeValue = (value: string): void => {
    this.nextState({ value: KeyValue.createParam(value) });
  }
}
