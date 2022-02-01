// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Judgement } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { AddressSmall, Menu, Popup, Tag } from '@polkadot/react-components';

import { getJudgementColor } from '../util';

interface Props {
  judgement: Judgement
}

function JudgementTag ({ judgement: { judgementName, registrars } }: Props): React.ReactElement<Props> {
  const judgementColor = useMemo(() => getJudgementColor(judgementName), [judgementName]);

  return (
    <Popup
      closeOnScroll
      position='center'
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
        isTag={false}
        label={`${registrars.length} ${judgementName}`}
        size='tiny'
      />
    </Popup>
  );
}

export default React.memo(JudgementTag);
