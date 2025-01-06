// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        AccountInfo: 'AccountInfoWithDualRefCount',
        Date: 'i64',
        Keys: 'SessionKeys2',
        Address: 'MultiAddress',
        LookupSource: 'MultiAddress',
        RoamingOperator: '[u8; 16]',
        RoamingOperatorIndex: 'u64',
        RoamingNetwork: '[u8; 16]',
        RoamingNetworkIndex: 'u64',
        RoamingOrganization: '[u8; 16]',
        RoamingOrganizationIndex: 'u64',
        RoamingNetworkServer: '[u8; 16]',
        RoamingNetworkServerIndex: 'u64',
        RoamingDevice: '[u8; 16]',
        RoamingDeviceIndex: 'u64',
        RoamingRoutingProfile: '[u8; 16]',
        RoamingRoutingProfileIndex: 'u64',
        RoamingRoutingProfileAppServer: 'Text',
        RoamingServiceProfile: '[u8; 16]',
        RoamingServiceProfileIndex: 'u64',
        RoamingServiceProfileUplinkRate: 'u32',
        RoamingServiceProfileDownlinkRate: 'u32',
        RoamingAccountingPolicy: '[u8; 16]',
        RoamingAccountingPolicyIndex: 'u64',
        RoamingAccountingPolicyType: 'Text',
        RoamingAccountingPolicyUplinkFeeFactor: 'u32',
        RoamingAccountingPolicyDownlinkFeeFactor: 'u32',
        RoamingAccountingPolicySetting: {
          policy_type: 'Text',
          subscription_fee: 'Balance',
          uplink_fee_factor: 'u32',
          downlink_fee_factor: 'u32'
        },
        RoamingAgreementPolicy: '[u8; 16]',
        RoamingAgreementPolicyIndex: 'u64',
        RoamingAgreementPolicyActivationType: 'Text',
        RoamingAgreementPolicySetting: {
          policy_activation_type: 'Text',
          policy_expiry_block: 'Moment'
        },
        RoamingNetworkProfile: '[u8; 16]',
        RoamingNetworkProfileIndex: 'u64',
        RoamingDeviceProfile: '[u8; 16]',
        RoamingDeviceProfileIndex: 'u64',
        RoamingDeviceProfileDevAddr: 'Text',
        RoamingDeviceProfileDevEUI: 'Text',
        RoamingDeviceProfileJoinEUI: 'Text',
        RoamingDeviceProfileVendorID: 'Text',
        RoamingDeviceProfileSetting: {
          device_profile_devaddr: 'Text',
          device_profile_deveui: 'Text',
          device_profile_joineui: 'Text',
          device_profile_vendorid: 'Text'
        },
        RoamingSession: '[u8; 16]',
        RoamingSessionIndex: 'u64',
        RoamingSessionJoinRequest: {
          session_network_server_id: 'Moment',
          session_join_requested_at_block: 'Moment'
        },
        RoamingSessionJoinAccept: {
          session_join_request_accept_expiry: 'Moment',
          session_join_request_accept_accepted_at_block: 'Moment'
        },
        RoamingBillingPolicy: '[u8; 16]',
        RoamingBillingPolicyIndex: 'u64',
        RoamingBillingPolicySetting: {
          policy_next_billing_at_block: 'Moment',
          policy_frequency_in_blocks: 'Moment'
        },
        RoamingChargingPolicy: '[u8; 16]',
        RoamingChargingPolicyIndex: 'u64',
        RoamingChargingPolicySetting: {
          policy_next_charging_at_block: 'Moment',
          policy_delay_after_billing_in_blocks: 'u64'
        },
        RoamingPacketBundle: '[u8; 16]',
        RoamingPacketBundleIndex: 'u64',
        RoamingPacketBundleReceivedAtHome: 'bool',
        RoamingPacketBundleReceivedPacketsCount: 'u64',
        RoamingPacketBundleReceivedPacketsOkCount: 'u64',
        RoamingPacketBundleExternalDataStorageHash: 'Hash',
        RoamingPacketBundleReceiver: {
          packet_bundle_received_at_home: 'bool',
          packet_bundle_received_packets_count: 'u64',
          packet_bundle_received_packets_ok_count: 'u64',
          packet_bundle_received_started_at_block: 'Moment',
          packet_bundle_received_ended_at_block: 'Moment',
          packet_bundle_external_data_storage_hash: 'Hash'
        },
        MiningRatesToken: '[u8; 16]',
        MiningRatesTokenIndex: 'u64',
        MiningRatesTokenTokenDOT: 'u32',
        MiningRatesTokenTokenMXC: 'u32',
        MiningRatesTokenTokenIOTA: 'u32',
        MiningRatesTokenMaxToken: 'u32',
        MiningRatesTokenMaxLoyalty: 'u32',
        MiningRatesTokenSetting: {
          token_token_mxc: 'u32',
          token_token_iota: 'u32',
          token_token_dot: 'u32',
          token_max_token: 'u32',
          token_max_loyalty: 'u32'
        },
        MiningRatesHardware: '[u8; 16]',
        MiningRatesHardwareIndex: 'u64',
        MiningRatesHardwareSecure: 'u32',
        MiningRatesHardwareInsecure: 'u32',
        MiningRatesHardwareMaxHardware: 'u32',
        MiningRatesHardwareCategory1MaxTokenBonusPerGateway: 'u32',
        MiningRatesHardwareCategory2MaxTokenBonusPerGateway: 'u32',
        MiningRatesHardwareCategory3MaxTokenBonusPerGateway: 'u32',
        MiningRatesHardwareSetting: {
          hardware_hardware_secure: 'u32',
          hardware_hardware_insecure: 'u32',
          hardware_max_hardware: 'u32',
          hardware_category_1_max_token_bonus_per_gateway: 'u32',
          hardware_category_2_max_token_bonus_per_gateway: 'u32',
          hardware_category_3_max_token_bonus_per_gateway: 'u32'
        },
        MiningSettingToken: '[u8; 16]',
        MiningSettingTokenIndex: 'u64',
        MiningSettingTokenType: 'Text',
        MiningSettingTokenLockAmount: 'u64',
        MiningSettingTokenSetting: {
          token_type: 'Text',
          token_lock_amount: 'u64',
          token_lock_start_block: 'Moment',
          token_lock_interval_blocks: 'Moment'
        },
        MiningSettingTokenRequirementsSetting: {
          token_type: 'Text',
          token_lock_min_amount: 'u64',
          token_lock_min_blocks: 'u32'
        },
        MiningSettingHardware: '[u8; 16]',
        MiningSettingHardwareIndex: 'u64',
        MiningSettingHardwareSecure: 'bool',
        MiningSettingHardwareType: 'Text',
        MiningSettingHardwareID: 'u64',
        MiningSettingHardwareDevEUI: 'u64',
        MiningSettingHardwareSetting: {
          hardware_secure: 'bool',
          hardware_type: 'Text',
          hardware_id: 'u64',
          hardware_dev_eui: 'u64',
          hardware_lock_start_block: 'Moment',
          hardware_lock_interval_blocks: 'Moment'
        },
        MiningSamplingToken: '[u8; 16]',
        MiningSamplingTokenIndex: 'u64',
        MiningSamplingTokenSampleLockedAmount: 'u64',
        MiningSamplingTokenSetting: {
          token_sample_block: 'Moment',
          token_sample_locked_amount: 'u64'
        },
        MiningSamplingHardware: '[u8; 16]',
        MiningSamplingHardwareIndex: 'u64',
        MiningSamplingHardwareSampleHardwareOnline: 'u64',
        MiningSamplingHardwareSetting: {
          hardware_sample_block: 'Moment',
          hardware_sample_hardware_online: 'bool'
        },
        MiningEligibilityToken: '[u8; 16]',
        MiningEligibilityTokenIndex: 'u64',
        MiningEligibilityTokenCalculatedEligibility: 'u64',
        MiningEligibilityTokenLockedPercentage: 'u32',
        MiningEligibilityTokenAuditorAccountID: 'u64',
        MiningEligibilityTokenResult: {
          token_calculated_eligibility: 'u64',
          token_token_locked_percentage: 'u32',
          token_date_audited: 'Moment',
          token_auditor_account_id: 'u64'
        },
        MiningEligibilityHardware: '[u8; 16]',
        MiningEligibilityHardwareIndex: 'u64',
        MiningEligibilityHardwareCalculatedEligibility: 'u64',
        MiningEligibilityHardwareUptimePercentage: 'u32',
        MiningEligibilityHardwareAuditorAccountID: 'u64',
        MiningEligibilityHardwareResult: {
          hardware_calculated_eligibility: 'u64',
          hardware_uptime_percentage: 'u32',
          hardware_block_audited: 'Moment',
          hardware_auditor_account_id: 'u64'
        },
        MiningEligibilityProxy: '[u8; 16]',
        MiningEligibilityProxyIndex: 'u64',
        MiningEligibilityProxyRewardRequest: {
          proxy_claim_requestor_account_id: 'AccountId',
          proxy_claim_total_reward_amount: 'Balance',
          proxy_claim_timestamp_redeemed: 'Moment'
        },
        MiningEligibilityProxyClaimRewardeeData: {
          proxy_claim_rewardee_account_id: 'AccountId',
          proxy_claim_reward_amount: 'Balance',
          proxy_claim_start_date: 'Date',
          proxy_claim_end_date: 'Date'
        },
        RewardeeData: {
          proxy_claim_rewardee_account_id: 'AccountId',
          proxy_claim_reward_amount: 'Balance',
          proxy_claim_start_date: 'Date',
          proxy_claim_end_date: 'Date'
        },
        RewardRequestorData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          total_amt: 'Balance',
          rewardee_count: 'u64',
          member_kind: 'u32',
          requested_date: 'Moment'
        },
        RequestorData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          total_amt: 'Balance',
          rewardee_count: 'u64',
          member_kind: 'u32',
          requested_date: 'Moment'
        },
        RewardTransferData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          is_sent: 'bool',
          total_amt: 'Balance',
          rewardee_count: 'u64',
          member_kind: 'u32',
          requested_date: 'Moment'
        },
        TransferData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          is_sent: 'bool',
          total_amt: 'Balance',
          rewardee_count: 'u64',
          member_kind: 'u32',
          requested_date: 'Moment'
        },
        RewardDailyData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          total_amt: 'Balance',
          proxy_claim_requestor_account_id: 'AccountId',
          member_kind: 'u32',
          rewarded_date: 'Date'
        },
        DailyData: {
          mining_eligibility_proxy_id: 'MiningEligibilityProxyIndex',
          total_amt: 'Balance',
          proxy_claim_requestor_account_id: 'AccountId',
          member_kind: 'u32',
          rewarded_date: 'Date'
        },
        MiningClaimsToken: '[u8; 16]',
        MiningClaimsTokenIndex: 'u64',
        MiningClaimsTokenClaimAmount: 'u64',
        MiningClaimsTokenClaimResult: {
          token_claim_amount: 'u64',
          token_claim_block_redeemed: 'u64'
        },
        MiningClaimsHardware: '[u8; 16]',
        MiningClaimsHardwareIndex: 'u64',
        MiningClaimsHardwareClaimAmount: 'u64',
        MiningClaimsHardwareClaimResult: {
          hardware_claim_amount: 'u64',
          hardware_claim_block_redeemed: 'u64'
        },
        MiningExecutionToken: '[u8; 16]',
        MiningExecutionTokenIndex: 'u64',
        MiningExecutionTokenExecutorAccountID: 'u64',
        MiningExecutionTokenExecutionResult: {
          token_execution_exector_account_id: 'u64',
          token_execution_started_block: 'Moment',
          token_execution_ended_block: 'Moment'
        },
        ExchangeRateIndex: 'u64',
        ExchangeRateSetting: {
          hbtc: 'u64',
          dot: 'u64',
          iota: 'u64',
          fil: 'u64',
          decimals_after_point: 'u32'
        },
        HBTCRate: 'u64',
        DOTRate: 'u64',
        IOTARate: 'u64',
        FILRate: 'u64',
        DecimalsAfterPoint: 'u32'
      }
    }
  ]
};

export default definitions;
