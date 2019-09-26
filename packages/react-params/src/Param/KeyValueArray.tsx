// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyValue as Pair } from '@polkadot/types/interfaces';
import { Props as BaseProps, RawParam } from '../types';

import React, { useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { Vec } from '@polkadot/types';
import translate from '@polkadot/react-components/translate';
import { assert, isHex, u8aToHex, u8aToString } from '@polkadot/util';

import Base from './Base';
import Bytes from './Bytes';
import File from './File';
import { createParam } from './KeyValue';

interface Props extends BaseProps, WithTranslation {}

interface Parsed {
  isValid: boolean;
  value: [Uint8Array, Uint8Array][];
}

const BYTES_TYPE = {
  type: 'Bytes',
  info: 0
};

const EMPTY_PLACEHOLDER = 'click to select or drag and drop JSON key/value (hex-encoded) file';

function parseFile (raw: Uint8Array): Parsed {
  const json = JSON.parse(u8aToString(raw));
  const keys = Object.keys(json);
  let isValid = keys.length !== 0;
  const value = keys.map((key): [Uint8Array, Uint8Array] => {
    const value = json[key];

    assert(isHex(key) && isHex(value), `Non-hex key/value pair found in ${key.toString()} => ${value.toString()}`);

    const encKey = createParam(key);
    const encValue = createParam(value);

    isValid = isValid && encKey.isValid && encValue.isValid;

    return [encKey.u8a, encValue.u8a];
  });

  return {
    isValid,
    value
  };
}

function KeyValueArray ({ className, defaultValue, isDisabled, isError, label, onChange, onEnter, style, t, withLabel }: Props): React.ReactElement<Props> {
  const [placeholder, setPlaceholder] = useState(t(EMPTY_PLACEHOLDER));

  if (isDisabled) {
    const pairs = defaultValue.value as Vec<Pair>;

    return (
      <>
        <Base
          className={className}
          label={label}
          style={style}
        >
          <div />
        </Base>
        <div className='ui--Params'>
          {pairs.map(([key, value]): React.ReactNode => {
            const keyHex = u8aToHex(key.toU8a(true));

            return (
              <Bytes
                defaultValue={{ value } as unknown as RawParam}
                isDisabled
                isOptional={false}
                key={keyHex}
                label={keyHex}
                name={keyHex}
                onEnter={onEnter}
                type={BYTES_TYPE}
              />
            );
          })}
        </div>
      </>
    );
  }

  const _onChange = (raw: Uint8Array): void => {
    let encoded: Parsed = { isValid: false, value: [] };

    try {
      encoded = parseFile(raw);

      setPlaceholder(t('{{count}} key/value pairs encoded for submission', {
        replace: {
          count: encoded.value.length
        }
      }));
    } catch (error) {
      console.error('Error converting json k/v', error);

      setPlaceholder(t(EMPTY_PLACEHOLDER));
    }

    onChange && onChange(encoded);
  };

  return (
    <File
      className={className}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={_onChange}
      placeholder={placeholder}
      style={style}
      withLabel={withLabel}
    />
  );
}

export default translate(KeyValueArray);
