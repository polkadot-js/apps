// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BaseProps, RawParam } from '../types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import findComponent from './findComponent';
import createSubjects from './subjects';
import typeToText from './typeToText';

type Props = BaseProps & {
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

function Params ({ className, style, subject, value: { name, params } }: Props): React$Node {
  if (!params || !params.length) {
    return null;
  }

  const subjects = createSubjects(params, subject);

  return (
    <div
      className={['extrinsics--Params', 'extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='extrinsics--Params-Content'>
        {params.map((value, index) => {
          const Component = findComponent(value.type);

          return (
            <Component
              className='extrinsics--Param'
              key={`${name}:${value.name}:${index}`}
              label={`${value.name}: ${typeToText(value.type)}`}
              subject={subjects[index]}
              value={value}
            />
          );
        })}
      </div>
    </div>
  );
}

export default translate(Params);
