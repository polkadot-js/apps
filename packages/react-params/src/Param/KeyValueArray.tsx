// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyValue as Pair } from '@polkadot/types/interfaces';
import { Props as BaseProps, RawParam } from '../types';

import React from 'react';
import { WithTranslation } from 'react-i18next';
import { Vec } from '@polkadot/types';
import translate from '@polkadot/react-components/translate';
import { assert, isHex, u8aToHex, u8aToString } from '@polkadot/util';

import Base from './Base';
import Bytes from './Bytes';
import File from './File';
import KeyValue from './KeyValue';

type Props = BaseProps & WithTranslation;

interface State {
  placeholder?: string;
}

interface Parsed {
  isValid: boolean;
  value: [Uint8Array, Uint8Array][];
}

const BYTES_TYPE = {
  type: 'Bytes',
  info: 0
};

class KeyValueArray extends React.PureComponent<Props, State> {
  private placeholderEmpty: string;

  public constructor (props: Props) {
    super(props);

    this.placeholderEmpty = props.t('click to select or drag and drop JSON key/value (hex-encoded) file');
    this.state = {
      placeholder: this.placeholderEmpty
    };
  }

  public render (): React.ReactNode {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;
    const { placeholder } = this.state;

    if (isDisabled) {
      return this.renderReadOnly();
    }

    return (
      <File
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

  private renderReadOnly (): React.ReactNode {
    const { className, defaultValue: { value }, label, onEnter, style } = this.props;
    const pairs = value as Vec<Pair>;

    return (
      <>
        <Base
          className={className}
          label={label}
          size='full'
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

  private onChange = (raw: Uint8Array): void => {
    const { onChange, t } = this.props;
    let encoded: Parsed = { isValid: false, value: [] };

    try {
      encoded = this.parseFile(raw);

      this.setState({
        placeholder: t('{{count}} key/value pairs encoded for submission', {
          replace: {
            count: encoded.value.length
          }
        })
      });
    } catch (error) {
      console.error('Error converting json k/v', error);

      this.setState({
        placeholder: this.placeholderEmpty
      });
    }

    onChange && onChange(encoded);
  }

  private parseFile (raw: Uint8Array): Parsed {
    const json = JSON.parse(u8aToString(raw));
    const keys = Object.keys(json);
    let isValid = keys.length !== 0;
    const value = keys.map((key): [Uint8Array, Uint8Array] => {
      const value = json[key];

      assert(isHex(key) && isHex(value), `Non-hex key/value pair found in ${key.toString()} => ${value.toString()}`);

      const encKey = KeyValue.createParam(key);
      const encValue = KeyValue.createParam(value);

      isValid = isValid && encKey.isValid && encValue.isValid;

      return [encKey.u8a, encValue.u8a];
    });

    return {
      isValid,
      value
    };
  }
}

export default translate(KeyValueArray);
