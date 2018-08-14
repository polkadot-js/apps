// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { KeyValue } from '@polkadot/params/types';
import { Props as BaseProps, RawParam } from '../types';

import React from 'react';
import assert from '@polkadot/util/assert';
import isHex from '@polkadot/util/is/hex';
import u8aToUtf8 from '@polkadot/util/u8a/toUtf8';
import toU8a from '@polkadot/util/u8a/toU8a';
import u8aToHex from '@polkadot/util/u8a/toHex';

import translate from '../../translate';
import Base from './Base';
import Bytes from './Bytes';
import BytesFile from './File';

type Props = BaseProps & {
  t: TranslationFunction
};

type State = {
  placeholder?: string;
};

type Pairs = Array<KeyValue>;

class StorageKeyValueArray extends React.PureComponent<Props, State> {
  private placeholderEmpty: string;

  constructor (props: Props) {
    super(props);

    this.placeholderEmpty = props.t('kvarray.empty', {
      defaultValue: 'drag and drop JSON key/value (hex-encoded) file'
    });
    this.state = {
      placeholder: this.placeholderEmpty
    };
  }

  render () {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;
    const { placeholder } = this.state;

    if (isDisabled) {
      return this.renderReadOnly();
    }

    return (
      <BytesFile
        className={className}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChange}
        placeholder={placeholder}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  private renderReadOnly () {
    const { className, defaultValue: { value }, label, style } = this.props;

    return (
      <Base
        className={className}
        label={label}
        size='full'
        style={style}
      >
        {(value as Pairs).map(({ key, value }) => {
          const keyHex = u8aToHex(key);

          return (
            <Bytes
              defaultValue={{ value } as RawParam}
              key={keyHex}
              label={keyHex}
              name={keyHex}
            />
          );
        })}
      </Base>
    );
  }

  private onChange = (raw: Uint8Array): void => {
    const { onChange, t } = this.props;
    let value: KeyValue[] = [];

    try {
      value = this.parseFile(raw);

      this.setState({
        placeholder: t('kvarray.values', {
          defaultValue: '{{count}} key/value pairs encoded for submission',
          replace: {
            count: value.length
          }
        })
      });
    } catch (error) {
      console.error('Error converting json k/v', error);

      this.setState({
        placeholder: this.placeholderEmpty
      });
    }

    onChange && onChange({
      isValid: value.length !== 0,
      value
    });
  }

  private parseFile (raw: Uint8Array): Array<KeyValue> {
    const json = JSON.parse(u8aToUtf8(raw));

    return Object.keys(json).map((key) => {
      const value = json[key];

      assert(isHex(key) && isHex(value), `Non-hex key/value pair found in ${key.toString()} => ${value.toString()}`);

      return {
        key: toU8a(key),
        value: toU8a(value)
      };
    });
  }
}

export default translate(StorageKeyValueArray);
