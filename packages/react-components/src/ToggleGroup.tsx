// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';

import Button from './Button/index.js';
import { styled } from './styled.js';

interface Option {
  isDisabled?: boolean;
  text: string;
  value: string | number;
}

interface Props {
  className?: string;
  onChange: (index: number, value: string | number) => void;
  options: (Option | null | undefined | false)[];
  value: number;
}

interface ToggleProps {
  index: number;
  isDisabled?: boolean;
  isSelected: boolean;
  onChange: (index: number, value: string | number) => void;
  text: string;
  value: string | number;
}

function ToggleIndex ({ index, isDisabled, isSelected, onChange, text, value }: ToggleProps): React.ReactElement<ToggleProps> {
  const _onClick = useCallback(
    (): void => {
      !isDisabled && onChange(index, value);
    },
    [isDisabled, index, onChange, value]
  );

  return (
    <Button
      icon={
        isSelected
          ? 'check'
          : 'circle'
      }
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

function ToggleGroup ({ className = '', onChange, options, value }: Props): React.ReactElement<Props> | null {
  const available = useMemo(
    () => options.filter((o): o is Option => !!o),
    [options]
  );

  if (!available.length || !available[0].value) {
    return null;
  }

  return (
    <StyledDiv className={`${className} ui--ToggleGroup`}>
      {available.map(({ isDisabled, text, value: optValue }, index): React.ReactNode => (
        <ToggleIndexMemo
          index={index}
          isDisabled={isDisabled}
          isSelected={value === index}
          key={index}
          onChange={onChange}
          text={text}
          value={optValue}
        />
      ))}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
`;

export default React.memo(ToggleGroup);
