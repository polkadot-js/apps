// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '../types';

import React from 'react';
import { Button, CardGrid } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import contracts from '../store';
import { useTranslation } from '../translate';

import Code from './Code';
import Upload from './Upload';
import Add from './Add';

export default function Codes ({ basePath, onShowDeploy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // const [isAddOpen, toggleIsAddOpen] = useToggle();
  // const [isUploadOpen, toggleIsUploadOpen] = useToggle();

  return (
    <>
      <CardGrid
        buttons={
          <Button.Group>
            <Upload />
            <Add />
          </Button.Group>
        }
        emptyText={t('No code hashes available')}
      >
        {contracts.getAllCode().map((code): React.ReactNode => {
          return (
            <Code
              code={code}
              key={code.json.codeHash}
              onShowDeploy={onShowDeploy}
            />
          );
        })}
      </CardGrid>
    </>
  );
}

// class Codes2 extends React.PureComponent<Props, State> {
//   public state: State = {
//     isAddOpen: false,
//     isUploadOpen: false
//   };

//   public render (): React.ReactNode {
//     const { basePath, showDeploy, t } = this.props;
//     const { isAddOpen, isUploadOpen } = this.state;

//     return (
//       <>
//         <CardGrid
//           buttons={
//             <Button.Group>
//               <Button
//                 icon='upload'
//                 label={t('Upload WASM')}
//                 onClick={this.showUpload}
//               />
//               <Button
//                 icon='add'
//                 label={t('Add an existing code hash')}
//                 onClick={this.showAdd}
//               />
//             </Button.Group>
//           }
//           emptyText={t('No code hashes available')}
//         >
//           {contracts.getAllCode().map((code): React.ReactNode => {
//             return (
//               <Code
//                 code={code}
//                 key={code.json.codeHash}
//                 onShowDeploy={showDeploy}
//               />
//             );
//           })}
//         </CardGrid>
//         <Upload
//           isOpen={isUploadOpen}
//           onClose={this.hideUpload}
//         />
//         <Add
//           basePath={basePath}
//           isOpen={isAddOpen}
//           onClose={this.hideAdd}
//         />
//       </>
//     );
//   }

//   private showUpload = (): void => {
//     this.setState({ isUploadOpen: true });
//   }

//   private hideUpload = (): void => {
//     this.setState({ isUploadOpen: false });
//   }

//   private showAdd = (): void => {
//     this.setState({ isAddOpen: true });
//   }

//   private hideAdd = (): void => {
//     this.setState({ isAddOpen: false });
//   }
// }

// export default translate(Codes);
