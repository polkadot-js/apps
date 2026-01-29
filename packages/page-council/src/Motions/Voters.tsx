// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, MemberCount } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  isAye?: boolean;
  members: string[];
  votes: AccountId[];
  threshold: MemberCount;
}

function Voters ({ isAye, members, threshold, votes }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const count = useMemo(
    (): string => {
      const num = threshold.toNumber();
      const max = isAye
        ? num
        : members?.length
          ? (members.length - num) + 1
          : 0;

      return `${votes.length}${max ? `/${max}` : ''}`;
    },
    [isAye, members, threshold, votes]
  );

  const renderVotes = useCallback(
    () => votes?.map((address): React.ReactNode => (
      <AddressMini
        key={address.toString()}
        value={address}
        withBalance={false}
      />
    )),
    [votes]
  );

  if (!count || !votes.length) {
    return null;
  }

  return (
    <ExpanderScroll
      renderChildren={renderVotes}
      summary={
        isAye
          ? t('Aye {{count}}', { replace: { count } })
          : t('Nay {{count}}', { replace: { count } })
      }
    />
  );
}

export default React.memo(Voters);
