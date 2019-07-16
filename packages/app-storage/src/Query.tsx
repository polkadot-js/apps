// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntryPromise } from '@polkadot/api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { QueryTypes, StorageModuleQuery } from './types';

import React from 'react';
import styled from 'styled-components';
import { Compact } from '@polkadot/types';
import { Button, Labelled } from '@polkadot/ui-app';
import { withCallDiv } from '@polkadot/ui-api';
import valueToText from '@polkadot/ui-params/valueToText';
import { isU8a, u8aToHex, u8aToString } from '@polkadot/util';

import translate from './translate';
import { RenderFn, DefaultProps, ComponentRenderer } from '@polkadot/ui-api/with/types';

interface Props extends I18nProps {
  onRemove: (id: number) => void;
  value: QueryTypes;
}

interface State {
  inputs?: React.ReactNode[];
  Component?: React.ComponentType<{}>;
  spread: Record<number, boolean>;
}

interface CacheInstance {
  Component: React.ComponentType<any>;
  render: RenderFn;
  refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any>;
}

const cache: CacheInstance[] = [];

class Query extends React.PureComponent<Props, State> {
  public state: State = { spread: {} };

  public static getCachedComponent (query: QueryTypes): CacheInstance {
    const { id, key, params = [] } = query as StorageModuleQuery;

    if (!cache[id]) {
      const values: any[] = params.map(({ value }): any => value);
      const type = key.creator.meta
        ? key.creator.meta.type.toString()
        : 'Data';
      const defaultProps = { className: 'ui--output' };

      // render function to create an element for the query results which is plugged to the api
      const renderHelper = withCallDiv('subscribe', {
        paramName: 'params',
        paramValid: true,
        params: [key, ...values]
      });
      const Component = renderHelper(
        // By default we render a simple div node component with the query results in it
        (value: any): React.ReactNode => valueToText(type, value, true, true),
        defaultProps
      );
      cache[query.id] = Query.createComponent(type, Component, defaultProps, renderHelper);
    }

    return cache[id];
  }

  public static createComponent (type: string, Component: React.ComponentType<any>, defaultProps: DefaultProps, renderHelper: ComponentRenderer): { Component: React.ComponentType<any>; render: (createComponent: RenderFn) => React.ComponentType<any>; refresh: (swallowErrors: boolean, contentShorten: boolean) => React.ComponentType<any> } {
    return {
      Component,
      // In order to replace the default component during runtime we can provide a RenderFn to create a new 'plugged' component
      render: (createComponent: RenderFn): React.ComponentType<any> => {
        return renderHelper(createComponent, defaultProps);
      },
      // In order to modify the parameters which are used to render the default component, we can use this method
      refresh: (swallowErrors: boolean, contentShorten: boolean): React.ComponentType<any> => {
        return renderHelper(
          (value: any): React.ReactNode => valueToText(type, value, swallowErrors, contentShorten),
          defaultProps
        );
      }
    };
  }

  public static getDerivedStateFromProps ({ value }: Props): Pick<State, never> {
    const Component = Query.getCachedComponent(value).Component;
    const inputs: React.ReactNode[] = isU8a(value.key)
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

  public render (): React.ReactNode {
    const { className, value } = this.props;
    const { Component } = this.state;
    const { key } = value;
    const type = isU8a(key)
      ? 'Data'
      : (
        key.creator.meta.modifier.isOptional
          ? `Option<${key.creator.meta.type}>`
          : key.creator.meta.type.toString()
      );

    if (!Component) {
      return null;
    }

    return (
      <div className={`storage--Query storage--actionrow ${className}`}>
        <div className='storage--actionrow-value'>
          <Labelled
            label={
              <div className='ui--Param-text'>
                {this.keyToName(key)}: {type}
              </div>
            }
          >
            <Component />
          </Labelled>
        </div>
        <div className='storage--actionrow-buttons'>
          <div className='container'>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }

  private renderButtons (): React.ReactNode {
    const { id, key } = this.props.value as StorageModuleQuery;

    const buttons = [
      <Button
        icon='close'
        isNegative
        key='close'
        onClick={this.onRemove}
      />
    ];

    if (key.creator.meta && ['Bytes', 'Data'].includes(key.creator.meta.type.toString())) {
      // TODO We are currently not performing a copy
      // buttons.unshift(
      //   <Button
      //     icon='copy'
      //     onClick={this.copyHandler(id)}
      //   />
      // );
      buttons.unshift(
        <Button
          icon='ellipsis horizontal'
          key='spread'
          onClick={this.spreadHandler(id)}
        />
      );
    }

    return buttons;
  }

  private keyToName (key: Uint8Array | StorageEntryPromise): string {
    if (isU8a(key)) {
      const u8a = Compact.stripLengthPrefix(key);

      // If the string starts with `:`, handle it as a pure string
      return u8a[0] === 0x3a
        ? u8aToString(u8a)
        : u8aToHex(u8a);
    }

    return `${key.creator.section}.${key.creator.method}`;
  }

  private spreadHandler (id: number): () => void {
    return (): void => {
      const { spread } = this.state;

      cache[id].Component = cache[id].refresh(true, !!spread[id]);
      spread[id] = !spread[id];

      this.setState({
        ...this.state,
        ...spread,
        Component: cache[id].Component
      });
    };
  }

  private onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(styled(Query as React.ComponentClass<Props>)`
  margin-bottom: 0.25em;

  .ui.disabled.dropdown.selection {
    color: #aaa;
    opacity: 1;
  }

  .ui--IdentityIcon {
    margin: -10px 0;
    vertical-align: middle;
  }
`);
