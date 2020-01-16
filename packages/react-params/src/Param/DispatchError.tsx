// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DispatchError } from '@polkadot/types/interfaces';
import { Props } from '../types';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Static from './Static';
import Unknown from './Unknown';

export default function ErrorDisplay (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!props.isDisabled || !props.defaultValue?.value?.isModule) {
    return <Unknown {...props} />;
  }

  const mod = (props.defaultValue.value as DispatchError).asModule;
  const error = registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error.toNumber()]));
  const type = `${error.section}.${error.name}`;
  const details = error.documentation.join(', ');

  return (
    <Static {...props}>
      <Input
        className='full'
        isDisabled
        label={t('type')}
        value={type}
      />
      {details && (
        <Input
          className='full'
          isDisabled
          label={t('details')}
          value={details}
        />
      )}
    </Static>
  );
}
