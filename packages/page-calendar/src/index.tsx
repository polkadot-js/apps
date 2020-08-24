// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Approvals, Balance, BlockNumber } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import React from 'react';
import styled from 'styled-components';

import Month from './Month';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function CalendarApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <main>
      <Month />
    </main>
  );
}

export default React.memo(styled(CalendarApp)``);
