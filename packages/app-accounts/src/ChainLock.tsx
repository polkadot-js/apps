// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/react-api';
import { Toggle } from '@polkadot/react-components';

import translate from './translate';

interface Props extends ApiProps, I18nProps {
  className?: string;
  genesisHash: string | null;
  onChange: (genesisHash: string | null) => void;
}

class ChainLock extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { api, genesisHash, isDevelopment, t } = this.props;

    if (isDevelopment) {
      return null;
    }

    const isTiedToChain = api.genesisHash.eq(genesisHash);

    return (
      <Toggle
        label={
          isTiedToChain
            ? t('only on this chain')
            : t('allow on any chain')
        }
        onChange={this.onChange}
        value={isTiedToChain}
      />
    );
  }

  private onChange = (isToggled: boolean): void => {
    const { api, onChange } = this.props;

    onChange(
      isToggled
        ? api.genesisHash.toHex()
        : null
    );
  }
}

export default withMulti(
  ChainLock,
  translate,
  withApi
);
