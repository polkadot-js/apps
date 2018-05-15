// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps as Props } from '@polkadot/ui-app/types';

import React from 'react';

import Input from '@polkadot/ui-app/src/Input';
import Output from '@polkadot/ui-app/src/Output';
import Static from '@polkadot/ui-app/src/Static';
import classes from '@polkadot/ui-app/src/util/classes';
import hexToU8a from '@polkadot/util/hex/toU8a';
import isHex from '@polkadot/util/is/hex';
import u8aFromString from '@polkadot/util/u8a/fromString';
import xxhashAsHex256 from '@polkadot/util-crypto/xxhash/asHex256';

import translate from './translate';

type State = {
  data: string,
  hash: string,
  isHexData: boolean
};

class Hash extends React.PureComponent<Props, State> {
  state: State = {
    data: '',
    hash: xxhashAsHex256(u8aFromString('')),
    isHexData: false
  };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { data, hash, isHexData } = this.state;

    return (
      <div
        className={classes('toolbox--Hash', className)}
        style={style}
      >
        <div className='ui--row'>
          <Input
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
      </div>
    );
  }

  onChangeData = (data: string): void => {
    const isHexData = isHex(data);
    const hash = xxhashAsHex256(
      isHexData
        ? hexToU8a(data)
        : u8aFromString(data)
    );

    this.setState({ data, hash, isHexData });
  }
}

export default translate(Hash);
