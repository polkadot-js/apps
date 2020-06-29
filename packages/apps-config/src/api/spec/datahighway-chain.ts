// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// structs need to be in order
/* eslint-disable sort-keys */

const HARBOUR_DHX_CUSTOM_TYPES_URL = 'https://raw.githubusercontent.com/DataHighway-DHX/node/master/custom_types.json';

const getCustomTypesDhx = async (): Promise<any> => {
  const url = HARBOUR_DHX_CUSTOM_TYPES_URL;
  const response = await fetch(url, {
    method: 'GET'
  });

  if (!response) {
    console.error('Error fetching DataHighway custom types');

    return;
  }

  if (response.status !== 200) {
    // throw new Error(response.statusText);
    console.error(response.statusText);
  }

  return await response.json() as Promise<any>;
};

export default getCustomTypesDhx;
// export default {
//   RoamingOperator: '[u8; 16]',
//   RoamingOperatorIndex: 'u64',
//   RoamingNetwork: '[u8; 16]',
//   RoamingNetworkIndex: 'u64',
//   RoamingOrganization: '[u8; 16]',
//   RoamingOrganizationIndex: 'u64',
//   RoamingNetworkServer: '[u8; 16]',
//   RoamingNetworkServerIndex: 'u64',
//   RoamingDevice: '[u8; 16]',
//   RoamingDeviceIndex: 'u64',
//   RoamingRoutingProfile: '[u8; 16]',
//   RoamingRoutingProfileIndex: 'u64',
//   RoamingRoutingProfileAppServer: 'text',
//   RoamingServiceProfile: '[u8; 16]',
//   RoamingServiceProfileIndex: 'u64',
//   RoamingServiceProfileUplinkRate: 'u32',
//   RoamingServiceProfileDownlinkRate: 'u32',
//   RoamingAccountingPolicy: '[u8; 16]',
//   RoamingAccountingPolicyIndex: 'u64',
//   RoamingAccountingPolicyType: 'text',
//   RoamingAccountingPolicyUplinkFeeFactor: 'u32',
//   RoamingAccountingPolicyDownlinkFeeFactor: 'u32',
//   RoamingAccountingPolicyConfig: {
//     policy_type: 'text',
//     subscription_fee: 'Balance',
//     uplink_fee_factor: 'u32',
//     downlink_fee_factor: 'u32'
//   },
//   RoamingAgreementPolicy: '[u8; 16]',
//   RoamingAgreementPolicyIndex: 'u64',
//   RoamingAgreementPolicyActivationType: 'text',
//   RoamingAgreementPolicyExpiry: 'Moment',
//   RoamingAgreementPolicyConfig: {
//     policy_activation_type: 'text',
//     policy_expiry: 'u64'
//   },
//   RoamingNetworkProfile: '[u8; 16]',
//   RoamingNetworkProfileIndex: 'u64',
//   RoamingDeviceProfile: '[u8; 16]',
//   RoamingDeviceProfileIndex: 'u64',
//   RoamingDeviceProfileDevAddr: 'text',
//   RoamingDeviceProfileDevEUI: 'text',
//   RoamingDeviceProfileJoinEUI: 'text',
//   RoamingDeviceProfileVendorID: 'text',
//   RoamingDeviceProfileConfig: {
//     device_profile_devaddr: 'text',
//     device_profile_deveui: 'text',
//     device_profile_joineui: 'text',
//     device_profile_vendorid: 'text'
//   },
//   RoamingSession: '[u8; 16]',
//   RoamingSessionIndex: 'u64',
//   RoamingSessionJoinRequestRequestedAt: 'Moment',
//   RoamingSessionJoinRequestAcceptExpiry: 'Moment',
//   RoamingSessionJoinRequestAcceptAcceptedAt: 'Moment',
//   RoamingSessionJoinRequest: {
//     session_network_server_id: 'Moment',
//     session_join_request_requested_at: 'Moment'
//   },
//   RoamingSessionJoinAccept: {
//     session_join_request_accept_expiry: 'Moment',
//     session_join_request_accept_accepted_at: 'Moment'
//   },
//   RoamingBillingPolicy: '[u8; 16]',
//   RoamingBillingPolicyIndex: 'u64',
//   RoamingBillingPolicyNextBillingAt: 'Moment',
//   RoamingBillingPolicyFrequencyInDays: 'u64',
//   RoamingBillingPolicyConfig: {
//     policy_next_billing_at: 'Moment',
//     policy_frequency_in_days: 'u64'
//   },
//   RoamingChargingPolicy: '[u8; 16]',
//   RoamingChargingPolicyIndex: 'u64',
//   RoamingChargingPolicyNextChargingAt: 'Moment',
//   RoamingChargingPolicyDelayAfterBillingInDays: 'u64',
//   RoamingChargingPolicyConfig: {
//     policy_next_charging_at: 'Moment',
//     policy_delay_after_billing_in_days: 'u64'
//   },
//   RoamingPacketBundle: '[u8; 16]',
//   RoamingPacketBundleIndex: 'u64',
//   RoamingPacketBundleReceivedAtHome: 'bool',
//   RoamingPacketBundleReceivedPacketsCount: 'u64',
//   RoamingPacketBundleReceivedPacketsOkCount: 'u64',
//   RoamingPacketBundleReceivedStartedAt: 'Moment',
//   RoamingPacketBundleReceivedEndedAt: 'Moment',
//   RoamingPacketBundleExternalDataStorageHash: 'Hash',
//   RoamingPacketBundleReceiver: {
//     packet_bundle_received_at_home: 'bool',
//     packet_bundle_received_packets_count: 'u64',
//     packet_bundle_received_packets_ok_count: 'u64',
//     packet_bundle_received_started_at: 'Moment',
//     packet_bundle_received_ended_at: 'Moment',
//     packet_bundle_external_data_storage_hash: 'Hash'
//   },
//   MiningSpeedBoostRatesTokenMining: '[u8; 16]',
//   MiningSpeedBoostRatesTokenMiningIndex: 'u64',
//   MiningSpeedBoostRatesTokenMiningTokenDOT: 'u32',
//   MiningSpeedBoostRatesTokenMiningTokenMXC: 'u32',
//   MiningSpeedBoostRatesTokenMiningTokenIOTA: 'u32',
//   MiningSpeedBoostRatesTokenMiningMaxToken: 'u32',
//   MiningSpeedBoostRatesTokenMiningMaxLoyalty: 'u32',
//   MiningSpeedBoostRatesTokenMiningRatesConfig: {
//     token_token_mxc: 'u32',
//     token_token_iota: 'u32',
//     token_token_dot: 'u32',
//     token_max_token: 'u32',
//     token_max_loyalty: 'u32'
//   },
//   MiningSpeedBoostRatesHardwareMining: '[u8; 16]',
//   MiningSpeedBoostRatesHardwareMiningIndex: 'u64',
//   MiningSpeedBoostRatesHardwareMiningHardwareSecure: 'u32',
//   MiningSpeedBoostRatesHardwareMiningHardwareInsecure: 'u32',
//   MiningSpeedBoostRatesHardwareMiningMaxHardware: 'u32',
//   MiningSpeedBoostRatesHardwareMiningRatesConfig: {
//     hardware_hardware_secure: 'u32',
//     hardware_hardware_insecure: 'u32',
//     hardware_max_hardware: 'u32'
//   },
//   MiningSpeedBoostConfigurationTokenMining: '[u8; 16]',
//   MiningSpeedBoostConfigurationTokenMiningIndex: 'u64',
//   MiningSpeedBoostConfigurationTokenMiningTokenType: 'text',
//   MiningSpeedBoostConfigurationTokenMiningTokenLockedAmount: 'u64',
//   MiningSpeedBoostConfigurationTokenMiningTokenLockPeriod: 'u32',
//   MiningSpeedBoostConfigurationTokenMiningTokenLockPeriodStartDate: 'u64',
//   MiningSpeedBoostConfigurationTokenMiningTokenLockPeriodEndDate: 'u64',
//   MiningSpeedBoostConfigurationTokenMiningTokenConfig: {
//     token_type: 'text',
//     token_locked_amount: 'u64',
//     token_lock_period: 'u32',
//     token_lock_period_start_date: 'Moment',
//     token_lock_period_end_date: 'Moment'
//   },
//   MiningSpeedBoostConfigurationHardwareMining: '[u8; 16]',
//   MiningSpeedBoostConfigurationHardwareMiningIndex: 'u64',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareSecure: 'bool',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareType: 'text',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareID: 'u64',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareDevEUI: 'u64',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareLockPeriodStartDate: 'u64',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareLockPeriodEndDate: 'u64',
//   MiningSpeedBoostConfigurationHardwareMiningHardwareConfig: {
//     hardware_secure: 'bool',
//     hardware_type: 'text',
//     hardware_id: 'u64',
//     hardware_dev_eui: 'u64',
//     hardware_lock_period_start_date: 'Moment',
//     hardware_lock_period_end_date: 'Moment'
//   },
//   MiningSpeedBoostSamplingTokenMining: '[u8; 16]',
//   MiningSpeedBoostSamplingTokenMiningIndex: 'u64',
//   MiningSpeedBoostSamplingTokenMiningSampleDate: 'u64',
//   MiningSpeedBoostSamplingTokenMiningSampleTokensLocked: 'u64',
//   MiningSpeedBoostSamplingTokenMiningSamplingConfig: {
//     token_sample_date: 'Moment',
//     token_sample_tokens_locked: 'u64'
//   },
//   MiningSpeedBoostSamplingHardwareMining: '[u8; 16]',
//   MiningSpeedBoostSamplingHardwareMiningIndex: 'u64',
//   MiningSpeedBoostSamplingHardwareMiningSampleDate: 'u64',
//   MiningSpeedBoostSamplingHardwareMiningSampleHardwareOnline: 'u64',
//   MiningSpeedBoostSamplingHardwareMiningSamplingConfig: {
//     hardware_sample_date: 'Moment',
//     hardware_sample_hardware_online: 'bool'
//   },
//   MiningSpeedBoostEligibilityTokenMining: '[u8; 16]',
//   MiningSpeedBoostEligibilityTokenMiningIndex: 'u64',
//   MiningSpeedBoostEligibilityTokenMiningCalculatedEligibility: 'u64',
//   MiningSpeedBoostEligibilityTokenMiningTokenLockedPercentage: 'u32',
//   MiningSpeedBoostEligibilityTokenMiningDateAudited: 'u64',
//   MiningSpeedBoostEligibilityTokenMiningAuditorAccountID: 'u64',
//   MiningSpeedBoostEligibilityTokenMiningEligibilityResult: {
//     token_calculated_eligibility: 'u64',
//     token_token_locked_percentage: 'u32',
//     token_date_audited: 'u64',
//     token_auditor_account_id: 'u64'
//   },
//   MiningSpeedBoostEligibilityHardwareMining: '[u8; 16]',
//   MiningSpeedBoostEligibilityHardwareMiningIndex: 'u64',
//   MiningSpeedBoostEligibilityHardwareMiningCalculatedEligibility: 'u64',
//   MiningSpeedBoostEligibilityHardwareMiningHardwareUptimePercentage: 'u32',
//   MiningSpeedBoostEligibilityHardwareMiningDateAudited: 'u64',
//   MiningSpeedBoostEligibilityHardwareMiningAuditorAccountID: 'u64',
//   MiningSpeedBoostEligibilityHardwareMiningEligibilityResult: {
//     hardware_calculated_eligibility: 'u64',
//     hardware_hardware_uptime_percentage: 'u32',
//     hardware_date_audited: 'u64',
//     hardware_auditor_account_id: 'u64'
//   },
//   MiningSpeedBoostLodgementsTokenMining: '[u8; 16]',
//   MiningSpeedBoostLodgementsTokenMiningIndex: 'u64',
//   MiningSpeedBoostLodgementsTokenMiningLodgementAmount: 'u64',
//   MiningSpeedBoostLodgementsTokenMiningLodgementDateRedeemed: 'u64',
//   MiningSpeedBoostLodgementsTokenMiningLodgementResult: {
//     token_claim_amount: 'u64',
//     token_date_redeemed: 'u64'
//   },
//   MiningSpeedBoostLodgementsHardwareMining: '[u8; 16]',
//   MiningSpeedBoostLodgementsHardwareMiningIndex: 'u64',
//   MiningSpeedBoostLodgementsHardwareMiningLodgementAmount: 'u64',
//   MiningSpeedBoostLodgementsHardwareMiningLodgementDateRedeemed: 'u64',
//   MiningSpeedBoostLodgementsHardwareMiningLodgementResult: {
//     hardware_claim_amount: 'u64',
//     hardware_date_redeemed: 'u64'
//   }
// };
