// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Button from '../Button/index.js';
import i18next from '../i18n/index.js';
import Modal from './index.js';

function TestModal () {
  const [isOpen, toggleIsOpen] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={false}
        label='Open Test Modal'
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal
          header='Test Modal'
          onClose={toggleIsOpen}
          testId='test-modal'
        >
          <Modal.Content>
            Test Modal Content
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='plus'
              label='Submit Modal'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

function renderModal () {
  return render(
    <Suspense fallback='...'>
      <ThemeProvider theme={lightTheme}>
        <TestModal />
      </ThemeProvider>
    </Suspense>
  );
}

describe('Modal Component', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  // eslint-disable-next-line jest/expect-expect
  it('opens and closes modal', async () => {
    renderModal();

    await waitFor(async () => {
      await expectModalToBeClosed();
      await openModal();
      await expectModalToBeOpen();
      await closeModal();
      await expectModalToBeClosed();
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('renders all modal sections', async () => {
    renderModal();

    await waitFor(async () => {
      await expectModalToBeClosed();
      await openModal();
      await expectModalToBeOpen();

      await screen.findByText('Test Modal');
      await screen.findAllByText('Test Modal Content');
      await screen.findByRole('button', { name: 'Submit Modal' });
    });
  });

  // eslint-disable-next-line jest/expect-expect
  it('closes modal with ESC button', async () => {
    renderModal();

    await waitFor(async () => {
      await expectModalToBeClosed();
      await openModal();
      await expectModalToBeOpen();
    });

    fireEvent.keyDown(window, {
      charCode: 27,
      code: 'Escape',
      key: 'Escape',
      keyCode: 27
    });

    await waitFor(async () => {
      await expectModalToBeClosed();
    });
  });
});

async function expectModalToBeClosed () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await screen.findByRole('button', { name: 'Open Test Modal' });

  expect(screen.queryAllByTestId('test-modal')).toHaveLength(0);
}

async function expectModalToBeOpen () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await screen.findByTestId('test-modal');
}

async function openModal () {
  fireEvent.click(await screen.findByRole('button', { name: 'Open Test Modal' }));
}

async function closeModal () {
  fireEvent.click(await screen.findByTestId('close-modal'));
}
