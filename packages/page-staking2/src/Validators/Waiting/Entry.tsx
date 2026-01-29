// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Validator } from '../../types.js';

import React from 'react';

import { useToggle } from '@polkadot/react-hooks';

import Bottom from '../Active/Row/Bottom.js';
import Middle from '../Active/Row/Middle.js';
import Top from '../Active/Row/Top.js';

interface Props {
  className?: string;
  toggleFavorite: (stashId: string) => void;
  validator: Validator;
}

interface PropsExpanded {
  className?: string;
  validator: Validator;
}

function EntryExpanded ({ className = '' }: PropsExpanded): React.ReactElement<PropsExpanded> {
  return <td className={className} />;
}

function Entry ({ className = '', toggleFavorite, validator }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle();

  return (
    <>
      <Top
        className={className}
        isExpanded={isExpanded}
        toggleExpanded={toggleExpanded}
        toggleFavorite={toggleFavorite}
        validator={validator}
      />
      <Middle
        className={className}
        isExpanded={isExpanded}
      >
        <td />
      </Middle>
      <Bottom
        className={className}
        isExpanded={isExpanded}
      >
        <EntryExpanded validator={validator} />
      </Bottom>
    </>
  );
}

export default React.memo(Entry);
