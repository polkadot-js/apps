// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import React from 'react';
import { createType } from '@polkadot/types';
import { Button, Icon, Extrinsic, TxButton, TxComponent } from '@polkadot/react-components';
import { withApi, withMulti } from '@polkadot/react-api';

import translate from './translate';

interface Props extends I18nProps, ApiProps, ComponentProps {
  onChange: (accountId?: string) => void;
}

interface State {
  method: Call | null;
  isValid: boolean;
}

class Propose extends TxComponent<Props, State> {
  public state: State = {
    method: null,
    isValid: false
  };

  public render (): React.ReactNode {
    const { apiDefaultTxSudo, isMine, sudoKey, t } = this.props;
    const { method, isValid } = this.state;

    return isMine
      ? (
        <section>
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t('submit the following change')}
            onChange={this.onChangeExtrinsic}
            onEnter={this.sendTx}
          />
          <br />
          <Button.Group>
            <TxButton
              accountId={sudoKey}
              label={t('Submit Sudo')}
              icon='sign-in'
              tx='sudo.sudo'
              isDisabled={!method || !isValid}
              params={method ? [createType('Proposal', method)] : []}
              ref={this.button}
            />
          </Button.Group>
        </section>
      )
      : (
        <article className='error padded'>
          <div>
            <Icon name='ban' />
            {t('You do not have access to the current sudo key')}
          </div>
        </article>
      );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { method = prevState.method } = newState;
        const isValid = !!method;

        return {
          method,
          isValid
        };
      }
    );
  }

  private onChangeExtrinsic = (method?: Call): void => {
    if (!method) {
      return;
    }

    this.nextState({ method });
  }
}

export default withMulti(
  Propose,
  translate,
  withApi
);
