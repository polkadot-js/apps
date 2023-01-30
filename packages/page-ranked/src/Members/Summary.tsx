// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: MemberType[];
}

function Summary ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('members')}>
        {members === undefined
          ? <span className='--tmp'>99</span>
          : formatNumber(members.length)
        }
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
