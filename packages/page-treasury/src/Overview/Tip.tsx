// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OpenTip } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall, AddressMini, Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import TipEndorse from './TipEndorse';
import TipReason from './TipReason';

interface Props {
  className?: string;
  hash: string;
  isMember: boolean;
  members: string[];
}

function Tip ({ className, hash, isMember, members }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const tip = useCall<OpenTip | null>(api.query.treasury.tips, [hash], {
    transform: (optTip: Option<OpenTip>) => optTip.unwrapOr(null)
  });

  if (!tip) {
    return null;
  }

  const { finder, reason, tips, who } = tip;
  const finderInfo = finder.unwrapOr(null);

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={who} />
      </td>
      <td className='address'>
        {finderInfo && (
          <AddressMini value={finderInfo[0]} />
        )}
      </td>
      <td className='number'>
        {finderInfo && (
          <FormatBalance value={finderInfo[1]} />
        )}
      </td>
      <TipReason hash={reason} />
      <td className='start all'>
        {tips.length !== 0 && (
          <Expander summary={t('Endorsements ({{count}})', { replace: { count: tips.length } })}>
            {tips.map(([tipper, balance]) => (
              <AddressMini
                balance={balance}
                key={tipper.toString()}
                value={tipper}
                withBalance
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='button'>
        <TipEndorse
          hash={hash}
          isMember={isMember}
          members={members}
        />
      </td>
    </tr>
  );
}

export default React.memo(Tip);
