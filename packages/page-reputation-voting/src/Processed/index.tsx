// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { ProcessedReferendum } from '../useProcessedReferenda.js';

import React, { useMemo } from 'react';

import { MarkError, MarkWarning, Spinner, styled, Table, Tag } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import useProcessedReferenda from '../useProcessedReferenda.js';

interface Props {
  className?: string;
}

const STATUS_COLORS: Record<ProcessedReferendum['status'], FlagColor> = {
  Approved: 'green',
  Cancelled: 'orange',
  Killed: 'red',
  Rejected: 'red',
  TimedOut: 'orange'
};

const STATUS_ICONS: Record<ProcessedReferendum['status'], React.ReactNode> = {
  Approved: <MarkWarning content='' />,
  Cancelled: <MarkWarning content='' />,
  Killed: <MarkError content='' />,
  Rejected: <MarkError content='' />,
  TimedOut: <MarkWarning content='' />
};

function getFailureReason (status: ProcessedReferendum['status'], t: (key: string) => string): string | null {
  switch (status) {
    case 'Rejected':
      return t('Did not reach required approval or support threshold');
    case 'Cancelled':
      return t('Was cancelled by governance decision');
    case 'TimedOut':
      return t('Decision period expired without entering confirmation');
    case 'Killed':
      return t('Was killed by root origin');
    case 'Approved':
    default:
      return null;
  }
}

function Processed ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const processed = useProcessedReferenda();

  const headers = useMemo<[string?, string?, number?][]>(() => [
    [t('Referendum'), 'start'],
    [t('Status')],
    [t('Completed at'), 'number'],
    [t('Details'), 'start', 2]
  ], [t]);

  return (
    <div className={className}>
      <Table
        empty={processed && t('No processed proposals')}
        header={headers}
      >
        {!processed
          ? <Spinner />
          : processed.map((referendum) => {
            const failureReason = getFailureReason(referendum.status, t);

            return (
              <StyledTr key={referendum.key}>
                <td className='number'>
                  <h1>#{formatNumber(referendum.id)}</h1>
                </td>
                <td>
                  <Tag
                    color={STATUS_COLORS[referendum.status]}
                    label={t(referendum.status)}
                  />
                </td>
                <td className='number'>
                  {referendum.completedAt && (
                    <span>#{formatNumber(referendum.completedAt)}</span>
                  )}
                </td>
                <td colSpan={2}>
                  {referendum.status === 'Approved'
                    ? (
                      <span className='success'>
                        {t('Proposal was approved and enacted successfully')}
                      </span>
                    )
                    : failureReason && (
                      <span className='failure'>
                        {STATUS_ICONS[referendum.status]}
                        {failureReason}
                      </span>
                    )
                  }
                </td>
              </StyledTr>
            );
          })
        }
      </Table>
    </div>
  );
}

const StyledTr = styled.tr`
  .success {
    color: var(--color-green);
  }

  .failure {
    color: var(--color-error);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export default React.memo(Processed);
