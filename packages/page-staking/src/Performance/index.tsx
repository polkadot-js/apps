import React, {useCallback, useMemo, useState} from "react";
import {SortedTargets} from "@polkadot/app-staking/types";
import Performance from "./Performance";
import {useApi, useCall} from "@polkadot/react-hooks";
import {DeriveSessionProgress} from "@polkadot/api-derive/types";
import {Input, Spinner} from "@polkadot/react-components";
import {useTranslation} from "@polkadot/app-staking/translate";

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

function PerformancePage ({ className = '', favorites, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const historyDepth = useCall<number>(api.query.staking.historyDepth);
  const [{ isValid, key }, setValue] = useState<{ isValid: boolean; key: string }>(() => ({
    isValid: false,
    key: '',
  }));
  const [ inputSession, setInputSession ] = useState<number | null>(null);

  const currentSession = useMemo( () => {
      return sessionInfo?.currentIndex.toNumber();
    },
    [sessionInfo]
  );

  const minimumSessionNumber = useMemo(() => {
      if (currentSession && historyDepth && sessionInfo) {
        return Math.max(currentSession - historyDepth * sessionInfo.sessionsPerEra.toNumber(), 0);
      }
      return null;
    },
    [historyDepth, currentSession, sessionInfo]
  );

  const _onChangeKey = useCallback(
    (key: string): void => {
      let valid = false;
      if (currentSession && historyDepth && minimumSessionNumber) {
        let sessionNumber = parseInt(key);
        if (!isNaN(sessionNumber)) {
          if (sessionNumber < currentSession && minimumSessionNumber <= sessionNumber) {
            valid = true;
          }
        }
      }
      setValue({
        isValid: valid,
        key: key,
      });
    },
    [currentSession, minimumSessionNumber]
  );

  const _onAdd = useCallback(
    (): void => {
      if (isValid) {
          setInputSession(Number(key));
      }
    },
    [isValid, key]
  );

  const help = useMemo(() => {
        let msg = t<string>("Enter past session number.");
        if (currentSession) {
          msg += " Current is " + currentSession + ".";
          if (minimumSessionNumber) {
            msg += " Minimum session number is " + minimumSessionNumber + ".";
          }
        }
        return msg;
    },
    [currentSession, minimumSessionNumber]
    );

  return (
    <section>
        <Input
          autoFocus
          label={t<string>('Session number')}
          help={help}
          onChange={_onChangeKey}
          onEnter={_onAdd}
          isError={!isValid}
        />
      {(!currentSession || !inputSession) ?
        (<Spinner />) :
        (<Performance
          favorites={favorites}
          targets={targets}
          toggleFavorite={toggleFavorite}
          session={inputSession}
        />)
      }
    </section>
  );
}

export default React.memo(PerformancePage);
