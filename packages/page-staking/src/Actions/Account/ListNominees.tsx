// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraExposure, DeriveSessionIndexes } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useMemo } from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import useInactives from '../useInactives';

interface Props {
  nominating?: string[];
  stashId: string;
}

const EMPTY_MAP = {};

function mapExposure (stashId: string, all: string[], eraExposure?: DeriveEraExposure): Record<string, BN> {
  if (!eraExposure?.validators) {
    return EMPTY_MAP;
  }

  const nomBalanceMap: Record<string, BN> = {};

  // for every active nominee
  all.forEach((nom) => {
    // cycle through its nominator to find our current stash
    eraExposure.validators[nom]?.others.some((o) => {
      if (o.who.eq(stashId)) {
        nomBalanceMap[nom] = o.value.toBn();

        return true;
      }

      return false;
    });
  });

  return nomBalanceMap;
}

function renderNominators (stashId: string, all: string[] = [], eraExposure?: DeriveEraExposure): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      (): React.ReactNode[] => {
        const nomBalanceMap = mapExposure(stashId, all, eraExposure);

        return all.map((nomineeId, index): React.ReactNode => (
          <AddressMini
            balance={nomBalanceMap[nomineeId]}
            key={index}
            value={nomineeId}
            withBalance={!!eraExposure}
          />
        ));
      }
    ]
    : null;
}

function ListNominees ({ nominating, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting } = useInactives(stashId, nominating);
  const sessionInfo = useCall<DeriveSessionIndexes>(api.query.staking && api.derive.session?.indexes);
  const eraExposure = useCall<DeriveEraExposure>(api.query.staking.erasStakers && api.derive.staking.eraExposure, [sessionInfo?.activeEra]);
  const [renActive, renChilled, renInactive, renOver, renWaiting] = useMemo(
    () => [renderNominators(stashId, nomsActive, eraExposure), renderNominators(stashId, nomsChilled), renderNominators(stashId, nomsInactive), renderNominators(stashId, nomsOver), renderNominators(stashId, nomsWaiting)],
    [eraExposure, nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting, stashId]
  );

  return (
    <>
      {renOver && (
        <Expander
          className='stakeOver'
          help={t<string>('These validators are active but only the top {{max}} nominators by backing stake will be receiving rewards. The nominating stash is not one of those to be rewarded in the current era.', { replace: api.consts.staking?.maxNominatorRewardedPerValidator?.toString() })}
          renderChildren={renOver[1]}
          summary={t<string>('Oversubscribed nominations ({{count}})', { replace: { count: renOver[0] } })}
        />
      )}
      {renActive && (
        <Expander
          help={t<string>('The validators selected by the Phragmen algorithm to nominate for this era.')}
          renderChildren={renActive[1]}
          summary={t<string>('Active nominations ({{count}})', { replace: { count: renActive[0] } })}
        />
      )}
      {renInactive && (
        <Expander
          help={t<string>('The elected validator list that did not get selected by the Phragmen algorithm for this era. However they may be selected in the future.')}
          renderChildren={renInactive[1]}
          summary={t<string>('Inactive nominations ({{count}})', { replace: { count: renInactive[0] } })}
        />
      )}
      {renChilled && (
        <Expander
          help={t<string>('The validators that got slashed and for which your nomination got auto-chilled. Re-nominating these will make them available to the Phragmen algorithm.')}
          renderChildren={renChilled[1]}
          summary={t<string>('Renomination required ({{count}})', { replace: { count: renChilled[0] } })}
        />
      )}
      {renWaiting && (
        <Expander
          help={t<string>('The validators that are not in the validator set because they need more nominations or because they have willingly stop validating. Any nominations made before the next election will also appear here.')}
          renderChildren={renWaiting[1]}
          summary={t<string>('Waiting nominations ({{count}})', { replace: { count: renWaiting[0] } })}
        />
      )}
    </>
  );
}

export default React.memo(ListNominees);
