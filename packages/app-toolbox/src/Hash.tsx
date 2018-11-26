// Copyright 2017-2018 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/ui-app/types';

import React from 'react';
import { Input, Output, Static } from '@polkadot/ui-app/index';
import { hexToU8a, isHex, stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import translate from './translate';

type State = {
  data: string,
  hash: string,
  isHexData: boolean
};

class Hash extends React.PureComponent<Props, State> {
  state: State = {
    data: '',
    hash: blake2AsHex(stringToU8a(''), 256),
    isHexData: false
  };

  render () {
    return (
      <div className='toolbox--Hash'>
        {this.renderInput()}
        {this.renderOutput()}
      </div>
    );
  }

  renderInput () {
    const { t } = this.props;
    const { data, isHexData } = this.state;

    return (
      <div className='ui--row'>
        <Input
          autoFocus
          className='large'
          label={t('hash.data', {
            defaultValue: 'from the following data (hex or string)'
          })}
          onChange={this.onChangeData}
          value={data}
        />
        <Static
          className='small'
          label={t('hash.isHex', {
            defaultValue: 'hex input data'
          })}
          value={
            isHexData
              ? t('hash.isHex.yes', {
                defaultValue: 'Yes'
              })
              : t('hash.isHex.no', {
                defaultValue: 'No'
              })
          }
        />
      </div>
    );
  }

  renderOutput () {
    const { t } = this.props;
    const { hash } = this.state;

    return (
      <div className='ui--row'>
        <Output
          className='full toolbox--hex'
          isHidden={hash.length === 0}
          label={t('hash.output', {
            defaultValue: 'the resulting hash is'
          })}
          value={hash}
          withCopy
        />
      </div>
    );
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);
    const hash = blake2AsHex(
      isHexData
        ? hexToU8a(data)
        : stringToU8a(data),
      256
    );

    this.setState({ data, hash, isHexData });
  }
}

export default translate(Hash);
