// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, InputErrorMessage } from '@polkadot/ui-app/types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

import translate from '../translate';

type Props = I18nProps & {
  error: InputErrorMessage
};

class InputError extends React.PureComponent<Props> {
  render () {
    const { className, error, style, t } = this.props;

    if (!Object.keys(error).length) {
      return null;
    }

    return (
      <div
        className={classes('ui--InputError', className)}
        style={style}
      >
        {t(error.key, {
          defaultValue: `${error.key}: ${error.value}`
        })}
      </div>
    );
  }
}

export default translate(InputError);
