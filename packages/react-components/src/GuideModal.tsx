// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useToggle } from '@canvas-ui/react-hooks';
import { classes } from '@canvas-ui/react-util';
import { VoidFn } from '@canvas-ui/react-util/types';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import Button from './Button';
import Modal from './Modal';
import { useTranslation } from './translate';
import { BareProps } from './types';

interface Page {
  content: React.ReactNode;
  header: React.ReactNode;
}

interface Props extends BareProps {
  onClose: VoidFn;
}

function GuideModal ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle(true);
  const [index, setIndex] = useState(0);

  const incrementIndex = useCallback(
    (): void => setIndex(index + 1),
    [index]
  );

  const decrementIndex = useCallback(
    (): void => setIndex(index - 1),
    [index]
  );

  const _setIndex = useCallback(
    (index: number): () => void => {
      return function () {
        setIndex(index);
      };
    },
    []
  );

  const _onClose = useCallback(
    (): void => {
      toggleIsOpen();
      onClose && onClose();
    },
    [onClose, toggleIsOpen]
  );

  const pages = useMemo(
    (): Page[] => [
      {
        content: (
          <>
            <p>
              {t<string>('This quick intro will take you through the working flow of uploading, instantiating, and interacting with smart contracts via the Canvas UI.')}
            </p>
            <p>
              {t<string>('You will need to have a built contract ready to upload. If you’re new to ink! smart contracts,')}
              {' '}
              <a
                href='https://substrate.dev/substrate-contracts-workshop/'
                rel='noopener noreferrer'
                target='_blank'
              >
                {t<string>('check out the tutorial on the Substrate Developer Hub')}
              </a>
              {'.'}
            </p>
          </>
        ),
        header: t<string>('About Canvas smart contracts')
      },
      {
        content: (
          <>
            <p>
              {t<string>('After having tested and built your contract, you’re ready to upload the generated WebAssembly file on the Canvas chain. In the upload section you can also add the generated metadata.json file as an ABI.')}
            </p>
            <p>
              {t<string>('A unique code hash identifies the code put on chain so that duplications of the same code on chain can be avoided. You can add an already existing code bundle to the UI by pasting its unique code hash.')}
            </p>
          </>
        ),
        header: t<string>('Upload')
      },
      {
        content: (
          <>
            <p>
              {t<string>('With the code uploaded to the chain, it is time to instantiate it and instantiate a contract.')}
            </p>
            <p>
              {t<string>('This quick intro will take you through the working flow of uploading, instantiating and interacting with smart contracts on the Canvas chain.')}
            </p>
          </>
        ),
        header: t<string>('Instantiate')
      },
      {
        content: (
          <>
            <p>
              {t<string>('You can now interact with your contract on chain. The uploaded ABI provides you with messages to call.')}
            </p>
            <p>
              {t<string>('Using a contract’s unique code hash, you can also add and interact with already instantiated contracts via the Canvas UI.')}
            </p>
          </>
        ),
        header: t<string>('Execute')
      }
    ],
    [t]
  );

  const [header, content] = useMemo(
    (): [React.ReactNode, React.ReactNode] => {
      const { content, header } = pages[index];

      return [
        header,
        (
          <>
            {content}
            <div className='page-control'>
              {pages.map((_, pageIndex): React.ReactNode => {
                return (
                  <div
                    className={classes('page', index === pageIndex && 'isActive')}
                    key={`guide-page-${pageIndex}`}
                    onClick={_setIndex(pageIndex)}
                  />
                );
              })}
            </div>
          </>
        )
      ];
    },
    [index, pages, _setIndex]
  );

  const isFirstPage = index === 0;
  const isLastPage = index === pages.length - 1;

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      onClose={_onClose}
    >
      <Modal.Header>
        {header}
      </Modal.Header>
      <Modal.Content>
        {content}
      </Modal.Content>
      <Modal.Actions
        cancelLabel={t<string>(isFirstPage ? 'Skip Intro' : 'Go Back')}
        onCancel={isFirstPage ? _onClose : decrementIndex}
      >
        <Button
          isPrimary
          label={t<string>(isLastPage ? 'Let\'s Go' : 'Next')}
          onClick={isLastPage ? _onClose : incrementIndex}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default styled(React.memo(GuideModal))`
  height: 320px;

  &.visible.transition {
    display: flex !important;
    flex-direction: column;
  }

  .content {
    flex-grow: 1;
  }

  .page-control {
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
    
    .page {
      background: var(--grey40);
      cursor: pointer;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 2rem;

      &:not(.isActive):hover {
        background: var(--grey50);
      }

      &:not(:last-child) {
        margin-right: 0.5rem;
      }

      &.isActive {
        background: var(--grey60);
      }
    }
  }
`;
