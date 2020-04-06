// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DispatchError } from '@polkadot/types/interfaces';
import { Props } from '../types';

import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Static from './Static';
import Unknown from './Unknown';

interface Details {
  details?: string | null;
  type?: string;
}

function ErrorDisplay (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ details, type }, setDetails] = useState<Details>({});

  useEffect((): void => {
    if (details !== null && props.defaultValue?.value?.isModule) {
      try {
        const { documentation, name, section } = registry.findMetaError((props.defaultValue.value as DispatchError).asModule);

        setDetails({
          details: documentation.join(', '),
          type: `${section}.${name}`
        });
      } catch (error) {
        // Errors may not actually be exposed, in this case, just return the default representation
        console.error(error);

        setDetails({ details: null });
      }
    }
  }, [details, props.defaultValue]);

  if (!props.isDisabled || !details) {
    return <Unknown {...props} />;
  }

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

export default React.memo(ErrorDisplay);
