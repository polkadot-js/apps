// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, MemberCount } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

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

  if (!count || !votes.length) {
    return null;
  }

  return (
    <Expander
      summary={
        isAye
          ? t<string>('Aye {{count}}', { replace: { count } })
          : t<string>('Nay {{count}}', { replace: { count } })
      }
    >
      {votes.map((address): React.ReactNode => (
        <AddressMini
          key={address.toString()}
          value={address}
          withBalance={false}
        />
      ))}
    </Expander>
  );
}

export default React.memo(Voters);
