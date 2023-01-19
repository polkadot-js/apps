// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Option {
  isDisabled?: boolean;
  text: string;
  value: string | number;
}

interface Props {
  className?: string;
  onChange: (index: number) => void;
  options: (Option | null | false)[];
  value: number;
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
      {available.map(({ isDisabled, text }, index): React.ReactNode => (
        <ToggleIndexMemo
          index={index}
          isDisabled={isDisabled}
          isSelected={value === index}
          key={index}
          onChange={onChange}
          text={text}
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
