// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Tag } from '@polkadot/react-components';
import { DisplayedJudgement } from '@polkadot/react-components/types';
import { SortedJudgements } from '@polkadot/react-components/util/getJudgements';

interface Props {
  judgements: SortedJudgements ;
}

function getColor (name: DisplayedJudgement): 'green' | 'red' {
  if (name === 'Erroneous' || name === 'Low quality') {
    return 'red';
  }

  return 'green';
}

export function Judgements ({ judgements }: Props): React.ReactElement<Props> {
  console.log('ujgements form JUDGEmENTS', judgements);

  if (judgements.length === 0) {
    return (
      <div data-testid='judgements'>
        <Tag
          color='yellow'
          isTag={false}
          key='NoJudgements'
          label='No Judgements'
          size='tiny'
        />
      </div>
    );
  }

  return (
    <div data-testid='judgements'>
      {judgements.map(({ judgementName, registrarsIndexes }) => {
        const judgementColor = getColor(judgementName);

        return (
          <Tag
            color={judgementColor}
            isTag={false}
            key={judgementName}
            label={`${registrarsIndexes.length} ${judgementName}`}
            size='tiny'
          />
        );
      })}
    </div>
  );
}
