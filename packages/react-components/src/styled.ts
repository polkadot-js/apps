// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StyledInterface } from 'styled-components';

import styledComponents from 'styled-components';

// In styled-components v6, there is a named export which can be used
// directly, i.e. "import { styled } from ..." with no more magic. Until
// such time the cjs vs esm import here is problematic, so we hack around
// the various shapes below
export const styled = (
  (styledComponents as unknown as { styled: StyledInterface }).styled ||
  (styledComponents as unknown as { default: StyledInterface }).default ||
  styledComponents as unknown as StyledInterface
);
