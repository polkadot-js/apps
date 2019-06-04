// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '../types';

import React from 'react';
import { WithTranslation } from 'react-i18next';
import { Enum, TypeDef, createType, getTypeDef } from '@polkadot/types';
import { Dropdown, Static } from '@polkadot/ui-app';
import translate from '@polkadot/ui-app/translate';

import getValues from '../values';
import findComponent from './findComponent';
import Bare from './Bare';
import Null from './Null';

type Props = WithTranslation & BaseProps;

type State = {
  Child: React.ComponentType<BaseProps>,
  def: TypeDef | null,
  defValue: RawParam,
  options: Array<{ text: string, value: string }>,
  sub: Array<TypeDef>,
  type: string | null
};

class EnumParam extends React.PureComponent<Props, State> {
  state: State = {
    Child: Null,
    def: null,
    defValue: { isValid: false, value: undefined },
    options: [],
    sub: [],
    type: null
  };

  static getDerivedStateFromProps ({ type: { type } }: Props, prevState: State) {
    if (prevState.type === type) {
      return null;
    }

    const sub = getTypeDef(createType(type).toRawType()).sub as Array<TypeDef>;
    const options = sub.map(({ name }) => ({
      text: name,
      value: name
    }));
    const def = prevState.def || sub[0];
    const defValue = getValues([{ type: def }])[0];

    return {
      def,
      defValue,
      options,
      sub,
      type
    } as State;
  }

  render () {
    const { className, defaultValue, isDisabled, isError, label, style, t, withLabel } = this.props;

    if (isDisabled) {
      const value = defaultValue && defaultValue.value && defaultValue.value.toString();

      return (
        <Bare
          className={className}
          style={style}
        >
          <Static
            className='full'
            label={label}
            value={value || t('empty')}
          />
        </Bare>
      );
    }

    const { Child, def, defValue, options } = this.state;
    const initialValue = defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? defaultValue.value.type
        : Object.keys(defaultValue.value)[0]
      : defaultValue;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className={'medium'}
          defaultValue={initialValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          options={options}
          onChange={this.onChange}
          withEllipsis
          withLabel={withLabel}
        />
        {def && (
          <Child
            defaultValue={defValue}
            label={'1234'}
            onChange={this.onChangeParam}
            type={def}
          />
        )}
      </Bare>
    );
  }

  private onChange = (value: string): void => {
    const { sub } = this.state;
    const def = sub.find(({ name }) => name === value);

    if (def) {
      this.setState({
        Child: findComponent(def),
        def,
        defValue: getValues([{ type: def }])[0]
      });
    }
  }

  private onChangeParam = ({ isValid, value }: RawParam): void => {
    const { onChange } = this.props;
    const { def } = this.state;

    if (def) {
      console.log({
        isValid,
        value: {
          [def.name as string]: value
        }
      });

      onChange && onChange({
        isValid,
        value: {
          [def.name as string]: value
        }
      });
    }
  }
}

export default translate(EnumParam);
