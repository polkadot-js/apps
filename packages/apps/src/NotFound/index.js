// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './NotFound.css';

import React from 'react';

import classes from '@polkadot/ui-app/src/util/classes';

import translate from '../translate';

type Props = I18nProps & {};

function NotFound ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={classes('apps--NotFound', className)}
      style={style}
    >
      {t('notfound.error', {
        defaultValue: 'ERROR: You have tried to access an application that does not exist'
      })}
    </div>
  );
}

export default translate(NotFound);
