// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { RawParam } from '../types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import findComponent from './findComponent';
import createSubjects from './subjects';
import typeToText from './typeToText';

type Props = I18nProps & {
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

function Params ({ className, style, subject, value: { name, params = {} } }: Props): React$Node {
  const paramNames = Object.keys(params);

  if (!paramNames.length === 0) {
    return null;
  }

  const subjects = createSubjects(params, subject);

  return (
    <div
      className={['extrinsics--Params', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='extrinsics--Params-Content'>
        {paramNames.map((name, index) => {
          const param = params[name];
          const Component = findComponent(param.type);

          return (
            <Component
              className='extrinsics--Param'
              key={`${name}:${name}:${index}`}
              label={`${name}: ${typeToText(param.type)}`}
              subject={subjects[index]}
              value={param}
            />
          );
        })}
      </div>
    </div>
  );
}

export default translate(Params);
