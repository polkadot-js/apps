// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
