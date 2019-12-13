// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';
import { useLocation } from 'react-router-dom';

import Members from './Members';

import translate from '../translate';

interface Props extends I18nProps, ComponentProps {
  className?: string;
}

function Overview ({ t, electionsInfo, allVotes = {}, className }: Props): React.ReactElement<Props> {
  const { pathname } = useLocation();

  return (
    <div className={className}>
      <h1>{t('council members')}</h1>
      <Members
        allVotes={allVotes}
        className={pathname === '/council' ? '' : 'council--hidden'}
        electionsInfo={electionsInfo}
      />
    </div>
  );
}

export default translate(Overview);
