// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Tag } from '@polkadot/react-components';
import { useJudgements } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import JudgementTag from './JudgementTag';

interface Props {
  address: string;
  className?: string;
}

function Judgements ({ address, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const judgements = useJudgements(address);

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
          label={t<string>('No judgements')}
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
      {judgements.map((judgement) =>
        <JudgementTag
          judgement={judgement}
          key={`${address}${judgement.judgementName}`}
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
