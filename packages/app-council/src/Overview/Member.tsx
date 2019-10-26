// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressCard } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  address: AccountId;
}

function Member ({ address, t }: Props): React.ReactElement<Props> {
  return (
    <AddressCard
      defaultName={t('council member')}
      value={address}
    />
  );
}

export default translate(Member);
