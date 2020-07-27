// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

interface Props {
  className?: string;
  onChange: (index: number) => void;
  options: { text: string, value: number }[];
  selected: number;
}

function PayToggle ({ className = '', onChange, options, selected }: Props): React.ReactElement<Props> | null {
  const _onClick = useCallback(
    (index: number) => () => onChange(index),
    [onChange]
  );

  if (!options.length || !options[0].value) {
    return null;
  }

  return (
    <div className={`ui--ToggleButton ${className}`}>
      {options.map(({ text }, index): React.ReactNode => (
        <Button
          icon={selected === index ? 'check' : 'circle'}
          isBasic
          isSelected={selected === index}
          key={text}
          label={text}
          onClick={_onClick(index)}
        />
      ))}
    </div>
  );
}

export default React.memo(styled(PayToggle)`
  display: inline-block;
  margin-right: 1.5rem;

  .ui--Button {
    margin: 0;

    &:not(:first-child) {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }

    &:not(:last-child) {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
`);
