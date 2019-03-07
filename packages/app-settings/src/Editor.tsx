// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import CodeFlask from 'codeflask';

import translate from './translate';

type Props = BareProps & I18nProps & {
  code: string,
  onEdit: (code: string) => void
};

class Editor extends React.Component<Props> {
  private editor: any;

  componentDidMount () {
    const { onEdit } = this.props;

    this.editor = new CodeFlask(`#codeflask`, {
      language: 'js',
      lineNumbers: true
    });

    this.editor.updateCode(this.props.code);

    this.editor.editorRoot.addEventListener('keydown', () => {
      this.editor.onUpdate(this.onEdit);
    });
  }

  shouldComponentUpdate (nextProps: Props): boolean {
    return (
      nextProps.code !== this.props.code
    );
  }

  componentDidUpdate () {
    this.editor.updateCode(this.props.code);
  }

  render () {
    const { t } = this.props;

    return (
      <div className='ui--row'>
        <div className='full'>
          <div className='ui--Labelled'>
            <label>{t('Manually enter your custom type definitions as valid JSON')}</label>
            <div className='ui--Labelled-content'>
              <div id='codeflask' className='editor' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onEdit = (code: string): void => {
    this.setState((prevState: State): State => ({
      code
    } as State));
  }
}

export default translate(Editor);
