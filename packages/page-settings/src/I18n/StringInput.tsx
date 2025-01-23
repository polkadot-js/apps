// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { Input, styled } from '@polkadot/react-components';

interface Props {
  className?: string;
  onChange: (key: string, val: string) => void;
  original: string;
  tkey: string;
  tval: string;
}

function StringInput ({ className = '', onChange, original, tkey, tval }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: string) => onChange(tkey, value),
    [onChange, tkey]
  );

  return (
    <StyledDiv className={className}>
      <div className='label'>{original}</div>
      <Input
        onChange={_onChange}
        value={tval}
        withLabel={false}
      />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .label {
    font-style: italic;
    margin-top: 0.5rem;

    +div {
      margin-left: 1rem;
    }
  }
`;

export default React.memo(StringInput);
