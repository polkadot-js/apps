// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation } from '@polkadot/react-hooks/types';

import React from 'react';

import { ExpandButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Row from './Row.js';

interface Props {
  chain: ChainInformation
  regionEnd: number
  regionBegin: number
  lastCommittedTimeslice: number
}

function ParachainTableRow ({ chain, lastCommittedTimeslice, regionBegin, regionEnd }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const info = chain.workTaskInfo;
  const firstRecord = chain.workTaskInfo[0];
  const multiple = info.length > 1;
  const expandedContent = info.slice(1);

  if (!firstRecord) {
    return <></>;
  }

  return (
    <>
      <tr
        className={`isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}
        key={chain.id}
      >
        <React.Fragment key={`${chain.id}`}>
          <Row
            chainRecord={firstRecord}
            id={chain.id}
            lastCommittedTimeslice={lastCommittedTimeslice}
            lease={chain.lease}
            regionBegin={regionBegin}
            regionEnd={regionEnd}
          />
          <td style={{ paddingRight: '2rem', textAlign: 'right', verticalAlign: 'top' }}>

            {!!multiple &&
                            (
                              <ExpandButton
                                expanded={isExpanded}
                                onClick={toggleIsExpanded}
                              />
                            )
            }
          </td>
        </React.Fragment>

      </tr>
      {isExpanded &&
                <>
                  {expandedContent?.map((infoRow, idx) => {
                    return (
                      <tr key={`${chain.id}${idx}`}>
                        <Row
                          chainRecord={infoRow}
                          highlight={true}
                          id={chain.id}
                          lastCommittedTimeslice={lastCommittedTimeslice}
                          lease={chain.lease}
                          regionBegin={regionBegin}
                          regionEnd={regionEnd}
                        />
                      </tr>
                    );
                  }
                  )}

                </>
      }
    </>
  );
}

export default React.memo(ParachainTableRow);
