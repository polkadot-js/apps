// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

import acala from './acala';
import altair from './altair';
import apron from './apron';
import aresGladios from './ares-gladios';
import aresParachain from './ares-parachain';
import astar from './astar';
import automata from './automata';
import basilisk from './basilisk';
import beresheet from './beresheet';
import bifrost from './bifrost';
import bifrostAsgard from './bifrost-asgard';
import bifrostParachain from './bifrost-parachain';
import bitcountry from './bitcountry';
import bitcountryPioneer from './bitcountry-pioneer';
import bitcountryParachain from './bitcountry-rococo';
import canvas from './canvas';
import centrifuge from './centrifuge';
import centrifugeChain from './centrifuge-chain';
import chainx from './chainx';
import clover from './clover';
import cloverRococo from './clover-rococo';
import coinversation from './coinversation';
import competitorsClub from './competitors-club';
import crab from './crab';
import crownSterlingChain from './crown-sterling';
import crust from './crust';
import testPara from './cumulus-test-parachain';
import darwinia from './darwinia';
import datahighwayParachain from './datahighway';
import dockMainnet from './dock-mainnet';
import dockTestnet from './dock-testnet';
import dotmog from './dotmog';
import dusty from './dusty';
import eave from './eave';
import edgeware from './edgeware';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import encointerPara from './encointer-para';
import equilibrium from './equilibrium';
import fantour from './fantour';
import galital from './galital';
import galitalParachain from './galital-parachain';
import galois from './galois';
import gamepower from './gamepower';
import genshiro from './genshiro';
import hanonycash from './hanonycash';
import hydrate from './hydrate';
import idavoll from './idavoll';
import integritee from './integritee';
import interbtc from './interbtc';
import ipse from './ipse';
import jupiter from './jupiter';
import jupiterRococo from './jupiter-rococo';
import khala from './khala';
import kilt from './kilt';
import konomi from './konomi';
import kpron from './kpron';
import kulupu from './kulupu';
import kusari from './kusari';
import kylin from './kylin';
import laminar from './laminar';
import litentry from './litentry';
import manta from './manta';
import mathchain from './mathchain';
import moonbeam from './moonbeam';
import mybank from './mybank';
import neatcoin from './neatcoin';
import neumann from './neumann';
import nftmart from './nftmart';
import nodle from './nodle';
import opal from './opal';
import opportunity from './opportunity';
import origintrail from './origintrail';
import pangolin from './pangolin';
import pangoro from './pangoro';
import parallel from './parallel';
import parami from './parami';
import phoenix from './phoenix';
import pichiu from './pichiu';
import plasm from './plasm';
import polkadex from './polkadex';
import polkafoundry from './polkafoundry';
import polymesh from './polymesh';
import pontem from './pontem';
import prism from './prism';
import quartz from './quartz';
import realis from './realis';
import riochain from './riochain';
import robonomics from './robonomics';
import shibuya from './shibuya';
import shiden from './shiden';
import snowbridge from './snowbridge';
import soraSubstrate from './soraSubstrate';
import spanner from './spanner';
import stafi from './stafi';
import standard from './standard';
import subdao from './subdao';
import subgame from './subgame';
import subsocial from './subsocial';
import subspace from './subspace';
import substrateContractsNode from './substrateContractsNode';
import ternoa from './ternoa';
import trustbase from './trustbase';
import uart from './uart';
import unique from './unique';
import unitv from './unitv';
import vln from './vln';
import vlnrococo from './vln-rococo';
import vodka from './vodka';
import web3games from './web3games';
import westlake from './westlake';
import zCloak from './zCloak';
import zeitgeist from './zeitgeist';
import zenlink from './zenlink';
import zero from './zero';

// NOTE: The mapping is done from specName in state.getRuntimeVersion
const spec: Record<string, OverrideBundleDefinition> = {
  Crab: crab,
  Darwinia: darwinia,
  'Darwinia Crab PC2': pangolin,
  'Darwinia PC2': pangolin,
  Equilibrium: equilibrium,
  Genshiro: genshiro,
  Pangolin: pangolin,
  Pangoro: pangoro,
  VLN: vln,
  'VLN-PC': vlnrococo,
  ...acala,
  altair,
  apron,
  'ares-gladios': aresGladios,
  'ares-parachain': aresParachain,
  asgard: bifrostAsgard,
  astar,
  automata: automata,
  basilisk,
  beresheet,
  bifrost: bifrost,
  'bifrost-parachain': bifrostParachain,
  'bitcountry-node': bitcountry,
  'bitcountry-parachain': bitcountryParachain,
  canvas,
  centrifuge,
  'centrifuge-chain': centrifugeChain,
  chainx,
  'chainx-parachain': chainx,
  clover,
  'clover-rococo': cloverRococo,
  coinversation,
  'competitors-club': competitorsClub,
  contextfree: automata,
  'crown-sterling': crownSterlingChain,
  crust,
  'crust-parachain': crust,
  'cumulus-subsocial-parachain': subsocial,
  'cumulus-test-parachain': testPara,
  datahighway: westlake,
  'datahighway-parachain': datahighwayParachain,
  dawn: eave,
  'dev-parachain': zenlink,
  'dock-pos-main-runtime': dockMainnet,
  'dock-pos-test-runtime': dockTestnet,
  'dotmog-node': dotmog,
  dusty4: dusty,
  edgeware,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  'encointer-parachain': encointerPara,
  fantour,
  galital: galital,
  'galital-collator': galitalParachain,
  gamepower,
  'hack-hydra-dx': hydrate,
  halongbay: polkafoundry,
  hanonycash,
  heiko: parallel,
  'hydra-dx': hydrate,
  idavoll,
  'integritee-parachain': integritee,
  'interbtc-parachain': interbtc,
  'interbtc-standalone': interbtc,
  'ipse-node': ipse,
  'jupiter-prep': jupiter,
  'jupiter-rococo': jupiterRococo,
  khala,
  'kilt-parachain': kilt,
  'kilt-spiritnet': kilt,
  'kintsugi-parachain': interbtc,
  konomi,
  kpron,
  kulupu,
  kusari,
  kylin,
  laminar,
  litentry,
  'manta-node': manta,
  'mashnet-node': kilt,
  mathchain,
  'mathchain-galois': galois,
  moonbase: moonbeam,
  moonbeam,
  moonriver: moonbeam,
  moonshadow: moonbeam,
  'mybank.network Testnet': mybank,
  neatcoin,
  neumann,
  nft: unique,
  nftmart,
  'node-moonbeam': moonbeam,
  'node-polkadex': polkadex,
  'nodle-chain': nodle,
  opal: opal,
  opportunity,
  'origintrail-parachain': origintrail,
  parallel,
  parami,
  'phoenix-node': phoenix,
  'phoenix-parachain': phoenix,
  pichiu,
  'pioneer-runtime': bitcountryPioneer,
  plasm,
  polymesh,
  'pontem-node': pontem,
  prism,
  quartz: quartz,
  realis,
  'riochain-runtime': riochain,
  robonomics,
  shibuya,
  shiden,
  snowbridge,
  'sora-substrate': soraSubstrate,
  sora_ksm: soraSubstrate,
  spanner,
  stafi,
  standard,
  steam: eave,
  subdao,
  subgame,
  subsocial,
  subspace,
  'substrate-contracts-node': substrateContractsNode,
  subzero: zero,
  ternoa,
  trustbase,
  uart,
  'unit-node': unitv,
  'unit-parachain': unitv,
  unorthodox: standard,
  vodka,
  'web3games-node': web3games,
  'zcloak-network': zCloak,
  zeitgeist: zeitgeist
};

export default spec;
