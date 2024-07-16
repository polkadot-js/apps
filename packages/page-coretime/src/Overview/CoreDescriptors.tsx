// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { ExpandButton, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import CoreDescriptor from './CoreDescriptor.js';

interface Props {
  className?: string;
  coreInfos?: CoreDescription;
}

function CoreDescriptors ({ className, coreInfos }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle();
  const trackName = 'core'
;

  const [headerButton, headerChildren] = useMemo(
    () => [
      false && coreInfos && (
        <ExpandButton
          expanded={isExpanded}
          onClick={toggleExpanded}
        />
      ),
      isExpanded && coreInfos && (
        <tr>
          <th colSpan={8} />
        </tr>
      )
    ],
    [isExpanded, toggleExpanded, coreInfos]
  );

  const [header, key] = useMemo(
    (): [([React.ReactNode?, string?, number?] | null)[], string] => [
      [
        [trackName ? <>{trackName}<div className='sub'>{coreInfos?.core}</div></> : t('core'), 'start', 8],
        null && [headerButton]
      ],
      trackName
    ],
    [headerButton, t, coreInfos, trackName]
  );

  return (
    <Table
      className={className}
      empty={coreInfos && t('No core description found')}
      header={header}
      headerChildren={headerChildren}
      key={key}
    >
      {coreInfos && <CoreDescriptor value={coreInfos} />}
    </Table>
  );
}

export default React.memo(CoreDescriptors);
