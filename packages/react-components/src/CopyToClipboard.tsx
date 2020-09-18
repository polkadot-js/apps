// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon } from '@polkadot/react-components';
import StatusContext from '@polkadot/react-components/Status/Context';
import { useTranslation } from '@polkadot/react-components/translate';
import React, { useCallback, useContext } from 'react';

interface Props {
  elementId: string;
  className?: string;
  description?: string;
}

function onCopy (id: string) {
  const content = document.getElementById(id);

  if (content instanceof HTMLTextAreaElement) {
    content.select();
    document.execCommand('copy');
  } else {
    throw Error(`Element (#${id}) does not exist`);
  }
}

function CopyToClipboard ({ className, elementId, description = undefined }: Props) {
  const { queueAction } = useContext(StatusContext);
  const { t } = useTranslation();

  const _onCopy = useCallback((id: string): void => {
    onCopy(id);
    queueAction({
      action: t('clipboard'),
      message: t(description ? `${description} copied` : 'copied'),
      status: 'queued'
    });
  }, [queueAction, description, t]);

  return (
    <button
      className={className}
      onClick={() => _onCopy(elementId)}
    >
      <Icon icon='copy'/>
      Copy to clipboard
    </button>
  );
}

export default React.memo(CopyToClipboard);
