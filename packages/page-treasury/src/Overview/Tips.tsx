// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, OpenTip, OpenTipTo225 } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import Tip from './Tip';

interface Props {
  className?: string;
  hashes?: string[] | null;
  isMember: boolean;
  members: string[];
}

type Tip = [string, OpenTip | OpenTipTo225];

function Tips ({ className = '', hashes, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [tips, setTips] = useState<Tip[] | undefined>();
  const optTips = useCall<Option<OpenTip>[]>(hashes && api.query.treasury.tips.multi, [hashes]);

  useEffect((): void => {
    hashes && optTips && setTips(
      optTips
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
        )
    );
  }, [hashes, optTips]);

  const header = useMemo(() => [
    [t('tips'), 'start'],
    [t('finder'), 'address'],
    [t('deposit')],
    [t('reason'), 'start'],
    [],
    [],
    [undefined, 'badge']
  ].filter((v) => v), [t]);

  return (
    <Table
      className={className}
      empty={tips && t<string>('No open tips')}
      header={header}
    >
      {tips?.map(([hash, tip]): React.ReactNode => (
        <Tip
          bestNumber={bestNumber}
          hash={hash}
          isMember={isMember}
          key={hash}
          members={members}
          tip={tip}
        />
      ))}
    </Table>
  );
}

export default React.memo(Tips);
