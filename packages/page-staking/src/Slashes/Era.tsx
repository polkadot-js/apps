// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { SlashEra } from './types';

import React, { useCallback, useRef, useState } from 'react';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Row from './Row';
import Summary from './Summary';

interface Props {
  councilId: string | null;
  councilThreshold: number;
  slash: SlashEra;
}

interface Selected {
  selected: number[];
  txAll: SubmittableExtrinsic<'promise'>;
  txSome: SubmittableExtrinsic<'promise'> | null;
}

function Slashes ({ councilId, councilThreshold, slash }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ selected, txAll, txSome }, setSelected] = useState<Selected>((): Selected => {
    const proposal = api.tx.staking.cancelDeferredSlash(slash.era, slash.slashes.map((_, index) => index));

    return { selected: [], txAll: api.tx.council.propose(councilThreshold, proposal, proposal.encodedLength), txSome: null };
  });

  const headerRef = useRef<[string?, string?, number?][]>([
    [undefined, 'start', 3],
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
      const txSome = proposal
        ? api.tx.council.propose(councilThreshold, proposal, proposal.encodedLength)
        : null;

      return { selected, txAll: state.txAll, txSome };
    }),
    [api, councilThreshold, slash]
  );

  return (
    <Table header={[[t('era {{era}}/unapplied', { replace: { era: slash.era.toString() } }), 'start', 8]]}>
      <Summary slash={slash}>
        {councilId && (
          <Button.Group>
            <TxButton
              accountId={councilId}
              extrinsic={txSome}
              isDisabled={!txSome}
              isToplevel
              label={t('Cancel selected')}
            />
            <TxButton
              accountId={councilId}
              extrinsic={txAll}
              isDisabled={!txAll}
              isToplevel
              label={t('Cancel all')}
            />
          </Button.Group>
        )}
      </Summary>
      <tr className='transparent'>
        {headerRef.current.map(([label, className, colSpan = 1], index): React.ReactNode => (
          <td
            className={className}
            colSpan={colSpan}
            key={index}
          >
            <label>{label}</label>
          </td>
        ))}
      </tr>
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
  );
}

export default React.memo(Slashes);
