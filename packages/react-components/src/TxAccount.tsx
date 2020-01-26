// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import InputAddress from './InputAddress';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  filter?: string[];
  label?: React.ReactNode;
  help?: React.ReactNode;
  onChange: (value: string | null) => void;
}

export default function TxAccount ({ className, filter, help, label, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <InputAddress
      className={className}
      filter={filter}
      help={help || t('Select the account to use for this action.')}
      label={label || t('using my account')}
      onChange={onChange}
      type='account'
      withLabel
    />
  );
}
