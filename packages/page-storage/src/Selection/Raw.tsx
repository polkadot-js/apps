// Copyright 2017-2020 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '../types';

import React, { useCallback, useState } from 'react';
import { Button, Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import { u8aToU8a } from '@polkadot/util';
import { Compact } from '@polkadot/types';

function Raw ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isValid, key }, setValue] = useState<{ isValid: boolean; key: Uint8Array }>({ isValid: false, key: new Uint8Array([]) });

  const _onAdd = useCallback(
    (): void => {
      isValid && onAdd({ isConst: false, key });
    },
    [isValid, key, onAdd]
  );

  const _onChangeKey = useCallback(
    (key: string): void => {
      const u8a = u8aToU8a(key);

      setValue({
        isValid: u8a.length !== 0,
        key: Compact.addLengthPrefix(u8a)
      });
    },
    []
  );

  return (
    <section className='storage--actionrow'>
      <div className='storage--actionrow-value'>
        <Input
          autoFocus
          label={t<string>('hex-encoded storage key')}
          onChange={_onChangeKey}
          onEnter={_onAdd}
        />
      </div>
      <div className='storage--actionrow-buttons'>
        <Button
          icon='plus'
          isDisabled={!isValid}
          onClick={_onAdd}
        />
      </div>
    </section>
  );
}

export default React.memo(Raw);
