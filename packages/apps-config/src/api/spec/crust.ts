export default {
  Address: 'AccountId',
  LookupSource: 'AccountId',
  Identity: {
    pub_key: 'Vec<u8>',
    code: 'Vec<u8>',
  },
  SworkerCode: 'Vec<u8>',
  // ValidatorPrefs: {
  //   fee: 'Compact<Perbill>'
  // },
  // fee: 'commission',
  WorkReport: {
    block_number: 'u64',
    used: 'u64',
    reserved: 'u64',
    cached_reserved: 'u64',
    files: 'Vec<(Vec<u8>, u64)>',
  },
  StakingLedger: {
    stash: 'AccountId',
    total: 'Compact<Balance>',
    active: 'Compact<Balance>',
    unlocking: 'Vec<UnlockChunk>',
    claimed_rewards: 'Vec<EraIndex>'
  },
  UnlockChunk: {
    value:'Compact<Balance>',
    era: 'Compact<EraIndex>'
  },
  ReportSlot: 'u64',
  AddressInfo: 'Vec<u8>',
  MerkleRoot: 'Vec<u8>',
  MerchantInfo: {
    address: 'Vec<u8>',
    storage_price: 'Balance',
    file_map: 'Vec<(Vec<u8>, Vec<Hash>)>',
  },
  OrderStatus: {
    _enum: ['Success', 'Failed', 'Pending'],
  },
  StorageOrder: {
    file_identifier: 'Vec<u8>',
    file_size: 'u64',
    created_on: 'BlockNumber',
    completed_on: 'BlockNumber',
    expired_on: 'BlockNumber',
    provider: 'AccountId',
    client: 'AccountId',
    amount: 'Balance',
    order_status: 'OrderStatus',
  },
  Pledge: {
    total: 'Balance',
    used: 'Balance',
  },
  // Payment ledger
  PaymentLedger: {
    total: 'Balance',
    paid: 'Balance',
    unreserved: 'Balance',
  },
  MerchantPunishment: {
    success: 'EraIndex',
    failed: 'EraIndex',
    value: 'Balance',
  },
  SworkerCert: 'Vec<u8>',
  IASSig: 'Vec<u8>',
  ISVBody: 'Vec<u8>',
  SworkerPubKey: 'Vec<u8>',
  SworkerSignature: 'Vec<u8>',
  // TODO: remove util upgrade newest polkadot-js/api
  Releases: {
    _enum: ['V1_0_0', 'V2_0_0'],
  },
  Status: {
    _enum: ['Free', 'Reserved']
  },
  Guarantee: {
    targets: 'Vec<IndividualExposure<AccountId, Balance>>',
    total: 'Compact<Balance>',
    submitted_in: 'EraIndex',
    suppressed: 'bool'
  },
  FileAlias: 'Vec<u8>'
};