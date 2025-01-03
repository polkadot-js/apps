// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraExposure, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { AddressMini, ExpanderScroll, MarkWarning } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { isFunction, isToBn } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import useInactives from '../useInactives.js';

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
      // NOTE Some chains have non-standard implementations, without value
      if (o.who.eq(stashId) && isToBn(o.value)) {
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
            withBalance={!!eraExposure && !!nomBalanceMap[nomineeId]}
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
  const eraExposure = useCall<DeriveEraExposure>(isFunction(api.query.staking.erasStakers) && api.derive.staking.eraExposure, [sessionInfo?.activeEra]);

  const [renActive, renChilled, renInactive, renOver, renWaiting] = useMemo(
    () => [renderNominators(stashId, nomsActive, eraExposure), renderNominators(stashId, nomsChilled), renderNominators(stashId, nomsInactive), renderNominators(stashId, nomsOver), renderNominators(stashId, nomsWaiting)],
    [eraExposure, nomsActive, nomsChilled, nomsInactive, nomsOver, nomsWaiting, stashId]
  );

  return (
    <>
      {renOver && (
        <ExpanderScroll
          className='stakeOver'
          renderChildren={renOver[1]}
          summary={t('Oversubscribed nominations ({{count}})', { replace: { count: renOver[0] } })}
        />
      )}
      {renActive && (
        <ExpanderScroll
          renderChildren={renActive[1]}
          summary={t('Active nominations ({{count}})', { replace: { count: renActive[0] } })}
        />
      )}
      {renInactive && (
        <ExpanderScroll
          renderChildren={renInactive[1]}
          summary={t('Inactive nominations ({{count}})', { replace: { count: renInactive[0] } })}
        />
      )}
      {renChilled && (
        <ExpanderScroll
          renderChildren={renChilled[1]}
          summary={t('Renomination required ({{count}})', { replace: { count: renChilled[0] } })}
        />
      )}
      {renWaiting && (
        <ExpanderScroll
          renderChildren={renWaiting[1]}
          summary={t('Waiting nominations ({{count}})', { replace: { count: renWaiting[0] } })}
        />
      )}
      {nomsActive && nomsInactive && (nomsActive.length === 0) && (nomsInactive.length !== 0) && (
        <MarkWarning content={t('This could mean your nomination has not been applied to any validator in the active set by the election algorithm or it has been applied against a validator who is either oversubscribed or chilled.')} />
      )}
    </>
  );
}

export default React.memo(ListNominees);
