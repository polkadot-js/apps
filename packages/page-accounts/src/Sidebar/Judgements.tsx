// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import JudgementTag from '@polkadot/app-accounts/Sidebar/JudgementTag';
import { Tag } from '@polkadot/react-components';
import { SortedJudgements } from '@polkadot/react-components/util/getJudgements';

interface Props {
  className?: string;
  judgements: SortedJudgements ;
}

function Judgements ({ className, judgements }: Props): React.ReactElement<Props> {
  if (judgements.length === 0) {
    return (
      <div
        className={className}
        data-testid='judgements'
      >
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
    <div
      className={className}
      data-testid='judgements'
    >
      {judgements.map(({ judgementName, registrarsIndexes }) =>
        <JudgementTag
          judgementName={judgementName}
          key={registrarsIndexes.toString()}
          registrarsIndexes={registrarsIndexes}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Judgements)`
  margin-top: 0.714rem;

  .ui--Tag:hover {
    cursor: pointer;
  }
`);
