// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */
/* eslint-disable camelcase */

export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  CeremonyPhaseType: {
    _enum: [
      'Registering',
      'Assigning',
      'Attesting'
    ]
  },
  CeremonyIndexType: 'u32',
  ParticipantIndexType: 'u64',
  MeetupIndexType: 'u64',
  AttestationIndexType: 'u64',
  CurrencyIdentifier: 'Hash',
  BalanceType: 'i128',
  BalanceEntry: {
    principal: 'i128',
    last_update: 'BlockNumber'
  },
  CurrencyCeremony: {
    cid: 'CurrencyIdentifier',
    cindex: 'CeremonyIndexType'
  },
  Location: {
    lat: 'i64',
    lon: 'i64'
  },
  Reputation: {
    _enum: [
      'Unverified',
      'UnverifiedReputable',
      'VerifiedUnlinked',
      'VerifiedLinked'
    ]
  },
  CurrencyPropertiesType: {
    name_utf8: 'Text',
    demurrage_per_block: 'i128'
  },
  ClaimOfAttendance: {
    claimant_public: 'AccountId',
    ceremony_index: 'CeremonyIndexType',
    currency_identifier: 'CurrencyIdentifier',
    meetup_index: 'MeetupIndexType',
    location: 'Location',
    timestamp: 'Moment',
    number_of_participants_confirmed: 'u32'
  },
  Attestation: {
    claim: 'ClaimOfAttendance',
    signature: 'Signature',
    public: 'AccountId'
  },
  ProofOfAttendance: {
    prover_public: 'AccountId',
    ceremony_index: 'CeremonyIndexType',
    currency_identifier: 'CurrencyIdentifier',
    attendee_public: 'AccountId',
    attendee_signature: 'Signature'
  },
  // weight changed to u64 since 2.0.0-rc1 (commit 2051ecbf79e April 16th 2020
  Weight: 'u32'
};
