// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import subjects from '../subjects';
import translate from '../translate';
import Add from './Add';

type Props = I18nProps & {};

function Selection ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--Selection', 'storage--actionrow', className].join(' ')}
      style={style}
    >
      <div className='storage--actionrow-value'>
        <div className='ui--form'>
          <div className='full'>
            <InputStorage
              labelSection={t('selection.section', {
                defaultValue: 'query storage area'
              })}
              subject={subjects.next}
            />
          </div>
        </div>
      </div>
      <div className='storage--actionrow-button'>
        <Label>&nbsp;</Label>
        <Add />
      </div>
    </div>
  );
}

export default translate(Selection);
