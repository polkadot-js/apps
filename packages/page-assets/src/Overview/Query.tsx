// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Button, FilterOverlay, Input, styled } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  onQuery?: (value: string) => void;
}

function Query ({ className = '', onQuery }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const _onChange = useCallback(
    (value: string): void => setInput(value),
    []
  );

  const _onQuery = useCallback(
    (): void => {
      onQuery && onQuery(input);
    },
    [input, onQuery]
  );

  return (
    <StyledFilterOverlay className={`${className} ui--FilterOverlay hasOwnMaxWidth`}>
      <Input
        className='asset--query'
        onChange={_onChange}
        onEnter={_onQuery}
        placeholder={t('asset id or name to query')}
        withLabel={false}
      >
        <Button
          icon='play'
          onClick={_onQuery}
        />
      </Input>
    </StyledFilterOverlay>
  );
}

const StyledFilterOverlay = styled(FilterOverlay)`
  .asset--query {
    width: 20em;
  }
`;

export default React.memo(Query);
