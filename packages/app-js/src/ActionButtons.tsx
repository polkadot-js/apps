// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button as SUIB, Popup } from 'semantic-ui-react';
import { Button, Input } from '@polkadot/react-components';

import translate from './translate';

interface Props extends BareProps, I18nProps {
  isCustomExample: boolean;
  isRunning: boolean;
  generateLink: () => void;
  removeSnippet: () => void;
  runJs: () => void;
  saveSnippet: (snippetName: string) => void;
  snippetName?: string;
  stopJs: () => void;
}

function ActionButtons ({ className, generateLink, isCustomExample, isRunning, removeSnippet, runJs, saveSnippet, stopJs, t }: Props): React.ReactElement<Props> {
  const [isOpen, setIsOpen] = useState(false);
  const [shareText, setShareText] = useState(t('Generate link to share code example'));
  const [snippetName, setSnippetName] = useState('');

  const _generateLink = (): void => {
    setShareText(t('Copied to clipboard'));
    generateLink();
  };
  const _onShareClose = (): void => {
    setShareText(t('Generate link to share code example'));
  };
  const _onChangeName = (snippetName: string): void => {
    setSnippetName(snippetName);
  };
  const _onPopupOpen = (): void => {
    setIsOpen(true);
  };
  const _onPopupClose = (): void => {
    setSnippetName('');
    setIsOpen(false);
  };
  const _saveSnippet = (): void => {
    saveSnippet(snippetName);
    _onPopupClose();
  };

  return (
    <div className={`${className} action-button`}>
      <Popup
        content={shareText}
        on='hover'
        onClose={_onShareClose}
        trigger={
          <SUIB
            circular
            icon='share alternate'
            onClick={_generateLink}
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
          onClose={_onPopupClose}
          open={isOpen}
          trigger={
            <SUIB
              circular
              icon='save'
              onClick={_onPopupOpen}
            />
          }
        >
          <Input
            autoFocus
            onChange={_onChangeName}
            onEnter={_saveSnippet}
            maxLength={50}
            min={1}
            placeholder={t('Name your example')}
            value={snippetName}
            withLabel={false}
          />
          <Button
            icon='save'
            isDisabled={!snippetName.length}
            isPrimary
            label={t('Save snippet to local storage')}
            onClick={_saveSnippet}
          />
        </Popup>
      )}
      {isRunning
        ? (
          <Button
            icon='close'
            isCircular
            isNegative
            onClick={stopJs}
          />
        )
        : (
          <Button
            className='play-button'
            icon='play'
            isCircular
            isPrimary
            onClick={runJs}
          />
        )
      }
    </div>
  );
}

export default translate(
  styled(ActionButtons)``
);
