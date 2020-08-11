// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';

interface Props {
  className?: string;
  onChange: (index: number) => void;
  options: { isDisabled?: boolean, text: string, value: number }[];
  selected: number;
}

interface ToggleProps {
  index: number;
  isDisabled?: boolean;
  isSelected: boolean;
  onChange: (index: number) => void;
  text: string;
}

function ToggleIndex ({ index, isDisabled, isSelected, onChange, text }: ToggleProps): React.ReactElement<ToggleProps> {
  const _onClick = useCallback(
    (): void => {
      !isDisabled && onChange(index);
    },
    [isDisabled, index, onChange]
  );

  return (
    <Button
      icon={isSelected ? 'check' : 'circle'}
      isBasic
      isDisabled={isDisabled}
      isSelected={isSelected}
      key={text}
      label={text}
      onClick={_onClick}
    />
  );
}

const ToggleIndexMemo = React.memo(ToggleIndex);

function PayToggle ({ className = '', onChange, options, selected }: Props): React.ReactElement<Props> | null {
  if (!options.length || !options[0].value) {
    return null;
  }

  return (
    <div className={`ui--ToggleButton ${className}`}>
      {options.map(({ isDisabled, text }, index): React.ReactNode => (
        <ToggleIndexMemo
          index={index}
          isDisabled={isDisabled}
          isSelected={selected === index}
          key={index}
          onChange={onChange}
          text={text}
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

    .ui--Icon {
      width: 1em;
    }
  }
`);
