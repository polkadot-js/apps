// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, TrackDescription, TrackInfoExt } from '../../types.js';
import type { VoteResultItem } from './types.js';

import React, { useMemo } from 'react';

import { MarkWarning, styled, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate.js';
import { getTrackInfo } from '../../util.js';

interface Props {
  allowEmpty?: boolean;
  className?: string;
  palletReferenda: PalletReferenda;
  trackId: number;
  tracks: TrackDescription[];
  value?: VoteResultItem[] | null | false;
}

function Activity ({ allowEmpty, className, palletReferenda, tracks, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, specName } = useApi();

  const infos = useMemo(
    () => value && value.map((v): [VoteResultItem, TrackInfoExt | undefined] =>
      [v, getTrackInfo(api, specName, palletReferenda, tracks, v.classId.toNumber())]
    ),
    [api, palletReferenda, specName, tracks, value]
  );

  if (!infos) {
    return null;
  }

  return (
    <StyledDiv className={className}>
      {infos.length
        ? (
          <Table isInline>
            {infos.map(([{ casting, classId, delegating }, info], index) => (
              <tr key={index}>
                <td className='all'>
                  {info?.trackName || classId.toString()}
                </td>
                <td className='together'>
                  {
                    (delegating &&
                      t('delegating')) ||
                    (casting &&
                      `${casting.length} ${casting.length === 1 ? t('vote') : t('votes')}`)
                  }
                </td>
              </tr>
            ))}
          </Table>
        )
        : <MarkWarning content={t('This account has no voting/delegating activity in the chain state')} />
      }
      {!allowEmpty && infos.some(([{ delegating }]) => delegating) && (
        <MarkWarning content={t('This account has some delegations in itself')} />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--Table {
    font-size: var(--font-percent-small);
    opacity: var(--opacity-light);
    padding-left: 2rem;
  }
`;

export default React.memo(Activity);
