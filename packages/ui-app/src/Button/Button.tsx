// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import { isUndefined } from '@polkadot/util';

import Icon from '../Icon';
import Tooltip from '../Tooltip';

let idCounter = 0;

export default class Button extends React.PureComponent<ButtonProps> {
  private id: string = `button-${++idCounter}`;

  public render (): React.ReactNode {
    const { children, className, floated, icon, isBasic = false, isCircular = false, isDisabled = false, isLoading = false, isNegative = false, isPositive = false, isPrimary = false, label, labelIcon, labelPosition, onClick, size, style, tabIndex, tooltip } = this.props;

    const props = {
      basic: isBasic,
      circular: isCircular,
      className,
      'data-tip': !!tooltip,
      'data-for': this.id,
      disabled: isDisabled,
      floated,
      icon,
      labelPosition,
      loading: isLoading,
      negative: isNegative,
      onClick,
      positive: isPositive,
      primary: isPrimary,
      size,
      secondary: !isBasic && !(isPositive || isPrimary || isNegative),
      style,
      tabIndex
    };

    return (
      <>
        {
          isUndefined(label) && isUndefined(children)
            ? <SUIButton {...props} />
            : (
              <SUIButton {...props}>
                {!!labelIcon && (
                  <>
                    <Icon className={labelIcon} />
                    {'  '}
                  </>
                )}
                {label}
                {children}
              </SUIButton>
            )
        }
        {tooltip && (
          <Tooltip
            place='top'
            text={tooltip}
            trigger={this.id}
          />
        )}
      </>
    );
  }
}
