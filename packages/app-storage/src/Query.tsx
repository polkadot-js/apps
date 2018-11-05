// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import React from 'react';
import { Button, Labelled } from '@polkadot/ui-app/index';
import valueToText from '@polkadot/ui-app/Params/valueToText';
import { withObservableDiv } from '@polkadot/ui-react-rx/with/index';

import translate from './translate';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

type ComponentProps = {};

type State = {
  inputs: Array<any>, // node?
  Component: React.ComponentType<ComponentProps>;
};

const cache: Array<React.ComponentType<ComponentProps>> = [];

class Query extends React.PureComponent<Props, State> {
  state: State = {} as State;

  static getCachedComponent ({ id, key, params }: StorageQuery): React.ComponentType<ComponentProps> {
    if (!cache[id]) {
      const values: Array<any> = params.map(({ value }) =>
        value
      );

      cache[id] = withObservableDiv('rawStorage', { params: [key, ...values] })(
        (value: any) =>
          valueToText(key.meta.type.toString(), value),
        { className: 'ui--output' }
      );
    }

    return cache[id];
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value);

    // FIXME
    // const { key, params } = value;
    // const inputs = key.params.map(({ name, type }, index) => (
    //   <span key={`param_${name}_${index}`}>
    //     {name}={valueToText(type, params[index].value)}
    //   </span>
    // ));

    return {
      Component,
      // FIXME
      inputs: []
    };
  }

  render () {
    const { value: { key } } = this.props;
    const { Component, inputs } = this.state;

    return (
      <div className='storage--Query storage--actionrow'>
        <Labelled
          className='storage--actionrow-value'
          label={
            <div className='ui--Param-text'>
              <div className='ui--Param-text name'>{key.section}.{key.method}(</div>
              {inputs}
              <div className='ui--Param-text name'>):</div>
              <div className='ui--Param-text'>{key.meta.type.toString()}</div>
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

  private onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);
