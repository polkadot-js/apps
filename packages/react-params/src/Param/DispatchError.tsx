// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DispatchError } from '@polkadot/types/interfaces';
import type { Props as BaseProps } from '../types';

import React, { useEffect, useState } from 'react';

import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Static from './Static';
import Unknown from './Unknown';

interface Details {
  details?: string | null;
  type?: string;
}

interface Props extends BaseProps {
  childrenPre?: React.ReactNode;
}

function isDispatchError (value?: unknown): value is DispatchError {
  return !!(value && ((value as DispatchError).isModule || (value as DispatchError).isToken));
}

function ErrorDisplay (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ details, type }, setDetails] = useState<Details>({});

  useEffect((): void => {
    const { value } = props.defaultValue || {};

    if (isDispatchError(value)) {
      if (value.isModule) {
        try {
          const mod = value.asModule;
          const { docs, name, section } = mod.registry.findMetaError(mod);

          return setDetails({
            details: docs.join(', '),
            type: `${section}.${name}`
          });
        } catch (error) {
          // Errors may not actually be exposed, in this case, just return the default representation
          console.error(error);
        }
      } else if (value.isToken) {
        return setDetails({
          details: value.asToken.type,
          type: value.type
        });
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
