// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InkMessageParam } from '@polkadot/api-contract/types';
import { RawParams } from '@canvas-ui/react-params/types';

import React, { useCallback, useEffect, useState } from 'react';
import UIParams from '@canvas-ui/react-params';

interface Props {
  isDisabled?: boolean;
  params?: InkMessageParam[];
  onChange: (values: any[]) => void;
  onEnter?: () => void;
}

function CallParams ({ isDisabled, onChange, onEnter, params: propParams }: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<InkMessageParam[]>([]);

  useEffect((): void => {
    propParams && setParams(propParams);
  }, [propParams]);

  const _onChange = useCallback(
    (values: RawParams) => onChange(values.map(({ value }): any => value)),
    [onChange]
  );

  if (!params.length) {
    return null;
  }

  return (
    <UIParams
      isDisabled={isDisabled}
      onChange={_onChange}
      onEnter={onEnter}
      params={params}
    />
  );
}

export default React.memo(CallParams);
