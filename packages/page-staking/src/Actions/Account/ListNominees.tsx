// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import useInactives from '../useInactives';

interface Props {
  nominating?: string[];
  stashId: string;
}

function ListNominees ({ nominating, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { nomsActive, nomsInactive, nomsWaiting } = useInactives(stashId, nominating);

  return (
    <>
      {nomsActive && nomsActive.length !== 0 && (
        <Expander summary={t('Active nominations ({{count}})', { replace: { count: nomsActive.length } })}>
          {nomsActive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
              withBonded
            />
          ))}
        </Expander>
      )}
      {nomsInactive && nomsInactive.length !== 0 && (
        <Expander summary={t('Inactive nominations ({{count}})', { replace: { count: nomsInactive.length } })}>
          {nomsInactive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
              withBonded
            />
          ))}
        </Expander>
      )}
      {nomsWaiting && nomsWaiting.length !== 0 && (
        <Expander summary={t('Waiting nominations ({{count}})', { replace: { count: nomsWaiting.length } })}>
          {nomsWaiting.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
              withBonded
            />
          ))}
        </Expander>
      )}
    </>
  );
}

export default React.memo(ListNominees);
