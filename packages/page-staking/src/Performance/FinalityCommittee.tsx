// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AddressSmall, CardSummary, SummaryBox, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { useFinalityCommittee } from './useFinalityCommittee.js';

type Props = {
  session: number;
};

function FinalityCommittee ({ session }: Props) {
  const { t } = useTranslation();
  const finalityCommitteeAddresses = useFinalityCommittee(session);

  const messageOnEmpty = finalityCommitteeAddresses && t("Data isn't available.");

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('finality committee size')}>
            <span className={finalityCommitteeAddresses ? '' : '--tmp'}>
              {finalityCommitteeAddresses?.length ?? '0'}
            </span>
          </CardSummary>
        </section>
      </SummaryBox>
      <Table empty={messageOnEmpty}>
        {finalityCommitteeAddresses?.map((address) => (
          <tr key={address}>
            <td><AddressSmall value={address} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default FinalityCommittee;
