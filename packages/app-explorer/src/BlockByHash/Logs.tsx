// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Struct, Vector, getTypeDef } from '@polkadot/types/codec';
import { DigestItem } from '@polkadot/types/Digest';
import { Params } from '@polkadot/ui-app/index';

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
      <section>
        <h1>{t('block.logs', {
          defaultValue: 'logs'
        })}</h1>
        <div className='explorer--BlockByHash-flexable'>
          {value.map(this.renderItem)}
        </div>
      </section>
    );
  }

  private renderItem = (item: DigestItem, index: number) => {
    let content: React.ReactNode;

    if (item.value instanceof Struct) {
      const types: { [index: string]: string } = item.value.Type;

      const params = Object.keys(types).map((name) => ({
        name,
        type: getTypeDef(types[name])
      }));
      const values = item.value.toArray().map((value) => ({
        isValid: true,
        value
      }));

      content = (
        <Params
          isDisabled
          params={params}
          values={values}
        />
      );
    } else if (item.value instanceof Vector) {
      content = item.value.map((entry, index) => (
        <span key={index}>{entry.toString()}</span>
      ));
    } else {
      content = item.value.toString().split(',').join(', ');
    }

    return (
      <div
        className='explorer--BlockByHash-block'
        key={index}
      >
        <article className='explorer--Container'>
          <div className='header'>
            <h3>
              {item.type.toString()}
            </h3>
            <div className='description' />
          </div>
          <div className='value'>
            {content}
          </div>
        </article>
      </div>
    );
  }
}

export default translate(Logs);
