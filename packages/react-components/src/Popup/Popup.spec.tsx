// Copyright 2017-2022 @polkadot/react-components  authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';

import { Popup } from '@polkadot/react-components';
import i18next from '@polkadot/react-components/i18n';

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
      <TestPopup />
    </Suspense>
  );
}

describe('Popup Component', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
  });

  it('opens and closes', async () => {
    renderPopup();

    await expectPopupToBeClosed();
    await togglePopup();
    await expectPopupToBeOpen();
    await togglePopup();
    await expectPopupToBeClosed();
  });

  it('closes popup with outside click', async () => {
    renderPopup();

    await expectPopupToBeClosed();
    await togglePopup();
    await expectPopupToBeOpen();
    await clickOutside();
    await expectPopupToBeClosed();
  });
});

async function expectPopupToBeClosed () {
  await screen.findByRole('button');
  expect(screen.queryAllByText('Test popup content')).toHaveLength(0);
}

async function expectPopupToBeOpen () {
  await screen.findByText('Test popup content');
}

async function togglePopup () {
  fireEvent.click(await screen.findByRole('button'));
}

async function clickOutside () {
  fireEvent.click(await screen.findByText('Test outside text'));
}
