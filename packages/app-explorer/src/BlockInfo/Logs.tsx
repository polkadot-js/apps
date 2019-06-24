// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { DigestItem, Struct, Tuple, U8a, Vector, getTypeDef } from '@polkadot/types';
import { Column } from '@polkadot/ui-app';
import Params from '@polkadot/ui-params';

import translate from '../translate';

type Props = I18nProps & {
  value?: Array<DigestItem>
};

class Logs extends React.PureComponent<Props> {
  render () {
    const { t, value } = this.props;

    if (!value || !value.length) {
      return null;
    }

    return (
      <Column headerText={t('logs')}>
        {value.map(this.renderItem)}
      </Column>
    );
  }

  private renderItem = (item: DigestItem, index: number) => {
    let content: React.ReactNode;

    if (item.value instanceof Struct) {
      content = this.formatStruct(item.value);
    } else if (item.value instanceof Tuple) {
      content = this.formatTuple(item.value);
    } else if (item.value instanceof Vector) {
      content = this.formatVector(item.value);
    } else if (item.value instanceof U8a) {
      content = this.formatU8a(item.value);
    } else {
      content = <div>{item.value.toString().split(',').join(', ')}</div>;
    }

    return (
      <div
        className='explorer--BlockByHash-block'
        key={index}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>{item.type.toString()}</h3>
          </div>
          <details>
            <summary>Details</summary>
            {content}
          </details>
        </article>
      </div>
    );
  }

  private formatU8a (value: U8a) {
    return (
      <Params
        isDisabled
        params={[{ type: getTypeDef('Bytes') }]}
        values={[{ isValid: true, value }]}
      />
    );
  }

  private formatStruct (struct: Struct) {
    const types: { [index: string]: string } = struct.Type;
    const params = Object.keys(types).map((name) => ({
      name,
      type: getTypeDef(types[name])
    }));
    const values = struct.toArray().map((value) => ({
      isValid: true,
      value
    }));

    return (
      <Params
        isDisabled
        params={params}
        values={values}
      />
    );
  }

  private formatTuple (tuple: Tuple) {
    const types = tuple.Types;
    const params = types.map((type) => ({
      type: getTypeDef(type)
    }));
    const values = tuple.toArray().map((value) => ({
      isValid: true,
      value
    }));

    return (
      <Params
        isDisabled
        params={params}
        values={values}
      />
    );
  }

  private formatVector (vector: Vector<any>) {
    const type = getTypeDef(vector.Type);
    const values = vector.toArray().map((value) => ({
      isValid: true,
      value
    }));
    const params = values.map((_, index) => ({
      name: `${index}`,
      type
    }));

    return (
      <Params
        isDisabled
        params={params}
        values={values}
      />
    );
  }
}

export default translate(Logs);
