// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { KeyValue } from '@polkadot/params/types';
import { Props as BaseProps } from '../types';

import React from 'react';
import assert from '@polkadot/util/assert';
import isHex from '@polkadot/util/is/hex';
import u8aToUtf8 from '@polkadot/util/u8a/toUtf8';
import toU8a from '@polkadot/util/u8a/toU8a';

import translate from '../../translate';
import BytesFile from './File';

type Props = BaseProps & {
  t: TranslationFunction
};

type State = {
  placeholder?: string;
};

class KeyValueStorageArray extends React.PureComponent<Props, State> {
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

  onChange = (raw: Uint8Array): void => {
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

    onChange({
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

export default translate(KeyValueStorageArray);
