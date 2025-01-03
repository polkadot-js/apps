// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerReward } from '@polkadot/api-derive/types';
import type { OwnPool } from '@polkadot/app-staking2/Pools/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { PayoutStash, PayoutValidator } from './types.js';

import React, { useMemo, useRef, useState } from 'react';

import { Button, MarkWarning, styled, Table, ToggleGroup } from '@polkadot/react-components';
import { useApi, useBlockInterval, useCall, useOwnEraRewards } from '@polkadot/react-hooks';
import { BN, BN_THREE } from '@polkadot/util';

import ElectionBanner from '../ElectionBanner.js';
import { useTranslation } from '../translate.js';
import PayButton from './PayButton.js';
import Stash from './Stash.js';
import Validator from './Validator.js';

interface Props {
  className?: string;
  historyDepth?: BN;
  isInElection?: boolean;
  ownPools?: OwnPool[];
  ownValidators: StakerState[];
}

interface Available {
  stashAvail?: BN | null;
  stashes?: PayoutStash[];
  valAvail?: BN | null;
  valTotal?: BN | null;
  validators?: PayoutValidator[];
}

interface EraSelection {
  value: number;
  text: string;
}

const DAY_SECS = new BN(1000 * 60 * 60 * 24);

function groupByValidator (allRewards: Record<string, DeriveStakerReward[]>): PayoutValidator[] {
  return Object
    .entries(allRewards)
    .reduce((grouped: PayoutValidator[], [stashId, rewards]): PayoutValidator[] => {
      rewards
        .forEach((reward): void => {
          Object
            .entries(reward.validators)
            .forEach(([validatorId, { total, value }]): void => {
              const entry = grouped.find((entry) => entry.validatorId === validatorId);

              if (entry) {
                const eraEntry = entry.eras.find((entry) => entry.era.eq(reward.era));

                if (eraEntry) {
                  eraEntry.stashes[stashId] = value;
                } else {
                  entry.eras.push({
                    era: reward.era,
                    stashes: { [stashId]: value }
                  });
                }

                entry.available = entry.available.add(value);
                entry.total = entry.total.add(total);
              } else {
                grouped.push({
                  available: value,
                  eras: [{
                    era: reward.era,
                    stashes: { [stashId]: value }
                  }],
                  total,
                  validatorId
                });
              }
            });
        });

      return grouped;
    }, [])
    .sort((a, b) => b.available.cmp(a.available));
}

function extractStashes (allRewards: Record<string, DeriveStakerReward[]>): PayoutStash[] {
  return Object
    .entries(allRewards)
    .map(([stashId, rewards]): PayoutStash => ({
      available: rewards.reduce((result, { validators }) =>
        Object.values(validators).reduce((result, { value }) =>
          result.iadd(value), result), new BN(0)
      ),
      rewards,
      stashId
    }))
    .filter(({ available }) => !available.isZero())
    .sort((a, b) => b.available.cmp(a.available));
}

function getAvailable (allRewards: Record<string, DeriveStakerReward[]> | null | undefined): Available {
  if (allRewards) {
    const stashes = extractStashes(allRewards);
    const validators = groupByValidator(allRewards);
    const stashAvail = stashes.length
      ? stashes.reduce<BN>((a, { available }) => a.iadd(available), new BN(0))
      : null;
    const [valAvail, valTotal] = validators.length
      ? validators.reduce<[BN, BN]>(([a, t], { available, total }) => [a.iadd(available), t.iadd(total)], [new BN(0), new BN(0)])
      : [null, null];

    return {
      stashAvail,
      stashes,
      valAvail,
      valTotal,
      validators
    };
  }

  return {};
}

function getOptions (blockTime: BN, eraLength: BN | undefined, historyDepth: BN | undefined, t: (key: string, options?: { replace: Record<string, unknown> }) => string): EraSelection[] {
  if (!eraLength || !historyDepth) {
    return [{ text: '', value: 0 }];
  }

  const blocksPerDay = DAY_SECS.div(blockTime);
  const maxBlocks = eraLength.mul(historyDepth);
  const eraSelection: EraSelection[] = [];
  const days = new BN(2);

  while (true) {
    const dayBlocks = blocksPerDay.mul(days);

    if (dayBlocks.gte(maxBlocks)) {
      break;
    }

    eraSelection.push({
      text: t('{{days}} days', { replace: { days: days.toString() } }),
      value: dayBlocks.div(eraLength).toNumber()
    });

    days.imul(BN_THREE);
  }

  eraSelection.push({
    text: t('Max, {{eras}} eras', { replace: { eras: historyDepth.toNumber() } }),
    value: historyDepth.toNumber()
  });

  return eraSelection;
}

function Payouts ({ className = '', historyDepth, isInElection, ownPools, ownValidators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [hasOwnValidators] = useState(() => ownValidators.length !== 0);
  const [myStashesIndex, setMyStashesIndex] = useState(() => hasOwnValidators ? 0 : 1);
  const [eraSelectionIndex, setEraSelectionIndex] = useState(0);
  const eraLength = useCall<BN>(api.derive.session.eraLength);
  const blockTime = useBlockInterval();

  const poolStashes = useMemo(
    () => ownPools?.map(({ stashId }) => stashId),
    [ownPools]
  );

  const eraSelection = useMemo(
    () => getOptions(blockTime, eraLength, historyDepth, t),
    [blockTime, eraLength, historyDepth, t]
  );

  const { allRewards, isLoadingRewards } = useOwnEraRewards(eraSelection[eraSelectionIndex].value, myStashesIndex ? undefined : ownValidators, poolStashes);

  const { stashAvail, stashes, valAvail, validators } = useMemo(
    () => getAvailable(allRewards),
    [allRewards]
  );

  const headerStashes = useMemo<[React.ReactNode?, string?, number?][]>(
    () => [
      [myStashesIndex ? t('payout/stash') : t('overall/validator'), 'start', 2],
      [t('eras'), 'start'],
      [myStashesIndex ? t('own') : t('total')],
      [('remaining')],
      [undefined, undefined, 3]
    ],
    [myStashesIndex, t]
  );

  const headerValidatorsRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('payout/validator'), 'start', 2],
    [t('eras'), 'start'],
    [t('own')],
    [('remaining')],
    [undefined, undefined, 3]
  ]);

  const valOptions = useMemo(() => [
    { isDisabled: !hasOwnValidators, text: t('Own validators'), value: 'val' },
    { text: t('Own stashes'), value: 'all' }
  ], [hasOwnValidators, t]);

  const footerStash = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <Table.Column.Balance value={stashAvail} />
      <td colSpan={4} />
    </tr>
  ), [stashAvail]);

  const footerVal = useMemo(() => (
    <tr>
      <td colSpan={3} />
      <Table.Column.Balance value={valAvail} />
      <td colSpan={4} />
    </tr>
  ), [valAvail]);

  return (
    <StyledDiv className={className}>
      <Button.Group>
        <ToggleGroup
          onChange={setMyStashesIndex}
          options={valOptions}
          value={myStashesIndex}
        />
        <ToggleGroup
          onChange={setEraSelectionIndex}
          options={eraSelection}
          value={eraSelectionIndex}
        />
        <PayButton
          isAll
          isDisabled={isInElection}
          payout={validators}
        />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      {!isLoadingRewards && !stashes?.length && (
        <MarkWarning
          className='warning centered'
          withIcon={false}
        >
          <p>{t('Payouts of rewards for a validator can be initiated by any account. This means that as soon as a validator or nominator requests a payout for an era, all the nominators for that validator will be rewarded. Each user does not need to claim individually and the suggestion is that validators should claim rewards for everybody as soon as an era ends.')}</p>
          <p>{t('If you have not claimed rewards straight after the end of the era, the validator is in the active set and you are seeing no rewards, this would mean that the reward payout transaction was made by another account on your behalf. Always check your favorite explorer to see any historic payouts made to your accounts.')}</p>
        </MarkWarning>
      )}
      <Table
        empty={!isLoadingRewards && stashes && (
          myStashesIndex
            ? t('No pending payouts for your stashes')
            : t('No pending payouts for your validators')
        )}
        emptySpinner={t('Retrieving info for the selected eras, this will take some time')}
        footer={footerStash}
        header={headerStashes}
        isFixed
      >
        {!isLoadingRewards && stashes?.map((payout): React.ReactNode => (
          <Stash
            historyDepth={historyDepth}
            key={payout.stashId}
            payout={payout}
          />
        ))}
      </Table>
      {(myStashesIndex === 1) && !isLoadingRewards && validators && (validators.length !== 0) && (
        <Table
          footer={footerVal}
          header={headerValidatorsRef.current}
          isFixed
        >
          {!isLoadingRewards && validators.filter(({ available }) => !available.isZero()).map((payout): React.ReactNode => (
            <Validator
              historyDepth={historyDepth}
              isDisabled={isInElection}
              key={payout.validatorId}
              payout={payout}
            />
          ))}
        </Table>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .payout-eras {
    padding-left: 0.25rem;
    vertical-align: middle;

    span {
      white-space: nowrap;
    }
  }
`;

export default React.memo(Payouts);
