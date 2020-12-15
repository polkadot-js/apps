// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

// The available endpoints that will show in the dropdown. For the most part (with the exception of
// Polkadot) we try to keep this to live chains only, with RPCs hosted by the community/chain vendor
//   info: The chain logo name as defined in ../ui/logos/index.ts in namedLogos (this also needs to align with @polkadot/networks)
//   text: The text to display on the dropdown
//   value: The actual hosted secure websocket endpoint

export function createTesting (t: TFunction): LinkOption[] {
  return [
    // alphabetical based on chain name
    {
      info: 'centrifuge',
      text: t('rpc.amber', 'Amber', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Centrifuge' } }),
      value: 'wss://fullnode.amber.centrifuge.io'
    },
    {
      info: 'nodle',
      text: t('rpc.nodle-arcadia', 'Arcadia', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Nodle' } }),
      value: 'wss://arcadia1.nodleprotocol.io'
    },
    {
      info: 'edgeware',
      text: t('rpc.beresheet', 'Beresheet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Commonwealth Labs' } }),
      value: 'wss://beresheet1.edgewa.re'
    },
    {
      info: 'bifrost',
      text: t('rpc.bifrost', 'Bifrost Asgard', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Bifrost' } }),
      value: 'wss://testnet.liebi.com'
    },
    {
      info: 'canvas',
      text: t('rpc.canvas', 'Canvas', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://canvas-rpc.parity.io'
    },
    {
      info: 'crust',
      text: t('rpc.crust.network', 'Crust Maxwell CC2', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Crust Network' } }),
      value: 'wss://api.crust.network/'
    },
    {
      info: 'datahighway',
      isDisabled: true,
      text: t('rpc.datahighway.harbour', 'Harbour', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'MXC' } }),
      value: 'wss://testnet-harbour.datahighway.com'
    },
    {
      info: 'dock-testnet',
      text: t('rpc.dock-testnet', 'Dock Testnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Dock Association' } }),
      value: 'wss://danforth-1.dock.io'
    },
    {
      info: 'dusty',
      text: t('rpc.dusty', 'Dusty', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Stake Technologies' } }),
      value: 'wss://rpc.dusty.plasmnet.io/'
    },
    {
      info: 'equilibrium',
      text: t('rpc.equilibriumtestnet', 'Equilibrium Testnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Equilibrium' } }),
      value: 'wss://api.mvp.testnet.equilibrium.io'
    },
    {
      info: 'substrate',
      text: t('rpc.flamingfir', 'Flaming Fir', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://substrate-rpc.parity.io'
    },
    {
      dnslink: 'galois',
      info: 'galois',
      text: t('rpc.galois', 'Galois', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'MathWallet' } }),
      value: 'wss://galois.maiziqianbao.net/ws'
    },
    {
      info: 'acala',
      text: t('rpc.mandala', 'Mandala', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Acala' } }),
      value: 'wss://node-6714447553211260928.rz.onfinality.io/ws'
    },
    {
      info: 'kilt',
      text: t('rpc.kilt', 'Mashnet', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'KILT Protocol' } }),
      value: 'wss://full-nodes.kilt.io:9944/'
    },
    {
      info: 'moonbaseAlpha',
      text: t('rpc.moonbeam', 'Moonbase Alpha', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Moonbeam Network' } }),
      value: 'wss://wss.testnet.moonbeam.network'
    },
    {
      info: 'phala',
      text: t('rpc.phala', 'Phala PoC-3', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Phala Network' } }),
      value: 'wss://poc3.phala.network/ws'
    },
    {
      info: 'laminar',
      text: t('rpc.turbulence', 'Turbulence', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Laminar' } }),
      value: 'wss://testnet-node-1.laminar-chain.laminar.one/ws'
    },
    {
      info: 'sora-substrate',
      text: t('rpc.sora-substrate', 'SORA-Substrate', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Soramitsu' } }),
      value: 'wss://ws.stage.sora2.soramitsu.co.jp'
    },
    {
      dnslink: 'westend',
      info: 'westend',
      text: t('rpc.westend', 'Westend', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'Parity' } }),
      value: 'wss://westend-rpc.polkadot.io'
    },
    {
      dnslink: 'zero',
      info: 'zero',
      text: t('rpc.zero', 'zero', { ns: 'apps-config' }),
      textBy: t('rpc.hosted.by', 'hosted by {{host}}', { ns: 'apps-config', replace: { host: 'ZERO' } }),
      value: 'wss://alphaville-0.zero.io'
    }
  ];
}
