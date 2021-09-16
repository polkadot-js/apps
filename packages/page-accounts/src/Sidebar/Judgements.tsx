// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import {Tag} from '@polkadot/react-components';
import {SortedJudgements} from '@polkadot/react-components/util/getJudgements';
import {JudgementTag} from "@polkadot/app-accounts/Sidebar/JudgementTag";

interface Props {
  judgements: SortedJudgements ;
}

export function Judgements ({ judgements }: Props): React.ReactElement<Props> {
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
      {judgements.map(({ judgementName, registrarsIndexes }) =>
        <JudgementTag judgementName={judgementName} registrarsIndexes={registrarsIndexes}/>
      )}
    </div>
  );
}
