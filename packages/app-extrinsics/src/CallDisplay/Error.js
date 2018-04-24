// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './CallDisplay.css';

import React from 'react';
import { translate } from 'react-i18next';

function ErrorDisplay ({ className, style, t }: BaseProps): React$Node {
  return (
    <div
      className={['extrinsics--CallDisplay-error', className].join(' ')}
      style={style}
    >
      {t('calldisplay.error', {
        defaultValue: 'ERROR: Invalid or unimplemented extrinsic function'
      })}
    </div>
  );
}

export default translate(['extrinsics'])(ErrorDisplay);
