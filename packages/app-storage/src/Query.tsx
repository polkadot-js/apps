// Copyright 2017-2018 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Storage$Key$Value } from '@polkadot/storage/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { StorageQuery } from './types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';
import Button from '@polkadot/ui-app/Button';
import Labelled from '@polkadot/ui-app/Labelled';
import valueToText from '@polkadot/ui-app/Params/valueToText';
import classes from '@polkadot/ui-app/util/classes';
import withObservableDiv from '@polkadot/ui-react-rx/with/observableDiv';

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
      const values: Array<Storage$Key$Value> = params.map(({ value }) =>
        // FIXME not 100% convinced, arrays could be an issue? (Plus, if we have to cast, something just _seems_ off)
        value as Storage$Key$Value
      );

      cache[id] = withObservableDiv('rawStorage', { params: [key, ...values] })(
        (value: any) =>
          valueToText(key.type, value),
        { className: 'ui--output' }
      );
    }

    return cache[id];
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value);
    const { key, params } = value;
    const inputs = key.params.map(({ name, type }, index) => (
      <span key={`param_${name}_${index}`}>
        {name}={valueToText(type, params[index].value)}
      </span>
    ));

    return {
      Component,
      inputs
    };
  }

  render () {
    const { className, style, value: { key } } = this.props;
    const { Component, inputs } = this.state;

    return (
      <div
        className={classes('storage--Query', 'storage--actionrow', className)}
        style={style}
      >
        <Labelled
          className='storage--actionrow-value'
          label={
            <div className='ui--Param-text'>
              <div className='ui--Param-text name'>{key.section}.{key.name}(</div>
              {inputs}
              <div className='ui--Param-text name'>):</div>
              <div className='ui--Param-text'>{typeToString(key.type)}</div>
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

  onRemove = (): void => {
    const { onRemove, value: { id } } = this.props;

    delete cache[id];

    onRemove(id);
  }
}

export default translate(Query);
