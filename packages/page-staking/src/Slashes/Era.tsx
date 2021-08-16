// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { SlashEra } from './types';

import React, { useCallback, useRef, useState } from 'react';

import { Button, Table, TxButton } from '@polkadot/react-components';
import { useApi, useCollectiveInstance } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import Row from './Row';
import Summary from './Summary';

interface Props {
  buttons: React.ReactNode;
  councilId: string | null;
  councilThreshold: number;
  slash: SlashEra;
}

interface Proposal {
  length: number;
  proposal: SubmittableExtrinsic<'promise'>
}

interface Selected {
  selected: number[];
  txAll: Proposal | null;
  txSome: Proposal | null;
}

function Slashes ({ buttons, councilId, councilThreshold, slash }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const councilMod = useCollectiveInstance('council');
  const [{ selected, txAll, txSome }, setSelected] = useState<Selected>((): Selected => {
    const proposal = api.tx.staking.cancelDeferredSlash(slash.era, slash.slashes.map((_, index) => index));

    return {
      selected: [],
      txAll: councilMod
        ? { length: proposal.encodedLength, proposal }
        : null,
      txSome: null
    };
  });

  const headerRef = useRef<[string?, string?, number?][]>([
    [t('era {{era}}/unapplied', { replace: { era: slash.era.toString() } }), 'start', 3],
    [t('reporters'), 'address'],
    [t('own')],
    [t('other')],
    [t('total')],
    [t('payout')],
    []
  ]);

  const _onSelect = useCallback(
    (index: number) => setSelected((state): Selected => {
      const selected = state.selected.includes(index)
        ? state.selected.filter((i) => i !== index)
        : state.selected.concat(index).sort((a, b) => a - b);
      const proposal = selected.length
        ? api.tx.staking.cancelDeferredSlash(slash.era, selected)
        : null;

      return {
        selected,
        txAll: state.txAll,
        txSome: proposal && councilMod && isFunction(api.tx[councilMod].propose)
          ? { length: proposal.encodedLength, proposal }
          : null
      };
    }),
    [api, councilMod, slash]
  );

  return (
    <>
      <Summary slash={slash} />
      <Button.Group>
        {buttons}
        {councilMod && (
          <>
            <TxButton
              accountId={councilId}
              isDisabled={!txSome}
              isToplevel
              label={t('Cancel selected')}
              params={txSome && (
                api.tx[councilMod].propose.meta.args.length === 3
                  ? [councilThreshold, txSome.proposal, txSome.length]
                  : [councilThreshold, txSome.proposal]
              )}
              tx={api.tx[councilMod].propose}
            />
            <TxButton
              accountId={councilId}
              isDisabled={!txAll}
              isToplevel
              label={t('Cancel all')}
              params={txAll && (
                api.tx[councilMod].propose.meta.args.length === 3
                  ? [councilThreshold, txAll.proposal, txAll.length]
                  : [councilThreshold, txAll.proposal]
              )}
              tx={api.tx[councilMod].propose}
            />
          </>
        )}
      </Button.Group>
      <Table header={headerRef.current}>
        {slash.slashes.map((slash, index): React.ReactNode => (
          <Row
            index={index}
            isSelected={selected.includes(index)}
            key={index}
            onSelect={
              councilId
                ? _onSelect
                : undefined
            }
            slash={slash}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Slashes);
