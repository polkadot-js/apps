// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import { Input, Output, Static } from '@polkadot/react-components';
import { hexToU8a, isHex, stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

import translate from './translate';

interface State {
  data: string;
  hash: string;
  isHexData: boolean;
}

function Hash ({ t }: Props): React.ReactElement<Props> {
  const [{ data, hash, isHexData }, setState] = useState<State>({
    data: '',
    hash: blake2AsHex(stringToU8a(''), 256),
    isHexData: false
  });

  const _onChangeData = (data: string): void => {
    const isHexData = isHex(data);

    setState({
      data,
      hash: blake2AsHex(
        isHexData
          ? hexToU8a(data)
          : stringToU8a(data),
        256
      ),
      isHexData
    });
  };

  return (
    <div className='toolbox--Hash'>
      <div className='ui--row'>
        <Input
          autoFocus
          className='full'
          help={t('The input data to hash. This can be either specified as a hex value (0x-prefix) or as a string.')}
          label={t('from the following data')}
          onChange={_onChangeData}
          value={data}
        />
      </div>
      <div className='ui--row'>
        <Static
          className='medium'
          help={t('Detection on the input string to determine if it is hex or non-hex.')}
          label={t('hex input data')}
          value={
            isHexData
              ? t('Yes')
              : t('No')
          }
        />
      </div>
      <div className='ui--row'>
        <Output
          className='full'
          help={t('The blake2b 256-bit hash of the actual input data.')}
          isHidden={hash.length === 0}
          isMonospace
          label={t('the resulting hash is')}
          value={hash}
          withCopy
        />
      </div>
    </div>
  );
}

export default translate(Hash);
