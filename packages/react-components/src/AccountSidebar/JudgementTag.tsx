// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DisplayedJudgement, Judgement } from '../types.js';

import React, { useMemo } from 'react';

import AddressSmall from '../AddressSmall.js';
import Menu from '../Menu/index.js';
import Popup from '../Popup/index.js';
import Tag from '../Tag.js';

interface Props {
  judgement: Judgement
}

export function getJudgementColor (name: DisplayedJudgement): 'green' | 'red' {
  return (name === 'Erroneous' || name === 'Low quality')
    ? 'red'
    : 'green';
}

function JudgementTag ({ judgement: { judgementName, registrars } }: Props): React.ReactElement<Props> {
  const judgementColor = useMemo(() => getJudgementColor(judgementName), [judgementName]);

  return (
    <Popup
      closeOnScroll
      position='middle'
      value={
        <Menu>
          {registrars.map((registrar) => registrar && (
            <AddressSmall
              key={registrar.address}
              value={registrar.address}
            />
          ))}
        </Menu>
      }
    >
      <Tag
        color={judgementColor}
        label={`${registrars.length} ${judgementName}`}
        size='tiny'
      />
    </Popup>
  );
}

export default React.memo(JudgementTag);
