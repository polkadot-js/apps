// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import UploadButton from './UploadButton';
import translate from './translate';

type Props = I18nProps & {
  onChangeAccount: () => void
};

class Restorer extends React.PureComponent<Props> {
  render () {
    const { onChangeAccount } = this.props;

    return (
      <div className='accounts--Restorer'>
        <UploadButton onChangeAccount={onChangeAccount} />
      </div>
    );
  }
}

export {
  Restorer
};

export default translate(Restorer);
