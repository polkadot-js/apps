// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '../types';

import React from 'react';

import { useTranslation } from '../translate';
import Members from './Members';

export default function Overview ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h1>{t('technical committee members')}</h1>
      <Members members={members} />
    </div>
  );
}
