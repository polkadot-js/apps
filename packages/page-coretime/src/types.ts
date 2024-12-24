// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum CoreTimeTypes {
  'Reservation',
  'Lease',
  'Bulk Coretime',
  'On Demand'
}

export interface PhaseInfo {
  name: string;
  lastBlock: number;
  lastTimeslice: number
}

export const PhaseName = {
  FixedPrice: 'Fixed Price',
  PriceDiscovery: 'Price Discovery',
  Renewals: 'Renewals'
} as const;

type PhaseNameType = typeof PhaseName[keyof typeof PhaseName];

export interface PhaseConfig {
  currentPhaseName: PhaseNameType;
  config: Record<PhaseNameType, { lastTimeslice: number; lastBlock: number }>;
}

export interface PhaseProgress {
  value: number;
  total: number;
  label: string;
}

export interface SaleParameters {
  currentRegion: {
    start: { ts: number; blocks: number };
    end: { ts: number; blocks: number };
  };
  cycleNumber: number;
  interlude: { ts: number; blocks: number };
  leadin: { ts: number; blocks: number };
  phaseConfig: PhaseConfig;
  regionNumber: number;
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

export type ChainName = 'kusama' | 'polkadot' | 'paseo testnet' | 'westend'
