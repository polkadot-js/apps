// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { Button, FilterOverlay, Input, styled } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  className?: string;
  value?: string;
}

interface State {
  value: string;
  isValid: boolean;
}

function stateFromValue (value: string): State {
  return {
    isValid: isHex(value, 256) || /^\d+$/.test(value),
    value
  };
}

function Query ({ className = '', value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, value }, setState] = useState(() => stateFromValue(propsValue || ''));

  const _setHash = useCallback(
    (value: string): void => setState(stateFromValue(value)),
    []
  );

  const _onQuery = useCallback(
    (): void => {
      if (isValid && value.length !== 0) {
        window.location.hash = `/explorer/query/${value}`;
      }
    },
    [isValid, value]
  );

  return (
    <StyledFilterOverlay className={`${className} ui--FilterOverlay hasOwnMaxWidth`}>
      <Input
        className='explorer--query'
        defaultValue={propsValue}
        isError={!isValid && value.length !== 0}
        onChange={_setHash}
        onEnter={_onQuery}
        placeholder={t('block hash or number to query')}
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
  .explorer--query {
    width: 20em;
  }
`;

export default React.memo(Query);
