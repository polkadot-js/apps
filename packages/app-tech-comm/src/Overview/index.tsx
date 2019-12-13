// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';

import translate from '../translate';
import Members from './Members';

interface Props extends I18nProps, ComponentProps {}

function Overview ({ className, members, t }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <h1>{t('technical committee members')}</h1>
      <Members members={members} />
    </div>
  );
}

export default translate(Overview);
