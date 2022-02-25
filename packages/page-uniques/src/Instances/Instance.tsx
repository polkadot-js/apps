// Copyright 2017-2022 @polkadot/app-uniquests authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import type { PalletUniquesInstanceDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

// import { useTranslation } from '../translate';
import Transfer from './Transfer';
import { UniqueInstanceInfo } from '../types';

interface Props {
  instance: UniqueInstanceInfo;
  classId: BN;
}

function Instance ({ instance, classId }: Props): React.ReactElement<Props> {
  // const { t } = useTranslation();

  console.log(instance);
  
  let owner = "";

  

  return (
    <tr className={classId.toString()}>
      <td className='address'>
        <AddressSmall value={owner} />
      </td>

      <td className='button'>
        {/* suspicious */}
        <Transfer
          accountId={owner.toString()}
          classId={classId}
        />
      </td>
    </tr>
  );
}

export default React.memo(Instance);
