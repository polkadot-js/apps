// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { QueueTx } from './types';

import React from 'react';

import translate from './translate';

type Props = I18nProps & {
  value: QueueTx
}

function Status ({ className, style, value: { extrinsic, isValid, status } }: Props): React$Node {
  if (!isValid || ['incomplete'].includes(status)) {
    return null;
  }

  return (
    <div
      className={['extrinsics--Status', status, className].join(' ')}
      style={style}
    >
      <div className='header'>
        {extrinsic.section}_{extrinsic.name}
      </div>
      <div className='status'>
        {status}
      </div>
    </div>
  );
}

export default translate(Status);
