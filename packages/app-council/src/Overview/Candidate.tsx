// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressCard, Badge, Icon } from '@polkadot/react-components';

import translate from '../translate';
import Voters from './Voters';

interface Props extends I18nProps {
  address: AccountId;
  isRunnerUp?: boolean;
  voters?: AccountId[];
}

function Candidate ({ address, isRunnerUp, t, voters }: Props): React.ReactElement<Props> {
  return (
    <AddressCard
      defaultName={isRunnerUp ? t('runner up') : t('candidate')}
      iconInfo={isRunnerUp && (
        <Badge
          hover={t('Runner up')}
          info={<Icon name='chevron down' />}
          isTooltip
          type='runnerup'
        />
      )}
      value={address}
      withIndexOrAddress
    >
      {voters && voters.length !== 0 && (
        <Voters voters={voters} />
      )}
    </AddressCard>
  );
}

export default translate(Candidate);
