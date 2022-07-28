// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType, Rule } from '../types';

import React from 'react';

import { CardSummary, Spinner, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: MemberType[];
  rule?: Rule;
}

function Summary ({ className, members, rule }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  // TODO Turn rule into IPFS link
  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('rule')}>
        {rule
          ? rule.hasRule
            ? t<string>('yes')
            : t<string>('no')
          : <Spinner />
        }
      </CardSummary>
      <CardSummary label={t<string>('members')}>
        {members
          ? formatNumber(members.length)
          : <Spinner />
        }
      </CardSummary>
    </SummaryBox>
  );
}

export default React.memo(Summary);
