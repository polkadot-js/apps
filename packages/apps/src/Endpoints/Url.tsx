// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Toggle } from '@polkadot/react-components';

interface Props {
  apiUrl: string;
  className?: string;
  label: React.ReactNode;
  setApiUrl: (apiUrl: string) => void;
  url: string;
}

function Url ({ apiUrl, className, label, setApiUrl, url }: Props): React.ReactElement<Props> {
  const _setApiUrl = useCallback(
    () => setApiUrl(url),
    [setApiUrl, url]
  );

  return (
    <Toggle
      className={className}
      isRadio
      label={label}
      onChange={_setApiUrl}
      value={apiUrl === url}
    />
  );
}

export default React.memo(styled(Url)`
  padding: 0.25rem;
  text-align: right;
`);
