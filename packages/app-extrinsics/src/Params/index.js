// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BaseProps, RawParam } from '../types';

import './Params.css';

import React from 'react';
// import Label from 'semantic-ui-react/dist/es/elements/Label';
// <Label>
//   {t('params.intro', {
//     defaultValue: 'with the supplied parameters'
//   })}
// </Label>

import translate from '../translate';
import Param from './Param';
import createSubscriber from './subscriber';
import typeToText from './typeToText';

type Props = BaseProps & {
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

function Params ({ className, style, subject, value: { name, params } }: Props): React$Node {
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
        <div className='extrinsics--Params-Content'>
          {params.map((value, index) => (
            <Param
              className='extrinsics--Params-Param'
              key={`${name}:${value.name}:${typeToText(value.type)}`}
              value={value}
              subject={subjects[index]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default translate(Params);
