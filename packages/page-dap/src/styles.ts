// Copyright 2017-2026 @polkadot/app-dap authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

export const headingStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  margin: '1.5rem 0 0.75rem',
  opacity: 0.8,
  textTransform: 'uppercase'
};

// Spread `CardSummary` cards evenly across the full page width so summary
// boxes have the same footprint as the data table below them. Without this
// override, `SummaryBox`'s flex children collapse to the left.
export const sectionStyle: React.CSSProperties = {
  flex: '1 1 auto',
  justifyContent: 'space-between',
  width: '100%'
};
