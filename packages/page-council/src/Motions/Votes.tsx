// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, MemberCount } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  isAye?: boolean;
  members: string[];
  votes: AccountId[];
  threshold: MemberCount;
}

function Votes ({ isAye, members, threshold, votes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [counter, setCounter] = useState('');

  useEffect((): void => {
    const max = isAye
      ? threshold.toNumber()
      : (members.length - threshold.toNumber()) + 1;

    setCounter(`${votes.length}/${max}`);
  }, [isAye, members, threshold, votes]);

  return (
    <td className='address'>
      {counter && votes.length !== 0 && (
        <Expander
          summary={
            isAye
              ? t<string>('Aye {{counter}}', { replace: { counter } })
              : t<string>('Nay {{counter}}', { replace: { counter } })
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
      )}
    </td>
  );
}

export default React.memo(Votes);
