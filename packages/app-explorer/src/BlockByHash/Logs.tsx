// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

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
      console.error('Logs:renderItem:Struct');

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
      console.error('Logs:renderItem:Vector');

      content = item.value.map((entry, index) => (
        <span key={index}>{entry.toString()}</span>
      ));
    } else {
      console.error('Logs:renderItem:Plain');

      content = item.value.toString();
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
          {content}
        </article>
      </div>
    );
  }
}

// @ts-ignore Definitions seem to have gone wonky
export default translate(Logs);
