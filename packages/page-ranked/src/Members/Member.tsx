// Copyright 2017-2025 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { Member as MemberType } from '../types.js';

import React from 'react';

import { AddressSmall, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  value: MemberType;
}

const COLOR_LST: FlagColor[] = ['grey', 'grey', 'yellow', 'orange', 'purple', 'blue', 'green', 'black'];
const COLOR_DEF = COLOR_LST[COLOR_LST.length - 1];

function Member ({ className, value: { accountId, info: { rank } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='address all relative'>
        <AddressSmall value={accountId} />
        <Tag
          className='absolute'
          color={COLOR_LST[rank.toNumber()] || COLOR_DEF}
          hover={t('Membership rank')}
          label={rank.toString()}
        />
      </td>
    </tr>
  );
}

export default React.memo(Member);
