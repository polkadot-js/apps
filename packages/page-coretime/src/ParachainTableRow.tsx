// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation, ChainWorkTaskInformation } from '@polkadot/react-hooks/types';
import type { RelayName } from './types.js';

import React from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Row from './Row.js';

interface Props {
  chain: ChainInformation
  regionEnd: number
  regionBegin: number
  lastCommittedTimeslice: number
  relayName: RelayName
}

function ParachainTableRow ({ chain, lastCommittedTimeslice, regionBegin, regionEnd, relayName }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const info = chain.workTaskInfo;
  const firstRecord = chain.workTaskInfo[0];
  const multiple = info.length > 1;
  const expandedContent = info.slice(1);

  if (!firstRecord) {
    return <></>;
  }

  const renderRow = (record: ChainWorkTaskInformation, idx: number, highlight = false) =>
    <>
      <Row
        chainRecord={record}
        highlight={highlight}
        id={chain.id}
        lastCommittedTimeslice={lastCommittedTimeslice}
        lease={chain.lease}
        regionBegin={regionBegin}
        regionEnd={regionEnd}
        relayName={relayName}
      />
      {idx === 0 && <td style={{ paddingRight: '2rem', textAlign: 'right', verticalAlign: 'top' }}>

        {!!multiple &&
          <ExpandButton
            expanded={isExpanded}
            onClick={toggleIsExpanded}
          />
        }
      </td>}
    </>;

  return (
    <>
      <tr
        className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
        key={chain.id}
      >
        {renderRow(firstRecord, 0)}
      </tr>
      {isExpanded && expandedContent?.map((infoRow, idx) =>
        <tr key={`${chain.id}${idx}`}>
          {renderRow(infoRow, idx + 1, true)}
        </tr>
      )}
    </>
  );
}

export default React.memo(ParachainTableRow);
