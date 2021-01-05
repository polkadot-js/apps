// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createProduction (t: TFunction): LinkOption[] {
  return [
    // fixed, polkadot
    {
      dnslink: 'polkadot',
      info: 'polkadot',
      text: t('rpc.polkadot.parity', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://rpc.polkadot.io'
    },
    {
      info: 'polkadot',
      text: t('rpc.polkadot.w3f', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Web3 Foundation' } }),
      value: 'wss://cc1-1.polkadot.network'
    },
    {
      info: 'polkadot',
      text: t('rpc.polkadot.onfinality', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'OnFinality' } }),
      value: 'wss://polkadot.api.onfinality.io/public-ws'
    },
    {
      info: 'polkadot',
      text: t('rpc.polkadot.patractlabs', 'Polkadot', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Patract Elara' } }),
      value: 'wss://polkadot.elara.patract.io'
    },
    {
      dnslink: 'kusama',
      info: 'kusama',
      text: t('rpc.kusama.parity', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://kusama-rpc.polkadot.io'
    },
    {
      info: 'kusama',
      text: t('rpc.kusama.w3f', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Web3 Foundation' } }),
      value: 'wss://cc3-5.kusama.network'
    },
    {
      info: 'kusama',
      text: t('rpc.kusama.onfinality', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'OnFinality' } }),
      value: 'wss://kusama.api.onfinality.io/public-ws'
    },
    {
      info: 'kusama',
      text: t('rpc.kusama.patractlabs', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Patract Elara' } }),
      value: 'wss://kusama.elara.patract.io'
    },
    {
      info: 'kusama',
      isDisabled: true,
      text: t('rpc.kusama.ava', 'Kusama', { ns: 'apps-config' }),
      textBy: t('rpc.ava.summary', 'user-run public nodes; see https://status.cloud.ava.do/', { ns: 'apps-config' }),
      value: 'wss://kusama.polkadot.cloud.ava.do'
    },
    // alphabetical based on chain name
    {
      dnslink: 'centrifuge',
      info: 'centrifuge',
      text: t('rpc.centrifuge', 'Centrifuge', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Centrifuge' } }),
      value: 'wss://fullnode.centrifuge.io'
    },
    {
      info: 'crab',
      text: t('rpc.crab', 'Darwinia Crab', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Darwinia Network' } }),
      value: 'wss://crab.darwinia.network'
    },
    {
      info: 'darwinia',
      text: t('rpc.darwinia', 'Darwinia', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Darwinia Network' } }),
      value: 'wss://cc1.darwinia.network'
    },
    {
      info: 'dock-mainnet',
      text: t('rpc.dock-mainnet', 'Dock Mainnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Dock Association' } }),
      value: 'wss://mainnet-node.dock.io'
    },
    {
      dnslink: 'edgeware',
      info: 'edgeware',
      text: t('rpc.edgeware', 'Edgeware', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Commonwealth Labs' } }),
      value: 'wss://mainnet4.edgewa.re'
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibrium', 'Equilibrium Mainnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Equilibrium' } }),
      value: 'wss://tge.equilibrium.io'
    },
    {
      info: 'hanonycash',
      text: t('rpc.hanonycash', 'hanonycash', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'hanonycash' } }),
      value: 'wss://rpc.hanonycash.com'
    },
    {
      dnslink: 'kulupu',
      info: 'kulupu',
      text: t('rpc.kulupu', 'Kulupu', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Kulupu' } }),
      value: 'wss://rpc.kulupu.corepaper.org/ws'
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-main', 'Nodle Main', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Nodle' } }),
      value: 'wss://main1.nodleprotocol.io'
    },
    {
      info: 'plasm',
      text: t('rpc.plasm', 'Plasm', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Stake Technologies' } }),
      value: 'wss://rpc.plasmnet.io/'
    },
    {
      info: 'stafi',
      text: t('rpc.stafi', 'Stafi', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Stafi Foundation' } }),
      value: 'wss://mainnet-rpc.stafi.io'
    },
    {
      info: 'subsocial',
      text: t('rpc.subsocial', 'Subsocial', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'DappForce' } }),
      value: 'wss://rpc.subsocial.network'
    }
  ];
}
