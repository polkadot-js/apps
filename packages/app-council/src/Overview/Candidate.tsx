// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressCard } from '@polkadot/react-components';

import translate from '../translate';
import Voters from './Voters';

interface Props extends I18nProps {
  address: AccountId;
  voters?: AccountId[];
}

function Candidate ({ address, t, voters }: Props): React.ReactElement<Props> {
  return (
    <AddressCard
      defaultName={t('candidate')}
      value={address}
    >
      <Voters voters={voters} />
    </AddressCard>
  );
}

export default translate(Candidate);
