// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useMemo } from 'react';

import Dropdown from './Dropdown';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

export default function VoteToggle ({ className, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const voteOpts = useMemo(() => [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ], [t]);

  return (
    <Dropdown
      className={className}
      help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
      label={t('record my vote as')}
      options={voteOpts}
      onChange={onChange}
      value={value}
    />
  );
}
