// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, CardGrid } from '@polkadot/ui-app';

import contracts from '../store';
import translate from '../translate';

import Code from './Code';
import Upload from './Upload';
import Add from './Add';

type Props = ComponentProps & I18nProps;

interface State {
  isAddOpen: boolean;
  isUploadOpen: boolean;
}

class Codes extends React.PureComponent<Props> {
  public state: State = {
    isAddOpen: false,
    isUploadOpen: false
  };

  public render (): React.ReactNode {
    const { basePath, showDeploy, t } = this.props;
    const { isAddOpen, isUploadOpen } = this.state;

    return (
      <>
        <CardGrid
          emptyText={t('No code hashes available')}
          buttons={
            <Button.Group>
              <Button
                isPrimary
                label={t('Upload WASM')}
                labelIcon='upload'
                onClick={this.showUpload}
              />
              <Button.Or />
              <Button
                label={t('Add an existing code hash')}
                labelIcon='add'
                onClick={this.showAdd}
              />
            </Button.Group>
          }
        >
          {contracts.getAllCode().map((code): React.ReactNode => {
            return (
              <Code
                key={code.json.codeHash}
                code={code}
                showDeploy={showDeploy}
              />
            );
          })}
        </CardGrid>
        <Upload
          basePath={basePath}
          isNew
          onClose={this.hideUpload}
          isOpen={isUploadOpen}
        />
        <Add
          basePath={basePath}
          onClose={this.hideAdd}
          isOpen={isAddOpen}
        />
      </>
    );
  }

  private showUpload = (): void => {
    this.setState({ isUploadOpen: true });
  }

  private hideUpload = (): void => {
    this.setState({ isUploadOpen: false });
  }

  private showAdd = (): void => {
    this.setState({ isAddOpen: true });
  }

  private hideAdd = (): void => {
    this.setState({ isAddOpen: false });
  }
}

export default translate(Codes);
