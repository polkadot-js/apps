// Copyright 2017-2021 @polkadot/app-execute authors & contributors
// and @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import UIParams from './Param/Params';
import { RawParams } from '@canvas-ui/react-components/types';
import React, { useCallback, useEffect, useState } from 'react';

import { AbiParam } from '@polkadot/api-contract/types';

interface Props {
  isDisabled?: boolean;
  params?: AbiParam[];
  onChange: (values: any[]) => void;
  onEnter?: () => void;
}

function CallParams ({ isDisabled, onChange, onEnter, params: propParams }: Props): React.ReactElement<Props> | null {
  const [params, setParams] = useState<AbiParam[]>([]);

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
