// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Option } from '@polkadot/types';
import type { OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Table, Toggle } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

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

const TIP_OPTS = { withParams: true };

function extractTips (tipsWithHashes?: [[string[]], Option<OpenTip>[]], inHashes?: string[] | null): Tip[] | undefined {
  if (!tipsWithHashes || !inHashes) {
    return undefined;
  }

  const [[hashes], optTips] = tipsWithHashes;

  return optTips
    .map((opt, index): [string, OpenTip | null] => [hashes[index], opt.unwrapOr(null)])
    .filter((val): val is [string, OpenTip] => inHashes.includes(val[0]) && !!val[1])
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
  const bestNumber = useBestNumber();
  const tipsWithHashes = useCall<[[string[]], Option<OpenTip>[]]>(hashes && (api.query.tips || api.query.treasury).tips.multi, [hashes], TIP_OPTS);

  const tips = useMemo(
    () => extractTips(tipsWithHashes, hashes),
    [hashes, tipsWithHashes]
  );

  const headerRef = useRef([
    [t('tips'), 'start'],
    [t('finder'), 'address media--1400'],
    [t('reason'), 'start'],
    [undefined, 'media--1100'],
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
      {tips && tips.map(([hash, tip]): React.ReactNode => (
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
