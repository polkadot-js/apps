// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Input } from '@polkadot/react-components';

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
    <div className={className}>
      <div className='label'>{original}</div>
      <Input
        onChange={_onChange}
        value={tval}
        withLabel={false}
      />
    </div>
  );
}

export default React.memo(styled(StringInput)`
  .label {
    font-style: italic;
    margin-top: 0.5rem;

    +div {
      margin-left: 1rem;
    }
  }
`);
