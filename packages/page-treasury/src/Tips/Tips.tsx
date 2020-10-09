// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BlockNumber, OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Table, Toggle } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import Tip from './Tip';

interface Props {
  className?: string;
  defaultId: string | null;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
  onSelectTip: (hash: string, isSelected: boolean, value: BN) => void,
}

type Tip = [string, OpenTip | OpenTipTo225];

function extractTips (optTips?: Option<OpenTip>[], hashes?: string[] | null): Tip[] | undefined {
  if (!hashes || !optTips) {
    return undefined;
  }

  return optTips
    .map((opt, index): [string, OpenTip | null] => [hashes[index], opt.unwrapOr(null)])
    .filter((val): val is [string, OpenTip] => !!val[1])
    .sort((a, b) =>
      a[1].closes.isNone
        ? b[1].closes.isNone
          ? 0
          : -1
        : b[1].closes.isSome
          ? b[1].closes.unwrap().cmp(a[1].closes.unwrap())
          : 1
    );
}

function Tips ({ className = '', defaultId, hashes, isMember, members, onSelectTip }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [onlyUntipped, setOnlyUntipped] = useState(false);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const optTips = useCall<Option<OpenTip>[]>(hashes && api.query.treasury.tips.multi, [hashes]);

  const tips = useMemo(
    () => extractTips(optTips, hashes),
    [hashes, optTips]
  );

  const headerRef = useRef([
    [t('tips'), 'start'],
    [t('finder'), 'address media--1400'],
    [t('reason'), 'start'],
    [],
    [],
    [undefined, 'badge media--1700'],
    [],
    [undefined, 'media--1700']
  ]);

  return (
    <Table
      className={className}
      empty={tips && t<string>('No open tips')}
      filter={isMember && (
        <div className='tipsFilter'>
          <Toggle
            label={t<string>('show only untipped/closing')}
            onChange={setOnlyUntipped}
            value={onlyUntipped}
          />
        </div>
      )}
      header={headerRef.current}
    >
      {tips?.map(([hash, tip]): React.ReactNode => (
        <Tip
          bestNumber={bestNumber}
          defaultId={defaultId}
          hash={hash}
          isMember={isMember}
          key={hash}
          members={members}
          onSelect={onSelectTip}
          onlyUntipped={onlyUntipped}
          tip={tip}
        />
      ))}
    </Table>
  );
}

export default React.memo(styled(Tips)`
  .tipsFilter {
    text-align: right;

    .ui--Toggle {
      margin-right: 1rem;
      margin-top: 0.75rem;
    }
  }
`);
