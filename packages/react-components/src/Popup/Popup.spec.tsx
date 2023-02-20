// Copyright 2017-2023 @polkadot/react-components  authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';

import { lightTheme } from '@polkadot/apps/themes';
import i18next from '@polkadot/react-components/i18n';

import Popup from '.';

function TestPopup () {
  return (
    <>
      <h1>Test outside text</h1>
      <Popup
        value={
          <div>
            Test popup content
          </div>
        }
      />
    </>
  );
}

function renderPopup () {
  return render(
    <Suspense fallback='...'>
      <ThemeProvider theme={lightTheme}>
        <TestPopup />
      </ThemeProvider>
    </Suspense>
  );
}

describe('Popup Component', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  it('opens and closes', async () => {
    renderPopup();

    await waitFor(async () => {
      await expectPopupToBeClosed();
      await togglePopup();
      await expectPopupToBeOpen();
      await togglePopup();
      await expectPopupToBeClosed();
    });
  });

  it('closes popup with outside click', async () => {
    renderPopup();

    await waitFor(async () => {
      await expectPopupToBeClosed();
      await togglePopup();
      await expectPopupToBeOpen();
      await clickOutside();
      await expectPopupToBeClosed();
    });
  });
});

async function expectPopupToBeClosed () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await screen.findByRole('button');
  expect(screen.queryAllByText('Test popup content')).toHaveLength(0);
}

async function expectPopupToBeOpen () {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await screen.findByText('Test popup content');
}

async function togglePopup () {
  fireEvent.click(await screen.findByTestId('popup-open'));
}

async function clickOutside () {
  fireEvent.click(await screen.findByText('Test outside text'));
}
