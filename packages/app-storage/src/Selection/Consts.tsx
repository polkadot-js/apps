// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstantCodec } from '@polkadot/api-metadata/consts/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ConstValue } from '@polkadot/react-components/InputConsts/types';
import { ComponentProps } from '../types';

import React, { useContext, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Button, InputConsts } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends ComponentProps, I18nProps {}

function Consts ({ onAdd, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
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

  const _onAdd = (): void => onAdd({ isConst: true, key: value });

  const { method, section } = value;
  const meta = (api.consts[section][method] as ConstantCodec).meta;

  return (
    <section className='storage--actionrow'>
      <div className='storage--actionrow-value'>
        <InputConsts
          defaultValue={defaultValue}
          label={t('selected constant query')}
          onChange={setValue}
          help={meta && meta.documentation && meta.documentation.join(' ')}
        />
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='plus'
          isPrimary
          onClick={_onAdd}
        />
      </div>
    </section>
  );
}

export default translate(Consts);
