// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button, CardGrid } from '@polkadot/ui-app';
import { withMulti } from '@polkadot/ui-api';

import translate from '../translate';
import Add from './Add';
import Contract from './Contract';
import Call from './Call';

type Props = ComponentProps & I18nProps & RouteComponentProps;

interface State {
  isAddOpen: boolean;
  isCallOpen: boolean;
  callAddress: string | null;
  callMethod: string | null;
}

class Contracts extends React.PureComponent<Props, State> {
  public state: State = {
    callAddress: null,
    callMethod: null,
    isAddOpen: false,
    isCallOpen: false
  };

  public render (): React.ReactNode {
    const { accounts, basePath, contracts, hasCode, showDeploy, t } = this.props;
    const { callAddress, callMethod, isAddOpen, isCallOpen } = this.state;

    return (
      <>
        <CardGrid
          emptyText={t('No contracts available')}
          buttons={
            <Button.Group>
              {hasCode && (
                <>
                  <Button
                    isPrimary
                    label={t('Deploy a code hash')}
                    labelIcon='cloud upload'
                    onClick={showDeploy()}
                  />
                  <Button.Or />
                </>
              )}
              <Button
                label={t('Add an existing contract')}
                labelIcon='add'
                onClick={this.showAdd}
              />
            </Button.Group>
          }
        >
          {accounts && contracts && Object.keys(contracts).map((address): React.ReactNode => {
            return (
              <Contract
                basePath={basePath}
                address={address}
                key={address}
                onCall={this.showCall}
              />
            );
          })}
        </CardGrid>
        <Add
          basePath={basePath}
          isOpen={isAddOpen}
          onClose={this.hideAdd}
        />
        <Call
          address={callAddress}
          isOpen={isCallOpen}
          method={callMethod}
          onClose={this.hideCall}
        />
      </>
    );
  }

  private showAdd = (): void => {
    this.setState({
      isAddOpen: true
    });
  }

  private hideAdd = (): void => {
    this.setState({
      isAddOpen: false
    });
  }

  private showCall = (callAddress?: string, callMethod?: string): void => {
    this.setState({
      isCallOpen: true,
      callAddress: callAddress || null,
      callMethod: callMethod || null
    });
  }

  private hideCall = (): void => {
    this.setState({
      isCallOpen: false,
      callAddress: null,
      callMethod: null
    });
  }
}

export default withMulti(
  Contracts,
  translate,
  withRouter
);
