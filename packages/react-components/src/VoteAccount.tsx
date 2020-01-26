// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxAccountProps as Props } from './types';

import React from 'react';

import TxAccount from './TxAccount';
import { useTranslation } from './translate';

export default function VoteAccount (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <TxAccount
      help={t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
      label={t('vote with account')}
      {...props}
    />
  );
}
