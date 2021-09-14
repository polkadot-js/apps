// Copyright 2017-2021 @polkadot/test-supports authors & contributors
// SPDX-License-Identifier: Apache-2.0

class MockApiCalls {
  public subs: string[] | undefined = []
  public setSubs (subs: string[] | undefined) {
    this.subs = subs;
  }
}

export const mockApiCalls = new MockApiCalls();
