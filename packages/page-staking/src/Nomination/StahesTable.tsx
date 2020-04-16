import React, { useCallback, useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components/index';
import NominatedAccount from '@polkadot/app-staking/Nomination/NominatedAccount';
import { useApi, useCall } from '@polkadot/react-hooks/index';
import { useTranslation } from '@polkadot/app-staking/translate';
import { ActiveEraInfo, EraIndex } from '@polkadot/types/interfaces';
import { Option } from '@polkadot/types';
import { DeriveStakingOverview, DeriveStakerReward } from '@polkadot/api-derive/types';

interface Props {
  allRewards?: Record<string, DeriveStakerReward[]>;
  controllerAccountId?: string | null;
  className?: string;
  allStashes?: string[];
  isVisible: boolean;
  next?: string[];
  stakingOverview?: DeriveStakingOverview;
  ownStashes?: [string, boolean][];
  onUpdateControllerState: (controllerAlreadyBonded: boolean) => void;
  onUpdateNominatedState: (controllerAlreadyBonded: boolean) => void;
}

function StashesTable({ className, allStashes, isVisible, next, allRewards, stakingOverview, controllerAccountId, ownStashes, onUpdateControllerState, onUpdateNominatedState }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});
  const activeEra = useCall<EraIndex | undefined>(api.query.staking?.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>): EraIndex | undefined =>
      activeEra.isSome
        ? activeEra.unwrap().index
        : undefined
  });

  const _onUpdateType = useCallback(
    (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other'): void =>
      setStashTypes((stashTypes: Record<string, number>) => ({
        ...stashTypes,
        [stashId]: type === 'validator'
          ? 1
          : type === 'nominator'
            ? 5
            : 9
      })),
    []
  );

  useEffect((): void => {
    ownStashes && setFoundStashes(
      ownStashes.sort((a, b): number =>
        (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99)
      )
    );
  }, [ownStashes, stashTypes]);
  console.log('Stashes');
  return (
    <Table className={className}>
      <Table.Head>
        <th className='start'><h1>{t('your accounts')}</h1></th>
        <th className='address'>{t('controller')}</th>
        <th className='number'>{t('rewards')}</th>
        <th className='number'>{t('bonded')}</th>
        <th colSpan={2}>&nbsp;</th>
      </Table.Head>
      <Table.Body empty={t('No funds staked yet. Bond funds to validate or nominate a validator.')}>
        {foundStashes?.map(([stashId, isOwnStash]): React.ReactNode => (
          <NominatedAccount
            selectedControllerId={controllerAccountId}
            activeEra={activeEra}
            allStashes={allStashes}
            isOwnStash={isOwnStash}
            isVisible={isVisible}
            key={stashId}
            next={next}
            onUpdateType={_onUpdateType}
            onUpdateControllerState={onUpdateControllerState}
            onUpdateNominatedState={onUpdateNominatedState}
            rewards={allRewards && allRewards[stashId]}
            stakingOverview={stakingOverview}
            stashId={stashId}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

export default React.memo(StashesTable);
