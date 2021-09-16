import {AddressSmall, Menu, Popup, Tag} from "@polkadot/react-components";
import React, {useContext} from "react";
import {DisplayedJudgement, ThemeDef} from "@polkadot/react-components/types";
import {ThemeContext} from "styled-components";
import {RegistrarIndex} from "@polkadot/types/interfaces/identity/types";
import {useRegistrars} from "@polkadot/react-hooks";

interface Props {
  judgementName: DisplayedJudgement;
  registrarsIndexes: RegistrarIndex[]
}

const getColor = (name: DisplayedJudgement): 'green' | 'red' => {
  return (name === 'Erroneous' || name === 'Low quality') ? 'red' : 'green';
}

export function JudgementTag ({judgementName, registrarsIndexes}: Props) {
  const { registrars: allRegistrars } = useRegistrars()
  const { theme } = useContext<ThemeDef>(ThemeContext);

  const findRegistrarByIndex = (index: number) => {
    return allRegistrars.find(registrar => registrar.index === index)
  }

  const judgementColor = getColor(judgementName);
  const registrars = registrarsIndexes.map(index => findRegistrarByIndex(index.toNumber()))

  return (
  <>
    <Popup
      className={`theme--${theme}`}
      value={
        <Menu>
          {
            registrars.map((registrar) => registrar && <AddressSmall value={registrar.address}/>)
          }
        </Menu>
      }
    >
      <Tag
        color={judgementColor}
        isTag={false}
        key={judgementName}
        label={`${registrarsIndexes.length} ${judgementName}`}
        size='tiny'
      />
    </Popup>

  </>
  )
}
