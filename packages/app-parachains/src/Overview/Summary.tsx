// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

function Summary ({ t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const nextFreeId = useCall<BN>(api.query.parachains.nextFreeId, []);
  const parachains = useCall<BN[]>(api.query.registrar.parachains || api.query.parachains.parachains, []);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('parachains')}>
          {formatNumber(parachains?.length)}
        </CardSummary>
      </section>
      {nextFreeId && (
        <section>
          <CardSummary label={t('next id')}>
            {formatNumber(nextFreeId)}
          </CardSummary>
        </section>
      )}
    </SummaryBox>
  );
}

export default translate(Summary);
