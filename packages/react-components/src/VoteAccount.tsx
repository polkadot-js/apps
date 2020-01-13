// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import InputAddress from './InputAddress';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (value: string | null) => void;
}

export default function VoteAccount ({ className, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <InputAddress
      className={className}
      help={t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
      label={t('vote with account')}
      onChange={onChange}
      type='account'
      withLabel
    />
  );
}
