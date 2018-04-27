// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '../extrinsics/types';
import type { BaseProps, RawParam } from '../types';

import './Params.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import translate from '../translate';
import Param from './Param';
import createSubscriber from './subscriber';

type Props = BaseProps & {
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

function Params ({ className, style, subject, t, value: { name, params } }: Props): React$Node {
  if (!params || !params.length) {
    return null;
  }

  const subjects = createSubscriber(params, subject);

  return (
    <div
      className={['extrinsics--Params', 'extrinsics--split', className].join(' ')}
      style={style}
    >
      <div className='full'>
        <Label>
          {t('params.intro', {
            defaultValue: 'with the supplied parameters'
          })}
        </Label>
        <div className='extrinsics--Params-Content'>
          {params.map((param, index) => (
            <Param
              className='extrinsics--Params-Param'
              key={`${name}:${param.name}:${param.type}`}
              subject={subjects[index]}
              value={param}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default translate(Params);
