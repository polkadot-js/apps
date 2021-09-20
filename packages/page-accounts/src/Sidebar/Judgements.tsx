// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Tag } from '@polkadot/react-components';
import { SortedJudgements } from '@polkadot/react-components/util/getJudgements';

import JudgementTag from './JudgementTag';

interface Props {
  address: string;
  className?: string;
  judgements: SortedJudgements ;
}

function Judgements ({ address, className = '', judgements }: Props): React.ReactElement<Props> {
  if (judgements.length === 0) {
    return (
      <div
        className={`${className} no-judgements`}
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
          key={`${address}${judgementName}`}
          registrarsIndexes={registrarsIndexes}
        />
      )}
    </div>
  );
}

export default React.memo(styled(Judgements)`
  margin-top: 0.714rem;

  &:not(.no-judgements) {
    .ui--Tag:hover {
      cursor: pointer;
    }
  }
`);
