// Copyright 2017-2021 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ConstValue } from '@polkadot/react-components/InputConsts/types';
import type { ConstantCodec } from '@polkadot/types/metadata/decorate/types';
import type { ComponentProps as Props } from '../types';

import React, { useCallback, useState } from 'react';

import { Button, InputConsts } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

function Consts ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [defaultValue] = useState<ConstValue>((): ConstValue => {
    const section = Object.keys(api.consts)[0];
    const method = Object.keys(api.consts[section])[0];

    return {
      meta: (api.consts[section][method] as ConstantCodec).meta,
      method,
      section
    };
  });
  const [value, setValue] = useState(defaultValue);

  const _onAdd = useCallback(
    () => onAdd({ isConst: true, key: value }),
    [onAdd, value]
  );

  const { method, section } = value;
  const meta = (api.consts[section][method] as ConstantCodec).meta;

  return (
    <section className='storage--actionrow'>
      <div className='storage--actionrow-value'>
        <InputConsts
          defaultValue={defaultValue}
          help={meta?.documentation.join(' ')}
          label={t<string>('selected constant query')}
          onChange={setValue}
        />
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='plus'
          onClick={_onAdd}
        />
      </div>
    </section>
  );
}

export default React.memo(Consts);
