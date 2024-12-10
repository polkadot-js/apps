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
  Renewals: 'Renewals',
  PriceDiscovery: 'Price Discovery',
  FixedPrice: 'Fixed Price'
} as const;

export type PhaseConfig = {
  currentPhaseName: string;
  config: Record<typeof PhaseName[keyof typeof PhaseName], {lastTimeslice: number, lastBlock: number}>
}

export type PhaseProgress = {
  value: number;
  total: number;
  label: string;
}

export type SaleDetails = {
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
  regionEnd: number;
  regionBegin: number;
}
