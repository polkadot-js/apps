// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { StorageQuery } from './types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';
import Button from '@polkadot/ui-app/Button';
import Labelled from '@polkadot/ui-app/Labelled';
import valueToText from '@polkadot/ui-app/Params/valueToText';
import classes from '@polkadot/ui-app/util/classes';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';

import translate from './translate';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

type ComponentProps = {};

type State = {
  inputs: Array<React$Node>,
  Component: React$ComponentType<ComponentProps>;
};

const cache = [];

class Query extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getCachedComponent ({ id, key, params }: StorageQuery): React$ComponentType<ComponentProps> {
    if (!cache[id]) {
      const values = params.map(({ value }) => value);

      cache[id] = withStorageDiv(key, { params: values })(
        (value) =>
          valueToText(key.type, value),
        { className: 'ui--output' }
      );
    }

    return cache[id];
  }

  static getDerivedStateFromProps ({ value }: Props, prevState: State): State | null {
    const Component = Query.getCachedComponent(value);
    const { key, params } = value;
    const inputs = Object
      .keys(key.params)
      .map((name, index) => {
        const formatted = valueToText(key.params[name].type, params[index].value);

        return (
          <span key={`param_${name}_${index}`}>{name}={formatted}</span>
        );
      });

    return {
      Component,
      inputs
    };
  }

  render (): React$Node {
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
            <div>{key.section}.{key.name}({inputs}): {typeToString(key.type)}</div>
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
