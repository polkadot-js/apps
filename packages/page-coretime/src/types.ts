// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation } from '@polkadot/react-hooks/types';
import type { PhaseName } from './constants.js';

export interface PhaseInfo {
  name?: string;
  start: {
    date: string | null;
    blocks: {
      relay: number;
      coretime: number;
    };
    ts: number;
  }
  end: {
    date: string | null;
    blocks: {
      relay: number;
      coretime: number;
    };
    ts: number;
  }
}

type PhaseNameType = typeof PhaseName[keyof typeof PhaseName];

export interface PhaseConfig {
  currentPhaseName: PhaseNameType;
  config: Record<PhaseNameType, PhaseInfo >;
}

export interface PhaseProgress {
  value: number;
  total: number;
  label: string;
}

export interface SaleParameters {
  currentRegion: {
    start: { date: string, ts: number; blocks: { coretime: number, relay: number } };
    end: { date: string, ts: number; blocks: { coretime: number, relay: number } };
  };
  regionForSale: {
    start: { date: string, ts: number; blocks: { coretime: number, relay: number } };
    end: { date: string | null, ts: number; blocks: { coretime: number, relay: number } };
  };
  saleNumber: number;
  interlude: { ts: number; blocks: number };
  leadin: { ts: number; blocks: number };
  phaseConfig: PhaseConfig | null;
}

export interface SaleDetails {
  saleNumber: number;
  relay: {
    start: {
      block: number;
      ts: number;
    },
    end: {
      block: number;
      ts: number;
    },
  },
  coretime: {
    start: {
      block: number;
    },
    end: {
      block: number;
    }
  }
  date: {
    start: string | null;
    end: string | null;
  }
}

export interface RegionInfo {
  regionBegin: number;
  regionEnd: number;
}

export type RelayName = 'kusama' | 'polkadot' | 'paseo testnet' | 'westend'

export interface GetResponse {
  blocks: {
    coretime: (ts: number) => number;
    relay: (ts: number) => number;
  };
  timeslices: {
    coretime: (blocks: number) => number;
    relay: (blocks: number) => number;
  };
}

export interface BaseFilterProps {
  data: number[];
  onFilter: (data: number[]) => void;
}

export interface ChainInfoFilterProps extends BaseFilterProps {
  chainInfo: Record<number, ChainInformation>;
}

export type SortDirection = 'DESC' | 'ASC' | '';

export enum FilterType {
  BLOCKS = 'blocks',
  SEARCH = 'search',
  TYPE = 'type'
}

export interface ActiveFilters {
  search: number[];
  type: number[];
}
