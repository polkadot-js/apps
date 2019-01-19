# @polkadot/app-123code

A simple template to get started with adding an "app" to this UI. It contains the bare minimum for a nicely hackable app (if you just want to code _somewhere_) and the steps needed to create, add and register an new app that appears in the UI.

## adding an app

If you want to add a new app to the UI, this is the place to start.

1. Duplicate this `app-123code` folder and give it an appropriate name, in this case we will select `app-example` to keep things clear.
2. Edit the `apps-example/package.json` app description, i.e. the name, author and relevant overview.

And we have the basic app source setup, time to get the tooling correct.

3. Add the new app to the TypeScript config in root, `tsconfig.json`, i.e. an entry such as `"@polkadot/app-example/*": [ "packages/app-example/src/*" ],`
4. Add the new app to the Jest config in root, `jest.config.js`, by just adding `|example` appropriately on the first line.
5. In `apps/webpack.config.js` add `app-example` to the `const packages = [...]` list

At this point the app should be buildable, but not quite reachable. The final step is to add it to the actual sidebar in `apps`.

6. In `apps/src/routing/` duplicate the `template.ts` file to `example.ts` and edit it with the approprita information, including the hash link, name and icon (any icon name from semantic-ui-react/font-awesome 4 should be appropriate).
7. In the above description file, the `isHidden` field needs to be toggled to make it appear - the base template is hidden by default.
8. Finally add the `template` to the `apps/src/routing/index.ts` file at the appropriate place for both full and light mode (either optional)

Yes. After all that we have things hooked up. Run `yarn start` and your new app (non-coded) should whow up. Now start having fun and building something great.
