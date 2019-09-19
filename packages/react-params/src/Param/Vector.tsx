// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { TypeDef } from '@polkadot/types/types';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Button } from '@polkadot/react-components';
import translate from '@polkadot/react-components/translate';
import { isUndefined } from '@polkadot/util';

import getInitValue from '../initValue';
import Bare from './Bare';
import findComponent from './findComponent';

interface Props extends BareProps, WithTranslation {}

interface State {
  Component: React.ComponentType<BareProps> | null;
  type?: string;
  values: RawParam[];
}

class Vector extends React.PureComponent<Props, State> {
  public state: State = {
    Component: null,
    values: []
  };

  public static getDerivedStateFromProps ({ defaultValue: { value = [] }, isDisabled, type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    const values: RawParam[] = isDisabled || prevState.values.length === 0
      ? value.map((value: any): RawParam => (
        isUndefined(value) || isUndefined(value.isValid)
          ? {
            isValid: !isUndefined(value),
            value
          }
          : value
      ))
      : prevState.values;

    return {
      Component: findComponent(sub as TypeDef),
      type,
      values
    };
  }

  public render (): React.ReactNode {
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
        {values.map((value, index): React.ReactNode => (
          this.isParamHidden(index)
            ? null
            : (
              <Component
                defaultValue={value}
                isDisabled={isDisabled}
                isOptional={false}
                key={index}
                label={`${index}: ${subType.type}`}
                onChange={this.onChange(index)}
                onEnter={onEnter}
                type={subType}
                withLabel={withLabel}
              />
            )
        ))}
        {this.renderButtons()}
      </Bare>
    );
  }

  private renderButtons (): React.ReactNode {
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
          labelIcon='add'
        />
        <Button
          isDisabled={values.length === 1}
          isNegative
          onClick={this.rowRemove}
          label={t('Remove item')}
          labelIcon='minus'
        />
      </div>
    );
  }

  private isParamHidden = (index: number): boolean => {
    const { isDisabled, type } = this.props;
    const { values } = this.state;

    if (type.type === 'Vec<bool>' && isDisabled && values[index].value === false) {
      return true;
    }
    return false;
  }

  private onChange = (index: number): (value: RawParam) => void => {
    return (value: RawParam): void => {
      this.setState(
        ({ values }: State): Pick<State, never> => ({
          values: values.map((svalue, sindex): RawParam =>
            (sindex === index)
              ? value
              : svalue
          )
        }),
        (): void => {
          const { values } = this.state;
          const { onChange } = this.props;

          onChange && onChange({
            isValid: values.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
            value: values.map(({ value }): any => value)
          });
        }
      );
    };
  }

  private rowAdd = (): void => {
    this.setState(({ values }: State, { type: { sub } }: Props): Pick<State, never> => {
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
    this.setState(({ values }: State): Pick<State, never> => ({
      values: values.slice(0, values.length - 1)
    }));
  }
}

export default translate(Vector);
