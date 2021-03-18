// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from "bn.js";
import React, { useEffect, useRef, useState } from "react";

import { Checkbox, Dropdown, Input, InputNumber, MarkError, MarkWarning, Modal } from "@polkadot/react-components";

import { useTranslation } from "../translate";
import { DeriveValidationOutput, PairType } from "../types";

interface Props {
  className?: string;
  onChange: (string: string) => void;
  seedType: string;
  derivePath: string;
  deriveValidation: DeriveValidationOutput | undefined;
  seed: string;
  addressFromSeed: (seed: string, derivePath: string, pairType: PairType) => string;
}

export const ETH_DEFAULT_PATH = "m/44'/60'/0'/0/0";

function CreateEthDerivationPath({
  addressFromSeed,
  className,
  derivePath,
  deriveValidation,
  onChange,
  seed,
  seedType
}: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [addIndex, setAddIndex] = useState(0);
  // const [maxIndex, setMaxIndex] = useState(5);
  const [customIndex, setCustomIndex] = useState(0);
  //const [addressList, setAddressList] = useState(
    const addressList=new Array(5).fill(0).map((_, i) => ({
      key: i,
      text: t("Address index {{index}} - {{address}}", {
        replace: { address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}`, "ethereum"), index: i }
      }),
      value: i
    }))
  //);
  const [useCustomPath, setUseCustomPath] = useState(false);
  const [useCustomIndex, setUseCustomIndex] = useState(false);

  const errorIndex = useRef<Record<string, string>>({
    INVALID_DERIVATION_PATH: t<string>("This is an invalid derivation path."),
    PASSWORD_IGNORED: t<string>("Password are ignored for hex seed"),
    SOFT_NOT_ALLOWED: t<string>("Soft derivation paths are not allowed on ed25519"),
    WARNING_SLASH_PASSWORD: t<string>(
      'Your password contains at least one "/" character. Disregard this warning if it is intended.'
    )
  });

  //   useEffect((): void => {
  //     const initLength = addressList.length;
  //     const _addressList = addressList;

  //     if (maxIndex > initLength) {
  //       for (let i = initLength; i < maxIndex; i++) {
  //         _addressList.push({
  //           key: i,
  //           text: t('Address index {{index}} - {{address}}', {
  //             replace: { address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}`, 'ethereum'), index: i }
  //           }),
  //           value: i
  //         });
  //       }

  //       setAddressList(_addressList);
  //     } else if (maxIndex < initLength) {
  //       setAddressList(_addressList.slice(0, maxIndex));
  //     } else {
  //       setAddressList(
  //         new Array(maxIndex).fill(0).map((_, i) => ({
  //           key: i,
  //           text: t('Address index {{index}} - {{address}}', {
  //             replace: { address: addressFromSeed(seed, `m/44'/60'/0'/0/${i}`, 'ethereum'), index: i }
  //           }),
  //           value: i
  //         }))
  //       );
  //     }
  //   }, [addressFromSeed, addressList, maxIndex, seed, t]);

  const _toggleCustomPath = () => {
    setUseCustomPath(!useCustomPath);
  };
  const _toggleCustomIndex = () => {
    setUseCustomIndex(!useCustomIndex);
  };

  //   const onChangeMaxIndex = (e: BN) => {
  //     setMaxIndex(Number(e));
  //   };

    const onChangeCustomIndex = (e: BN) => {
      setCustomIndex(Number(e));
    };

  useEffect((): void => {
    onChange(`m/44'/60'/0'/0/${addIndex}`);
  }, [addIndex,useCustomIndex, onChange]);

  useEffect((): void => {
    onChange(`m/44'/60'/0'/0/${customIndex}`);
  }, [customIndex, onChange]);

  return (
    <Modal.Columns
      className={className}
      hint={
        seedType === "raw"
          ? t<string>("The derivation path is only relevant when deriving keys from a mnemonic.")
          : t<string>("The derivation path allows you to create different accounts from the same base mnemonic.")
      }
    >
      {seedType === "bip" ? (
        <>
          {useCustomIndex ? (
            <InputNumber
              help={t<string>("You can set a custom derivation index for this account")}
              isDecimal={false}
              label={t<string>("Max index")}
              onChange={onChangeCustomIndex}
              value={new BN(customIndex)}
            />
          ) : (
            <Dropdown
              help={t("The address index (derivation on account) to use")}
              label={t("address index")}
              onChange={setAddIndex}
              options={addressList}
              value={addIndex}
            />
          )}
          {/* <InputNumber
              help={t<string>('Choose the number of address to display')}
              isDecimal={false}
              label={t<string>('Max index')}
              onChange={onChangeMaxIndex}
              value={new BN(maxIndex)}
            /> */}
          <div className="saveToggle">
            <Checkbox
              label={<>{t<string>("Use custom address index")}</>}
              onChange={_toggleCustomIndex}
              value={useCustomIndex}
            />
          </div>
          <div className="saveToggle">
            <Checkbox
              label={<>{t<string>("Use custom derivation path")}</>}
              onChange={_toggleCustomPath}
              value={useCustomPath}
            />
          </div>
          {useCustomPath ? (
            <Input
              help={t<string>(
                'You can set a custom derivation path for this account using the following syntax "m/<purpose>/<coin_type>/<account>/<change>/<address_index>'
              )}
              isError={!!deriveValidation?.error}
              label={t<string>("secret derivation path")}
              onChange={onChange}
              placeholder={ETH_DEFAULT_PATH}
              tabIndex={-1}
              value={derivePath}
            />
          ) : null}
        </>
      ) : (
        <MarkWarning content={t<string>("The derivation path is only relevant when deriving keys from a mnemonic.")} />
      )}

      {deriveValidation?.error && (
        <MarkError content={errorIndex.current[deriveValidation.error] || deriveValidation.error} />
      )}
      {deriveValidation?.warning && <MarkWarning content={errorIndex.current[deriveValidation.warning]} />}
    </Modal.Columns>
  );
}

export default React.memo(CreateEthDerivationPath);
