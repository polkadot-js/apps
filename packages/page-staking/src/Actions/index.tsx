// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActiveEraInfo, EraIndex } from '@polkadot/types/interfaces';
import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets } from '../types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { Option } from '@polkadot/types';
import { BN_ZERO } from '@polkadot/util';

import ElectionBanner from '../ElectionBanner';
import { useTranslation } from '../translate';
import Account from './Account';
import NewNominator from './NewNominator';
import NewStash from './NewStash';
import NewValidator from './NewValidator';

interface Props {
  className?: string;
  isInElection?: boolean;
  ownStashes?: StakerState[];
  next?: string[];
  validators?: string[];
  targets: SortedTargets;
}

interface State {
  bondedTotal?: BN;
  foundStashes?: StakerState[];
}

function sortStashes (a: StakerState, b: StakerState): number {
  return (a.isStashValidating ? 1 : (a.isStashNominating ? 5 : 99)) - (b.isStashValidating ? 1 : (b.isStashNominating ? 5 : 99));
}

function extractState (ownStashes: StakerState[]): State {
  return {
    bondedTotal: ownStashes.reduce((total: BN, { stakingLedger }) =>
      stakingLedger
        ? total.add(stakingLedger.total.unwrap())
        : total,
    BN_ZERO),
    foundStashes: ownStashes.sort(sortStashes)
  };
}

function Actions ({ className = '', isInElection, next, ownStashes, targets, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeEra = useCall<EraIndex | undefined>(api.query.staking?.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>) => activeEra.unwrapOr({ index: undefined }).index
  });
  const [{ bondedTotal, foundStashes }, setState] = useState<State>({});

  useEffect((): void => {
    ownStashes && setState(extractState(ownStashes));
  }, [ownStashes]);

  const header = useMemo(() => [
    [t('stashes'), 'start'],
    [t('controller'), 'address'],
    [t('rewards'), 'number ui--media-1200'],
    [t('bonded'), 'number'],
    [undefined, undefined, 2]
  ], [t]);

  const footer = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <td className='number'>
        {bondedTotal && <FormatBalance value={bondedTotal} />}
      </td>
      <td colSpan={2} />
    </tr>
  ), [bondedTotal]);

  return (
    <div className={className}>
      <Button.Group>
        <NewNominator
          isInElection={isInElection}
          next={next}
          targets={targets}
          validators={validators}
        />
        <NewValidator isInElection={isInElection} />
        <NewStash />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={foundStashes && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        footer={footer}
        header={header}
      >
        {foundStashes?.map((info): React.ReactNode => (
          <Account
            activeEra={activeEra}
            info={info}
            isDisabled={isInElection}
            key={info.stashId}
            next={next}
            targets={targets}
            validators={validators}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Actions);
