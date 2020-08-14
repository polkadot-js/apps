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
  const { nomsActive, nomsChilled, nomsInactive, nomsWaiting } = useInactives(stashId, nominating);

  return (
    <>
      {nomsActive && nomsActive.length !== 0 && (
        <Expander
          help={t<string>('The validators selected by the Phragmen algorithm to nominate for this era.')}
          summary={t<string>('Active nominations ({{count}})', { replace: { count: nomsActive.length } })}
        >
          {nomsActive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsInactive && nomsInactive.length !== 0 && (
        <Expander
          help={t<string>('The active validator list from which the algorithm can select for upcomming eras.')}
          summary={t<string>('Inactive nominations ({{count}})', { replace: { count: nomsInactive.length } })}
        >
          {nomsInactive.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsChilled && nomsChilled.length !== 0 && (
        <Expander
          help={t<string>('The validators that will never be selected again by the Phragmen algorithm. Either because they stopped validating, or because they got slashed while you were one of their nominator. If you wish to nominate them again, you need to manually select them again.')}
          summary={t<string>('Renomination required ({{count}})', { replace: { count: nomsChilled.length } })}
        >
          {nomsChilled.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
      {nomsWaiting && nomsWaiting.length !== 0 && (
        <Expander
          help={t<string>('The validators that are not in the validator set. More nominations are required for them to get in.')}
          summary={t<string>('Waiting nominations ({{count}})', { replace: { count: nomsWaiting.length } })}
        >
          {nomsWaiting.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
    </>
  );
}

export default React.memo(ListNominees);
