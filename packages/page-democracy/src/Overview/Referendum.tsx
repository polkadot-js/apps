// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveReferendumExt } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Badge, Button, Icon, LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber, isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';
import useChangeCalc from '../useChangeCalc';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import ReferendumVotes from './ReferendumVotes';
import Voting from './Voting';

interface Props {
  className?: string;
  value: DeriveReferendumExt;
}

function Referendum ({ className, value: { allAye, allNay, image, imageHash, index, isPassing, status, voteCountAye, voteCountNay, votedAye, votedNay, votedTotal } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const { changeAye, changeNay } = useChangeCalc(status.threshold, votedAye, votedNay, votedTotal);
  const threshold = useMemo(
    () => status.threshold.type.toString().replace('majority', ' majority '),
    [status]
  );

  if (!bestNumber || status.end.sub(bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = status.end.add(status.delay);
  const remainBlock = status.end.sub(bestNumber).subn(1);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together'>
        <BlockToTime blocks={remainBlock} />
        {t('{{blocks}} blocks', { replace: { blocks: formatNumber(remainBlock) } })}
      </td>
      <td className='number together'>
        <BlockToTime blocks={enactBlock.sub(bestNumber)} />
        #{formatNumber(enactBlock)}
      </td>
      <ReferendumVotes
        change={changeAye}
        count={voteCountAye}
        index={index}
        isWinning={isPassing}
        total={votedAye}
        votes={allAye}
      />
      <ReferendumVotes
        change={changeNay}
        count={voteCountNay}
        index={index}
        isWinning={!isPassing}
        total={votedNay}
        votes={allNay}
      />
      <td className='badge'>
        {isBoolean(isPassing) && (
          <Badge
            hover={
              isPassing
                ? t('{{threshold}}, passing', { replace: { threshold } })
                : t('{{threshold}}, not passing', { replace: { threshold } })
            }
            info={<Icon name={isPassing ? 'check' : 'cancel'} />}
            isTooltip
            type={isPassing ? 'green' : 'brown'}
          />
        )}
      </td>
      <td className='button'>
        <Button.Group>
          <Voting
            proposal={image?.proposal}
            referendumId={index}
          />
          {!image?.proposal && (
            <PreImageButton imageHash={imageHash} />
          )}
        </Button.Group>
      </td>
      <td className='mini'>
        <LinkExternal
          data={index}
          type='referendum'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Referendum)`
  .democracy--Referendum-results {
    margin-bottom: 1em;

    &.chart {
      text-align: center;
    }
  }
`);
