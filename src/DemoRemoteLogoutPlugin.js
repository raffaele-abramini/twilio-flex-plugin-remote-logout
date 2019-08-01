import React from 'react';
import { FlexPlugin } from 'flex-plugin';
import { ConnectedDevicesDropdown } from './components/DevicesDropdown'
import { syncLogic } from './syncLogic'
import { reducer } from './state'

const PLUGIN_NAME = 'DemoRemoteLogoutPlugin';

export default class DemoRemoteLogoutPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * Main entry point
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    // Add a reducer to the Flex Redux Store
    manager.store.addReducer("devices", reducer)

    // Add a UI component to the view
    flex.MainHeader.Content.add(<ConnectedDevicesDropdown key="devices" />)

    // Setup Twilio Sync client, fetch the existing devices, register current device, add event listeners
    syncLogic.setup(flex, manager);
  }
}
