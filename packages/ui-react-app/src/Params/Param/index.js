// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param, Param$Type } from '@polkadot/primitives/param';
import type { I18nProps } from '../../types';
import type { ComponentMap, RawParam } from '../types';

import React from 'react';

import translate from '../../translate';
import typeToText from '../typeToText';
import findComponent from './findComponent';

type Props = I18nProps & {
  overrides?: ComponentMap,
  subject: rxjs$BehaviorSubject<RawParam>,
  value: Param & {
    name: string
  };
};

function ParamComponent ({ className, overrides, style, subject, value: { name, type, options = {} } = {} }: Props): React$Node {
  if (!type) {
    return null;
  }

  const Component = findComponent(type, overrides);
  const renderComponent = (Component: React$ComponentType<*>, index: number = -1) => {
    const _type: Param$Type = Array.isArray(type)
      ? type[index]
      : type;
    const text = typeToText(_type);
    const labelExtra = index === -1
      ? ''
      : ` (${index})`;

    return (
      <Component
        className='ui--Param'
        key={`${name}:${text}:${index}}`}
        label={`${name}: ${text}${labelExtra}`}
        // FIXME subjects are not for array components (as defined here)
        subject={subject}
        value={{
          options,
          type: _type
        }}
      />
    );
  };

  return Array.isArray(Component)
    ? Component.map(renderComponent)
    : renderComponent(Component);
}

export default translate(ParamComponent);
