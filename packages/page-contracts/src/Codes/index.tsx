// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, CardGrid } from '@polkadot/react-components';

import contracts from '../store';
import translate from '../translate';

import Code from './Code';
import Upload from './Upload';
import Add from './Add';

interface Props extends ComponentProps, I18nProps {}

interface State {
  isAddOpen: boolean;
  isUploadOpen: boolean;
}

class Codes extends React.PureComponent<Props, State> {
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
          buttons={
            <Button.Group>
              <Button
                icon='upload'
                label={t('Upload WASM')}
                onClick={this.showUpload}
              />
              <Button
                icon='add'
                label={t('Add an existing code hash')}
                onClick={this.showAdd}
              />
            </Button.Group>
          }
          emptyText={t('No code hashes available')}
        >
          {contracts.getAllCode().map((code): React.ReactNode => {
            return (
              <Code
                code={code}
                key={code.json.codeHash}
                showDeploy={showDeploy}
              />
            );
          })}
        </CardGrid>
        <Upload
          basePath={basePath}
          isNew
          isOpen={isUploadOpen}
          onClose={this.hideUpload}
        />
        <Add
          basePath={basePath}
          isOpen={isAddOpen}
          onClose={this.hideAdd}
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
