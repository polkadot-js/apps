// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

function Ink3Banner ({ className = '' }: Props): React.ReactElement<Props> | null {
  const [isVisible, toggleVisible] = useToggle(true);
  const { t } = useTranslation();

  if (!isVisible) {
    return null;
  }

  return (
    <article className={`${className} warning centered`}>
      <div className='box'>
        <p>{t<string>('This contracts interface only supports Substrate 2.0 with contracts using Ink! 3.0 or solang with latest metadata generation.')}</p>
        <p>{t<string>('Older versions of the contracts ABI cannot be used and will display an error indicating an invalid ABI when uploaded. Ensure you follow the Ink! or solang upgrade instructions if you are using an older version.')}</p>
        <p>{t<string>("With the ABI updates, there may still be dragons... the new ABI formats are a complete departure and required a lot of under-the-hood changes. So when something doesn't quite work as expected, please let us know via GH issues.")}</p>
        <Button.Group>
          <Button
            icon='times'
            label={t<string>('Understood, close this')}
            onClick={toggleVisible}
          />
        </Button.Group>
      </div>
    </article>
  );
}

export default React.memo(styled(Ink3Banner)`
  .box {
    padding: 0 0.5rem;

    .ui--Button-Group {
      margin-bottom: 0;
    }
  }
`);
