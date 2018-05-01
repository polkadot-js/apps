// @flow

declare module 'semantic-ui-react/dist/es/collections/Menu' {
  declare type Menu = React$StatelessFunctionalComponent<*> & {
    Item: React$StatelessFunctionalComponent<*>
  };
  declare module.exports: Menu & {
    default: Menu
  }
}

declare module 'semantic-ui-react/dist/es/elements/Button' {
  declare type Button = React$StatelessFunctionalComponent<*>;
  declare module.exports: Button & {
    default: Button
  }
}

declare module 'semantic-ui-react/dist/es/elements/Icon' {
  declare type Icon = React$StatelessFunctionalComponent<*>;
  declare module.exports: Icon & {
    default: Icon
  }
}

declare module 'semantic-ui-react/dist/es/elements/Input' {
  declare type Input = React$StatelessFunctionalComponent<*>;
  declare module.exports: Input & {
    default: Input
  }
}

declare module 'semantic-ui-react/dist/es/elements/Label' {
  declare type Label = React$StatelessFunctionalComponent<*>;
  declare module.exports: Label & {
    default: Label
  }
}

declare module 'semantic-ui-react/dist/es/modules/Dropdown' {
  declare type Dropdown = React$StatelessFunctionalComponent<*> & {
    Divider: React$StatelessFunctionalComponent<*>,
    Header: React$StatelessFunctionalComponent<*>,
    Item: React$StatelessFunctionalComponent<*>
  };
  declare module.exports: Dropdown & {
    default: Dropdown
  }
}

declare module 'semantic-ui-react/dist/es/modules/Modal' {
  declare type Modal = React$StatelessFunctionalComponent<*> & {
    Actions: React$StatelessFunctionalComponent<*>,
    Content: React$StatelessFunctionalComponent<*>,
    Header: React$StatelessFunctionalComponent<*>
  };
  declare module.exports: Modal & {
    default: Modal
  }
}
