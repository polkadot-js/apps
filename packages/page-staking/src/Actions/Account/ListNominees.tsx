// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import useInactives from '../useInactives';

interface Props {
  nominating?: string[];
  stashId: string;
}

function ListNominees ({ nominating, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting } = useInactives(stashId, nominating);

  const max = api.consts.staking?.maxNominatorRewardedPerValidator?.toString();

  return (
    <>
      {nomsOver && nomsOver.length !== 0 && (
        <Expander
          className='stakeOver'
          help={t<string>('These validators are active but only the top {{max}} nominators by backing stake will be receiving rewards. The nominating stash is not one of those to be rewarded in the current era.', { replace: max })}
          summary={t<string>('Oversubscribed nominations ({{count}})', { replace: { count: nomsOver.length } })}
        >
          {nomsOver.map((nomineeId, index): React.ReactNode => (
            <AddressMini
              key={index}
              value={nomineeId}
              withBalance={false}
            />
          ))}
        </Expander>
      )}
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
          help={t<string>('The elected validator list that did not get selected by the Phragmen algorithm for this era. However they may be selected in the future.')}
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
          help={t<string>('The validators that got slashed and for which your nomination got auto-chilled. Re-nominating these will make them available to the Phragmen algorithm.')}
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
          help={t<string>('The validators that are not in the validator set because they need more nominations or because they have willingly stop validating. Any nominations made before the next election will also appear here.')}
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
