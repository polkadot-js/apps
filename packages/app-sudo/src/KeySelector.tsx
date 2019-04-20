// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressMini, Icon, InputAddress, Labelled, TxButton } from '@polkadot/ui-app';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import translate from './translate';

type Props = I18nProps & {
  allAccounts: SubjectInfo,
  isMine: boolean,
  sudoKey: string
};

type State = {
  selected?: string
};

class KeySelector extends React.PureComponent<Props, State> {
  state: State = {};

  constructor (props: Props) {
    super(props);

    this.state = {
      selected: props.sudoKey
    } as State;
  }

  componentWillReceiveProps ({ sudoKey = this.props.sudoKey }) {
    if (sudoKey !== this.props.sudoKey) {
      this.setState({ selected: sudoKey });
    }
  }

  render () {
    const { isMine, sudoKey, t } = this.props;
    const { selected } = this.state;

    return (
      <>
        <section className='sudo--KeySelector ui--row'>
          {isMine ? (
            <>
              <InputAddress
                className='sudo--InputAddress'
                value={selected}
                label={t('sudo key')}
                isInput={true}
                onChange={this.onChange}
                type='all'
              />
              <TxButton
                accountId={sudoKey}
                isDisabled={!isMine || sudoKey === selected}
                isPrimary
                label={t('Reassign')}
                params={[selected]}
                tx='sudo.setKey'
              />
            </>
          ) : (
              <Labelled
                className='ui--Dropdown sudo--Labelled'
                label={t('sudo key')}
                withLabel
              >
                <AddressMini value={sudoKey} />
              </Labelled>
          )}
          </section>
          {this.willLose() && (
            <article className='warning padded'>
              <div>
                <Icon name='warning' />
                {t('You will no longer have sudo access')}
              </div>
            </article>
          )}
        </>
    );
  }

  private onChange = (selected?: string): void => {
    this.setState({ selected });
  }

  private willLose = (): boolean => {
    const { allAccounts, isMine, sudoKey } = this.props;
    const { selected } = this.state;
    return (
      isMine &&
      !!Object.keys(allAccounts).length &&
      !!selected &&
      selected !== sudoKey &&
      !Object.keys(allAccounts).find(s => s === selected)
    );
  }
}
export default translate(KeySelector);
