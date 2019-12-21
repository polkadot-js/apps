// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from './types';

import React from 'react';

import InputAddress from './InputAddress';
import translate from './translate';

interface Props extends I18nProps {
  onChange: (value: string | null) => void;
}

function VoteAccount ({ className, onChange, t }: Props): React.ReactElement<Props> {
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

export default translate(VoteAccount);
