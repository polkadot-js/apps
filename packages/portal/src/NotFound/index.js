// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './NotFound.css';

import React from 'react';
import { translate } from 'react-i18next';

function NotFound ({ className, style, t }: BaseProps) {
  return (
    <div
      className={['portal--NotFound', className].join(' ')}
      style={style}
    >
      {t('notfound.error', {
        defaultValue: 'ERROR: You have tried to access an application that does not exist'
      })}
    </div>
  );
}

export default translate(['portal'])(NotFound);
