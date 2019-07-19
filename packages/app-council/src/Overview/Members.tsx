/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { Columar, Column } from '@polkadot/ui-app';

import translate from '../translate';
import Candidate from './Candidate';
import Member from './Member';

interface Props extends I18nProps, ComponentProps {}

class Members extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { electionsInfo, t } = this.props;
    const { members, candidates } = electionsInfo;

    return (
      <Columar>
        <Column
          emptyText={t('No members found')}
          headerText={t('members')}
        >
          {Object.entries(members).map(([address, block]): React.ReactNode => (
            <Member
              address={address}
              block={block}
              key={address}
            />
          ))}
        </Column>
        <Column
          emptyText={t('No members found')}
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
}

export default translate(Members);
