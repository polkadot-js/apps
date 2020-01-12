// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';

import Dropdown from './Dropdown';
import translate from './translate';

interface Props extends I18nProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

function VoteToggle ({ className, onChange, t, value }: Props): React.ReactElement<Props> {
  return (
    <Dropdown
      className={className}
      help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
      label={t('record my vote as')}
      options={[
        { text: t('Aye, I approve'), value: true },
        { text: t('Nay, I do not approve'), value: false }
      ]}
      onChange={onChange}
      value={value}
    />
  );
}

export default translate(VoteToggle);
