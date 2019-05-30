// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { TypeDef } from '@polkadot/types';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Button } from '@polkadot/ui-app';
import translate from '@polkadot/ui-app/translate';
import { isUndefined } from '@polkadot/util';

import getInitValue from '../initValue';
import Bare from './Bare';
import findComponent from './findComponent';

type Props = BareProps & WithTranslation;

type State = {
  Component: React.ComponentType<BareProps> | null,
  type?: string,
  values: Array<RawParam>
};

class Vector extends React.PureComponent<Props, State> {
  state: State = {
    Component: null,
    values: []
  };

  static getDerivedStateFromProps ({ defaultValue: { value = [] }, isDisabled, type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    const values: Array<RawParam> = isDisabled || prevState.values.length === 0
      ? value.map((value: any) =>
          isUndefined(value) || isUndefined(value.isValid)
            ? {
              isValid: !isUndefined(value),
              value
            }
            : value
        )
      : prevState.values;

    return {
      Component: findComponent(sub as TypeDef),
      type,
      values
    };
  }

  render () {
    const { className, isDisabled, onEnter, style, type, withLabel } = this.props;
    const { Component, values } = this.state;
    const subType = type.sub as TypeDef;

    if (!Component) {
      return null;
    }

    return (
      <Bare
        className={className}
        style={style}
      >
        {values.map((value, index) => (
          <Component
            defaultValue={value}
            isDisabled={isDisabled}
            key={index}
            label={`${index}: ${subType.type}`}
            onChange={this.onChange(index)}
            onEnter={onEnter}
            type={subType}
            withLabel={withLabel}
          />
        ))}
        {this.renderButtons()}
      </Bare>
    );
  }

  private renderButtons () {
    const { isDisabled, t } = this.props;
    const { values } = this.state;

    if (isDisabled) {
      return null;
    }

    return (
      <div className='ui--Param-Vector-buttons'>
        <Button
          isPrimary
          onClick={this.rowAdd}
          label={t('Add item')}
        />
        <Button
          isDisabled={values.length === 1}
          isNegative
          onClick={this.rowRemove}
          label={t('Remove item')}
        />
      </div>
    );
  }

  private onChange = (index: number) => {
    return (value: RawParam): void => {
      this.setState(
        ({ values }: State) => ({
          values: values.map((svalue, sindex) =>
            (sindex === index)
              ? value
              : svalue
        )}),
        () => {
          const { values } = this.state;
          const { onChange } = this.props;

          onChange && onChange({
            isValid: values.reduce((result: boolean, { isValid }) => result && isValid, true),
            value: values.map(({ value }) => value)
          });
        }
      );
    };
  }

  private rowAdd = (): void => {
    this.setState(({ values }: State, { type: { sub } }: Props) => {
      const value = getInitValue(sub as TypeDef);

      return {
        values: values.concat({
          isValid: !isUndefined(value),
          value
        })
      };
    });
  }

  private rowRemove = (): void => {
    this.setState(({ values }: State) => ({
      values: values.slice(0, values.length - 1)
    }));
  }
}

export default translate(Vector);
