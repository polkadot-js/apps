// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InputAddress from './InputAddress';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  filter?: string[];
  onChange: (value: string | null) => void;
}

function VoteAccount ({ className = '', filter, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <InputAddress
      className={className}
      filter={filter}
      help={t<string>('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
      label={t<string>('vote with account')}
      onChange={onChange}
      type='account'
      withLabel
    />
  );
}

export default React.memo(VoteAccount);
