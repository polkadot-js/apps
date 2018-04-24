// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import { translate } from 'react-i18next';

import Account from './Account';
import { senderAddr } from './subjects';

type Props = BaseProps & {};

function Sender (props: Props): React$Node {
  return (
    <Account
      {...props}
      className={['extrinsics--Sender', props.className].join(' ')}
      label={props.t('sender.label', {
        defaultValue: 'using the selected account'
      })}
      subject={senderAddr}
    />
  );
}

export default translate(['extrinsics'])(Sender);
