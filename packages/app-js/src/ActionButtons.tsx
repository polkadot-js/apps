// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Button as SUIB, Popup } from 'semantic-ui-react';
import { Button, Input } from '@polkadot/react-components';

import translate from './translate';

type Props = BareProps & I18nProps & {
  isCustomExample: boolean;
  isRunning: boolean;
  generateLink: () => void;
  removeSnippet: () => void;
  runJs: () => void;
  saveSnippet: (snippetName: string) => void;
  snippetName?: string;
  stopJs: () => void;
};

interface State {
  isOpen: boolean;
  shareText: string;
  snippetName: string;
}

class ActionButtons extends React.PureComponent<Props, State> {
  public state: State = {
    isOpen: false,
    shareText: this.props.t('Generate link to share code example'),
    snippetName: ''
  };

  public render (): React.ReactNode {
    const {
      props: { isCustomExample, isRunning, removeSnippet, runJs, stopJs, t },
      state: { isOpen, shareText, snippetName }
    } = this;

    return (
      <div className='action-button'>
        <Popup
          content={shareText}
          on='hover'
          onClose={this.onShareClose}
          trigger={
            <SUIB
              circular
              icon='share alternate'
              onClick={this.generateLink}
            />
          }
          wide='very'
        />
        {
        // FIXME: The <Popup /> event trigger on='hover' does not work together with the ui-app'
        // <Button /> component. That's why the original Semantic UI component is being used here.
        }
        {isCustomExample && (
          <Popup
            content={t('Delete this custom example')}
            on='hover'
            trigger={
              <SUIB
                circular
                icon='trash alternate outline'
                negative
                onClick={removeSnippet}
              />
            }
          />
        )}
        {!(isCustomExample) && (
          <Popup
            className='popup-local'
            on='click'
            onClose={this.onPopupClose}
            open={isOpen}
            trigger={
              <SUIB
                circular
                onClick={this.onPopupOpen}
                icon='save'
              />
            }
          >
            <Input
              autoFocus
              onChange={this.onChangeName}
              onEnter={this.saveSnippet}
              maxLength={50}
              min={1}
              placeholder={t('Name your example')}
              value={snippetName}
              withLabel={false}
            />
            <Button
              isDisabled={!snippetName.length}
              isPositive
              label={t('Save snippet to local storage')}
              onClick={this.saveSnippet}
            />
          </Popup>
        )}
        <Button
          icon='play'
          isCircular
          isPositive
          onClick={runJs}
        />
        <Button
          icon='close'
          isCircular
          isDisabled={!isRunning}
          isNegative
          onClick={stopJs}
        />
      </div>
    );
  }

  private generateLink = (): void => {
    const { generateLink, t } = this.props;

    this.setState({ shareText: t('Copied to clipboard') });
    generateLink();
  }

  private onShareClose = (): void => {
    this.setState({ shareText: this.props.t('Generate link to share code example') });
  }

  private onChangeName = (snippetName: string): void => {
    this.setState({ snippetName });
  }

  private saveSnippet = (): void => {
    const { state: { snippetName }, props: { saveSnippet } } = this;

    saveSnippet(snippetName);
    this.setState({ snippetName: '', isOpen: false });
  }

  private onPopupOpen = (): void => {
    this.setState({ isOpen: true, snippetName: this.props.snippetName || '' });
  }

  private onPopupClose = (): void => {
    this.setState({ snippetName: '', isOpen: false });
  }
}

export default translate(ActionButtons);
