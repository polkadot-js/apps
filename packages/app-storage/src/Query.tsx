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
import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-react-rx/with/types';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: QueryTypes
};

type ComponentProps = {};

type State = {
  inputs: Array<any>, // node?
  Component: React.ComponentType<ComponentProps>
};

type CacheInstance = {
  Component: React.ComponentType<any>,
  render: RenderFn,
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>
};

const cache: Array<CacheInstance> = [];

class Query extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getCachedComponent (query: QueryTypes): CacheInstance {
    const { id, key, params = [] } = query as StorageModuleQuery;

    if (!cache[id]) {
      const values: Array<any> = params.map(({ value }) => value);
      const type = key.meta
        ? key.meta.type.toString()
        : 'Data';
      const defaultProps = { className: 'ui--output' };

      // render function to create an element for the query results which is plugged to the api
      const fetchAndRenderHelper = withObservableDiv('rawStorage', { params: [key, ...values] });
      const pluggedComponent = fetchAndRenderHelper(
        (value: any) => {
          // By default we render a simple div node component with the query results in it
          return valueToText(type, value, true, true);
        },
        defaultProps
      );
      cache[query.id] = Query.createComponentCacheInstance(type, pluggedComponent, defaultProps, fetchAndRenderHelper);
    }

    return cache[id];
  }

  static createComponentCacheInstance (type: string, pluggedComponent: React.ComponentType<any>, defaultProps: DefaultProps<any>, fetchAndRenderHelper: ComponentRenderer<any>) {
    return {
      Component: pluggedComponent,
      // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
      render: (createComponent: RenderFn) => {
        return fetchAndRenderHelper(
          createComponent,
          defaultProps
        );
      },
      // In order to modify the parameters which are used to render the default component, we can use this method
      refresh: (swallowErrors: boolean, contentShorten: boolean) => {
        return fetchAndRenderHelper(
          (value: any) => valueToText(type, value, swallowErrors, contentShorten),
          defaultProps
        );
      }
    };
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value).Component;
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
        <Labelled>
          {this.renderButtons()}
        </Labelled>
      </div>
    );
  }

  private renderButtons () {
    const { id, key } = this.props.value as StorageModuleQuery;

    const buttons = [] as Array<React.ReactNode>;
    const closeButton =
      <Button
        icon='close'
        isNegative
        onClick={this.onRemove}
      />;
    const spreadButton =
      /* needs an spread content action (wasm byte code)*/
      <Button
        text='spread'
        onClick={() => this.refreshCachedComponent(id, true, false)}
      />;

    const copyButton =
      /* needs an copy content action (wasm byte code) */
      <Button
        text='copy'
      />;

    if (key.meta.type.toString() === 'Bytes') {
      buttons.push(spreadButton, copyButton);
    }

    return buttons.concat([ closeButton ]);
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

  private refreshCachedComponent (id: number, swallowErrors: boolean, contentShorten: boolean) {
    cache[id].Component = cache[id].refresh(swallowErrors, contentShorten);
    this.setState({
      ...this.state,
      Component: cache[id].Component
    });
  }

  private onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);
