// Copyright 2017-2022 @polkadot/app-uniquests authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletUniquesInstanceDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Option } from '@polkadot/types-codec';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import Transfer from './Transfer';
import Bool from '@polkadot/react-params/Param/Bool';

interface Props {
  instance: [BN, PalletUniquesInstanceDetails][];
  uniqueId: BN;
}

function Instance ({ instance, uniqueId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  console.log(instance);
  
  let owner = "";

  

  return (
    <tr className={uniqueId.toString()}>
      <td className='address'>
        <AddressSmall value={owner} />
      </td>

      <td className='button'>
        {/* suspicious */}
        <Transfer
          accountId={owner.toString()}
          uniqueId={uniqueId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Instance);
