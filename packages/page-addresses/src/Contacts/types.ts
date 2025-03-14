// Copyright 2017-2025 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

export interface SortedAddress { address: string; isFavorite: boolean, isVisible: boolean }

export interface SaveFile { address: string; isFavorite: boolean, name: string }

export type FunInputFile = (e: React.ChangeEvent<HTMLInputElement>) => void
