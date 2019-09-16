// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressMini, Icon, InputAddress, Labelled, TxButton } from '@polkadot/react-components';
import { ComponentProps } from './types';

import styled from 'styled-components';

import translate from './translate';

interface Props extends I18nProps, ComponentProps {}

interface State {
  selected?: string;
}

const SudoInputAddress = styled(InputAddress)`
  margin: -0.25rem 0.5rem -0.25rem 0;
`;

const SudoLabelled = styled(Labelled)`
  align-items: center;
`;

class SetKey extends React.PureComponent<Props, State> {
  public state: State = {};

  public constructor (props: Props) {
    super(props);

    this.state = {
      selected: props.sudoKey
    };
  }

  public static getDerivedStateFromProps ({ sudoKey }: Props, state: State): Pick<State, never> {
    if (sudoKey && (!state.selected || sudoKey !== state.selected)) {
      return { selected: sudoKey };
    }
    return {};
  }

  public render (): React.ReactNode {
    const { className, isMine, sudoKey, t } = this.props;
    const { selected } = this.state;

    return (
      <section>
        <section className={`${className} ui--row`}>
          {isMine
            ? (
              <>
                <SudoInputAddress
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
                  labelIcon='sign-in'
                  params={[selected]}
                  tx='sudo.setKey'
                />
              </>
            )
            : (
              <SudoLabelled
                className='ui--Dropdown'
                label={t('sudo key')}
                withLabel
              >
                <AddressMini value={sudoKey} />
              </SudoLabelled>
            )
          }
        </section>
        {this.willLose() && (
          <article className='warning padded'>
            <div>
              <Icon name='warning' />
              {t('You will no longer have sudo access')}
            </div>
          </article>
        )}
      </section>
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
      !Object.keys(allAccounts).find((s): boolean => s === selected)
    );
  }
}

export default translate(styled(SetKey as React.ComponentClass<Props, State>)`
  align-items: flex-end;
  justify-content: center;

  .summary {
    text-align: center;
  }
`);
