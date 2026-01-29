// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InputAddress from './InputAddress/index.js';
import { useTranslation } from './translate.js';

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
      label={t('vote with account')}
      onChange={onChange}
      type='account'
      withLabel
    />
  );
}

export default React.memo(VoteAccount);
