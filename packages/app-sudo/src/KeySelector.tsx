// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, TxButton } from '@polkadot/ui-app';
import { AccountId } from '@polkadot/types';

import translate from './translate';

type Props = I18nProps & {
  onChange: (accountId?: string) => void,
  isMine: boolean,
  sudoKey: string
};

type State = {
  accountId?: string
};

class KeySelector extends React.PureComponent<Props, State> {
  state: State = {};

  constructor (props: Props) {
    super(props);

    this.state = {
      accountId: props.sudoKey
    } as State;
  }

  render () {
    const { isMine, sudoKey, t } = this.props;
    const { accountId } = this.state;

    return (
      <section className='template--AccountSelector ui--row'>
        <InputAddress
          value={accountId}
          label={t('sudo key')}
          isInput={true}
          onChange={this.onChange}
          type='account'
        />
        <TxButton
          accountId={accountId}
          isDisabled={!isMine || sudoKey === accountId}
          isPrimary
          label={t('Reassign')}
          params={[accountId]}
          tx='sudo.setKey'
        />
      </section>
    );
  }

  private onChange = (accountId?: string): void => {
    const { onChange } = this.props;

    this.setState({ accountId }, () =>
      onChange(accountId)
    );
  }
}
export default translate(KeySelector);
