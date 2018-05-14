// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { StorageQuery } from './types';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Labelled from '@polkadot/ui-app/src/Labelled';
import typeToText from '@polkadot/ui-app/src/Params/typeToText';
import valueToText from '@polkadot/ui-app/src/Params/valueToText';
import withStorageDiv from '@polkadot/ui-react-rx/with/storageDiv';

import translate from './translate';

type Props = I18nProps & {
  onRemove: (id: number) => void,
  value: StorageQuery
};

type State = {
  inputs: Array<React$Node>,
  Component: React$ComponentType<*>;
};

const cache = [];

class Query extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getDerivedStateFromProps ({ value: { id, key, params } }: Props, prevState: State): State | null {
    const Component = ((): React$ComponentType<*> => {
      if (!cache[id]) {
        const values = params.map(({ value }) => value);

        cache[id] = withStorageDiv(key, { params: values })(
          (value) =>
            valueToText(key.type, value),
          { className: 'ui disabled dropdown selection' }
        );
      }

      return cache[id];
    })();
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
        className={['storage--Query', 'storage--actionrow', className].join(' ')}
        style={style}
      >
        <Labelled
          className='storage--actionrow-value'
          label={
            <div>{key.section}.{key.name}({inputs}): {typeToText(key.type)}</div>
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
