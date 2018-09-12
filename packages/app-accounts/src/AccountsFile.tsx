// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import InputFile from '@polkadot/ui-app/InputFile';

import translate from './translate';

type Props = BareProps & {
  acceptedFormats?: string,
  isDisabled?: boolean,
  isError?: boolean,
  label: string,
  onChange?: (contents: Uint8Array) => void,
  placeholder?: string,
  shouldDisplayFile?: boolean,
  t: TranslationFunction,
  withLabel?: boolean
};

class AccountsFile extends React.PureComponent<Props> {
  render () {
    return (
      <InputFile
        {...this.props}
        isError={false}
      />
    );
  }
}

export default translate(AccountsFile);
