// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { LeaseInfo, LeasePeriod, QueuedAction } from '../types.js';

import React, { useMemo } from 'react';

import { AddressSmall, ParaLink, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

import Lifecycle from '../Overview/Lifecycle.js';
// import ParachainInfo from '../Overview/ParachainInfo.js';
import Periods from '../Overview/Periods.js';
import { useTranslation } from '../translate.js';
import useThreadInfo from './useThreadInfo.js';

interface Props {
  id: ParaId;
  leasePeriod: LeasePeriod;
  leases: LeaseInfo[];
  nextAction?: QueuedAction;
}

function Parathread ({ id, leasePeriod, leases, nextAction }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isAccount } = useAccounts();
  const { headHex, lifecycle, manager } = useThreadInfo(id);

  const periods = useMemo(
    () => leasePeriod?.currentPeriod && leases?.map(({ period }) => period),
    [leasePeriod?.currentPeriod, leases]
  );

  const isManager = isAccount(manager?.toString());

  return (
    <tr>
      <Table.Column.Id value={id} />
      <td className='badge'><ParaLink id={id} /></td>
      <td className='address media--2000'>{manager && <AddressSmall value={manager} />}</td>
      <td className='start together hash media--1500'>
        <div className='shortHash'>{headHex}</div>
      </td>
      <td className='start'>
        <Lifecycle
          lifecycle={lifecycle}
          nextAction={nextAction}
        />
      </td>
      <td className='all' />
      <td className='number no-pad-left'>
        {/* <!-- ParachainInfo id={id} /--> */}
      </td>
      <td className='number together'>
        {leasePeriod && leases && periods && (
          leases.length
            ? (
              <Periods
                fromFirst
                leasePeriod={leasePeriod}
                periods={periods}
              />
            )
            : t('None')
        )}
      </td>
      <td className='button media--900'>
        <TxButton
          accountId={manager}
          icon='times'
          isDisabled={!isManager}
          label={t('Deregister')}
          params={[id]}
          tx={api.tx.registrar.deregister}
        />
      </td>
    </tr>
  );
}

export default React.memo(Parathread);
