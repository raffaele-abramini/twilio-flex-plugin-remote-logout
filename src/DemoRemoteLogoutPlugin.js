import React from 'react';
import { FlexPlugin } from 'flex-plugin';
import { ConnectedDevicesDropdown } from './components/DevicesDropdown';
import { syncLogic } from './syncLogic';
import { reducer } from './state';

const PLUGIN_NAME = 'DemoRemoteLogoutPlugin';

export default class DemoRemoteLogoutPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * Main plugin entry point
   */
  init(flex, manager) {
    // Add a reducer to the Flex Redux Store
    manager.store.addReducer('devices', reducer);

    // Add a UI component to the view
    flex.MainHeader.Content.add(<ConnectedDevicesDropdown key="devices"/>);

    // Setup Twilio Sync client, fetch the existing devices, register current device, add event listeners
    syncLogic.setup(flex, manager);
  }
}
