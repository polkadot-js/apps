import styled from "styled-components";
import React from "react";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {BadgeColor} from "@polkadot/react-components/types";
import Icon from "@polkadot/react-components/Icon";
import Tooltip from "@polkadot/react-components/Tooltip";

interface Props {
  className?: string;
  color: BadgeColor;
  icon: IconName;
  onClick?: () => void;
  popupContent: React.ReactNode;
}

function BadgeWithPopup ({className, color, icon, onClick, popupContent}: Props) {
  return (
    <div
      className={`ui--Badge${onClick ? ' isClickable' : ''}${color} Color ${className}`}
      data-testid={`${color}${icon ? `-${icon}` : ''}-badge`}
      onClick={onClick}
    >
      <div>{info || (icon && <Icon icon={icon} />)}</div>

    </div>
  );
}

export default React.memo(styled(BadgeWithPopup)`
`)
