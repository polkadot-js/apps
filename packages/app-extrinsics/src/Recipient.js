// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';
import { translate } from 'react-i18next';

import Account from './Account';
import { recipientAddr } from './subjects';

type Props = BaseProps & {};

function Recipient (props: Props): React$Node {
  return (
    <Account
      {...props}
      className={['extrinsics--Recipient', props.className].join(' ')}
      label={props.t('recipient.label', {
        defaultValue: 'to the recipient'
      })}
      subject={recipientAddr}
    />
  );
}

export default translate(['extrinsics'])(Recipient);
