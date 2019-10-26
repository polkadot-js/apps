/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React from 'react';
import { Columar, Column } from '@polkadot/react-components';

import translate from '../translate';
import Candidate from './Candidate';
import Member from './Member';

interface Props extends I18nProps, ComponentProps {}

function Members ({ electionsInfo: { candidates, members }, t }: Props): React.ReactElement<Props> {
  return (
    <Columar>
      <Column
        emptyText={t('No members found')}
        headerText={t('members')}
      >
        {members.map((address): React.ReactNode => (
          <Member
            address={address}
            key={address.toString()}
          />
        ))}
      </Column>
      <Column
        emptyText={t('No candidates found')}
        headerText={t('candidates')}
      >
        {candidates.map((address): React.ReactNode => (
          <Candidate
            address={address}
            key={address.toString()}
          />
        ))}
      </Column>
    </Columar>
  );
}

export default translate(Members);
