// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '../extrinsics/types';
import type { BaseProps } from '../types';

import React from 'react';

import Param from '../Param';
import createSubjects from './subjects';

type Props = BaseProps & {
  subject?: Array<rxjs$BehaviorSubject<*>>,
  value?: Extrinsic$Params;
};

export default function Params ({ className, style, subjects, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  const _subjects = subjects || createSubjects(value);

  return (
    <div
      className={['extrinsics--Params', className].join(' ')}
      style={style}
    >
      {value.map((param, index) => (
        <Param
          key={`${param.name}:${param.type}`}
          subject={_subjects[index]}
          value={param}
        />
      ))}
    </div>
  );
}
