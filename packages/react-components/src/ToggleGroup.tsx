// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { Button } from '@polkadot/react-components';

interface Option {
  isDisabled?: boolean;
  text: string;
  value: number;
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
    <div className={`ui--ToggleGroup ${className}`}>
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
    </div>
  );
}

export default React.memo(styled(ToggleGroup)`
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
