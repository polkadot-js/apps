// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { styled, Toggle } from '@polkadot/react-components';

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
    <StyledToggle
      className={className}
      isRadio
      label={label}
      onChange={_setApiUrl}
      value={apiUrl === url}
    />
  );
}

const StyledToggle = styled(Toggle)`
  padding: 0.25rem;
  text-align: right;

  > label {
    max-width: 12.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default React.memo(Url);
