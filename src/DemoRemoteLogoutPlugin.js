import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import { reducer } from './state'
import { ConnectedDevicesDropdown } from './components/DevicesDropdown'
import { syncLogic } from './syncLogic'

const PLUGIN_NAME = 'DemoRemoteLogoutPlugin';

export default class DemoRemoteLogoutPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    // Add a reducer to the Flex Redux Store
    manager.store.addReducer("devices", reducer);

    // Setup TwilioSync, fetch existing devices, add listeners, push current device to Sync
    syncLogic.setup(flex, manager);

    // Add our UI component
    flex.MainHeader.Content.add(<ConnectedDevicesDropdown key="device-dropdown"/>);
  }
}
