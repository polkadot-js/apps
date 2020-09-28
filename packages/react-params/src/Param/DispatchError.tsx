// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DispatchError } from '@polkadot/types/interfaces';
import { Props } from '../types';

import React, { useEffect, useState } from 'react';
import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Static from './Static';
import Unknown from './Unknown';

interface ModuleErrorDefault {
  isModule?: boolean
}

interface Details {
  details?: string | null;
  type?: string;
}

function isModuleError (value?: ModuleErrorDefault): value is DispatchError {
  return !!value?.isModule;
}

function ErrorDisplay (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ details, type }, setDetails] = useState<Details>({});

  useEffect((): void => {
    const { value } = props.defaultValue || {};

    if (isModuleError(value as ModuleErrorDefault)) {
      try {
        const mod = (value as DispatchError).asModule;
        const { documentation, name, section } = mod.registry.findMetaError(mod);

        return setDetails({
          details: documentation.join(', '),
          type: `${section}.${name}`
        });
      } catch (error) {
        // Errors may not actually be exposed, in this case, just return the default representation
        console.error(error);
      }
    }

    setDetails({ details: null });
  }, [props.defaultValue]);

  if (!props.isDisabled || !details) {
    return <Unknown {...props} />;
  }

  return (
    <Static {...props}>
      <Input
        className='full'
        isDisabled
        label={t<string>('type')}
        value={type}
      />
      {details && (
        <Input
          className='full'
          isDisabled
          label={t<string>('details')}
          value={details}
        />
      )}
    </Static>
  );
}

export default React.memo(ErrorDisplay);
