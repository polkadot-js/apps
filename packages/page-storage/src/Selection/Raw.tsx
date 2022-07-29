// Copyright 2017-2022 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '../types';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Input, Output } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { StorageEntry } from '@polkadot/types/primitive/types';
import { compactAddLength, u8aToU8a } from '@polkadot/util';

import { useTranslation } from '../translate';

function Raw ({ onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ isValid,
    key,
    keyAsBytes }, setValue] = useState<{ isValid: boolean; keyAsBytes: Uint8Array; key: string }>(() => ({
    isValid: false,
    key: '',
    keyAsBytes: new Uint8Array([])
  }));

  const _onAdd = useCallback(
    (): void => {
      isValid && onAdd({ isConst: false, key: keyAsBytes });
    },
    [isValid, keyAsBytes, onAdd]
  );

  const _onChangeKey = useCallback(
    (key: string): void => {
      const u8a = u8aToU8a(key);

      setValue({
        isValid: u8a.length !== 0,
        key,
        keyAsBytes: compactAddLength(u8a)
      });
    },
    []
  );

  const allStoragePrefixes = useMemo(
    () => {
      const palletNames = Object
        .keys(api.query)
        .map((value): string => (
          value
        ));
      const allStoragePrefixesNotFlattened = palletNames.map((palletName) => {
        const pallet = api.query[palletName];

        return Object
          .keys(pallet)
          .map((palletCall) => {
            const { keyPrefix } = pallet[palletCall] as unknown as StorageEntry;
            const keyPrefixValue = keyPrefix().toString();

            return [keyPrefixValue, `${palletName}.${palletCall}`];
          });
      });

      return allStoragePrefixesNotFlattened.flat();
    },
    [api]
  );

  const decodedKey = useMemo(
    (): string => {
      if (isValid) {
        const matchedPrefixes = allStoragePrefixes.filter(([keyPrefix, _]) => {
          return keyPrefix.includes(key);
        });

        if (matchedPrefixes.length === 0) {
          return 'unknown';
        } else if (matchedPrefixes.length === 1) {
          return matchedPrefixes[0][1];
        } else if (matchedPrefixes.length <= 5) {
          return `Found ${matchedPrefixes.length} matches: ` +
            matchedPrefixes
              .map((value) => value[1])
              .join(', ');
        } else {
          return `Found ${matchedPrefixes.length} matches`;
        }
      }

      return 'unknown';
    },
    [isValid, key, allStoragePrefixes]
  );

  return (
    <>
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
      <section>
        <div className='storage--actionrow-decoded'>
          <Output
            isDisabled
            label={t<string>('Decoded pallet name and call')}
            value={decodedKey}
            withCopy
          />
        </div>
      </section>
    </>
  );
}

export default React.memo(Raw);
