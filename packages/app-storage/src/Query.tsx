// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageFunction } from '@polkadot/types/StorageKey';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueryTypes, StorageModuleQuery } from './types';

import React from 'react';
import { Compact } from '@polkadot/types/codec';
import { Button, Labelled } from '@polkadot/ui-app/index';
import valueToText from '@polkadot/ui-app/Params/valueToText';
import { withObservableDiv } from '@polkadot/ui-react-rx/with/index';
import { isU8a, u8aToHex, u8aToString } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: QueryTypes
};

type ComponentProps = {};

type State = {
  inputs: Array<any>, // node?
  Component: React.ComponentType<ComponentProps>;
};

const cache: Array<React.ComponentType<ComponentProps>> = [];

class Query extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getCachedComponent (query: QueryTypes): React.ComponentType<ComponentProps> {
    const { id, key, params = [] } = query as StorageModuleQuery;

    if (!cache[id]) {
      const values: Array<any> = params.map(({ value }) => value);
      const type = key.meta
        ? key.meta.type.toString()
        : 'Data';

      cache[query.id] = withObservableDiv('rawStorage', { params: [key, ...values] })(
        (value: any) =>
          valueToText(type, value),
        { className: 'ui--output' }
      );
    }

    return cache[id];
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value);
    const inputs = isU8a(value.key)
      ? []
      // FIXME We need to render the actual key params
      // const { key, params } = value;
      // const inputs = key.params.map(({ name, type }, index) => (
      //   <span key={`param_${name}_${index}`}>
      //     {name}={valueToText(type, params[index].value)}
      //   </span>
      // ));
      : [];

    return {
      Component,
      inputs
    };
  }

  render () {
    const { value } = this.props;
    const { Component } = this.state;
    const { key } = value;

    return (
      <div className='storage--Query storage--actionrow'>
        <Labelled
          className='storage--actionrow-value'
          label={
            <div className='ui--Param-text'>
              <div className='ui--Param-text name'>{this.keyToName(key)}</div>
              {this.renderInputs()}
              <div className='ui--Param-text'>{
                isU8a(key)
                  ? 'Data'
                  : key.meta.type.toString()
              }</div>
            </div>
          }
        >
          <Component />
        </Labelled>
        <Labelled className='storage--actionrow-button'>
          <Button
            icon='close'
            isNegative
            onClick={this.onRemove}
          />
        </Labelled>
      </div>
    );
  }

  private renderInputs () {
    const { inputs } = this.state;

    if (inputs.length === 0) {
      return (
        <div className='ui--Param-text name'>:</div>
      );
    }

    return [
      <div key='open' className='ui--Param-text name'>(</div>,
      inputs,
      <div key='close' className='ui--Param-text name'>):</div>
    ];
  }

  private keyToName (key: Uint8Array | StorageFunction): string {
    if (isU8a(key)) {
      const u8a = Compact.stripLengthPrefix(key);

      // If the string starts with `:`, handle it as a pure string
      return u8a[0] === 0x3a
        ? u8aToString(u8a)
        : u8aToHex(u8a);
    }

    return `${key.section}.${key.method}`;
  }

  private onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);
