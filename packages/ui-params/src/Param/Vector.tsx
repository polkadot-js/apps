// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithNamespaces } from 'react-i18next';
import { TypeDef } from '@polkadot/types/codec';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Button } from '@polkadot/ui-app/index';
import translate from '@polkadot/ui-app/translate';
import { isUndefined } from '@polkadot/util';

import getInitValue from '../initValue';
import Bare from './Bare';
import findComponent from './findComponent';

type Props = BareProps & WithNamespaces;

type State = {
  Component: React.ComponentType<BareProps> | null,
  type?: string,
  values: Array<RawParam>
};

class Vector extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      Component: null,
      values: []
    };
  }

  static getDerivedStateFromProps ({ defaultValue: { value = [] }, isDisabled, type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    return {
      Component: findComponent(sub as TypeDef),
      type,
      values: isDisabled || prevState.values.length === 0
        ? value.map((value: any) =>
            isUndefined(value) || isUndefined(value.isValid)
              ? {
                isValid: isUndefined(value),
                value
              }
              : value
          )
        : prevState.values
    };
  }

  render () {
    const { className, isDisabled, style, type, withLabel } = this.props;
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
          text={t('Add item')}
        />
        <Button
          isDisabled={values.length === 1}
          isNegative
          onClick={this.rowRemove}
          text={t('Remove item')}
        />
      </div>
    );
  }

  private onChange = (index: number) => {
    const { onChange } = this.props;

    return (value: RawParam): void => {
      let isValid = value.isValid;
      const values = this.state.values.map((svalue, sindex) => {
        if (sindex === index) {
          return value;
        }

        isValid = isValid && svalue.isValid;

        return svalue;
      });

      this.setState({ values }, () => {
        onChange && onChange({
          isValid,
          value: values.map(({ value }) => value)
        });
      });
    };
  }

  private rowAdd = (): void => {
    const { type } = this.props;
    const { values } = this.state;

    const value = getInitValue(type);

    this.setState({
      values: values.concat({
        isValid: !isUndefined(value),
        value
      })
    });
  }

  private rowRemove = (): void => {
    const { values } = this.state;

    this.setState({
      values: values.slice(0, values.length - 1)
    });
  }
}

export default translate(Vector);
