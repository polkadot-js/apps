// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import { translate } from 'react-i18next';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import RxNonce from '@polkadot/rx-react/Nonce';
import withObservableParams from '@polkadot/rx-react/with/observableParams';

import { senderAddr, senderIndex } from './subjects';

type Props = BaseProps & {};

const SenderNonce = withObservableParams(RxNonce, senderAddr);

function Nonce ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <Label>
          {t('nonce.label', {
            defaultValue: 'with an index'
          })}
        </Label>
        <SenderNonce
          className='ui disabled dropdown selection'
          classNameUpdated='hasUpdated'
          subject={senderIndex}
        />
      </div>
    </div>
  );
}

export default translate(['extrinsics'])(Nonce);
