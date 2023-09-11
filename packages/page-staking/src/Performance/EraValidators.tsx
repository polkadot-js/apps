// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, CardSummary, SummaryBox, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { useEraValidators } from './useEraValidators.js';

type Props = {
  session: number;
};

function EraValidators ({ session }: Props) {
  const { t } = useTranslation();
  const eraValidatorsAddresses = useEraValidators(session);

  const messageOnEmpty = eraValidatorsAddresses && t("Data isn't available.");

  return (
    <>
      <SummaryBox>
        <section>
          <CardSummary label={t<string>('era validators')}>
            <span className={eraValidatorsAddresses ? '' : '--tmp'}>
              {eraValidatorsAddresses?.length ?? '0'}
            </span>
          </CardSummary>
        </section>
      </SummaryBox>
      <Table empty={messageOnEmpty}>
        {eraValidatorsAddresses?.map((address) => (
          <tr key={address}>
            <td><AddressSmall value={address} /></td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default EraValidators;
