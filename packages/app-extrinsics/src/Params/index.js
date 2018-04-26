// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Params } from '../extrinsics/types';
import type { BaseProps } from '../types';

import './Params.css';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';

import Param from '../Param';
import translate from '../translate';
import createSubjects from './subjects';

type Props = BaseProps & {
  subjects?: Array<rxjs$BehaviorSubject<*>>,
  value?: Extrinsic$Params;
};

function Params ({ className, style, subjects, t, value }: Props): React$Node {
  if (!value || !value.length) {
    return null;
  }

  const _subjects = subjects || createSubjects(value);

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
        <div className='extrinsics-Params-Content'>
          {value.map((param, index) => (
            <Param
              key={`${param.name}:${param.type}`}
              subject={_subjects[index]}
              value={param}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default translate(Params);
