import React from 'react'
import { SyncClient } from 'twilio-sync'
import uuid from 'uuid/v4'
import UAParser from 'ua-parser-js'
import { actions } from '../state'

export const syncLogic = {
  async setup(flex, manager) {
    this.flex = flex;
    this.manager = manager;
    this.flexState = manager.store.getState().flex
    const { token } = this.flexState.session.ssoTokenPayload
    const workerSid = this.flexState.worker.worker.sid;

    // Setup Twilio Sync client and get SyncMap
    this.devicesMap = await new SyncClient(token).map(`devices_${workerSid}`)

    // Add fetched values to the Redux store
    await this.syncHelpers.addInitialValuesToStore();

    // Attach listeners to devices events
    this.syncHelpers.addSyncListeners();

    // Attach listeners to logout event
    this.tokenHelpers.addFlexListeners();

    // Register current device to Sync map
    await this.syncHelpers.registerCurrentDevice();
  },

  syncHelpers: {
    async addInitialValuesToStore() {
      const devicesMapItems = await syncLogic.devicesMap.getItems()

      // Dispatch 'ADD_DEVICES' action to store with mapped items as payload
      syncLogic.manager.store.dispatch({
        type: actions.ADD_DEVICES,
        payload: devicesMapItems.items.reduce(this.formatDevicePayload, {}),
      })
    },

    addSyncListeners() {
      syncLogic.devicesMap.on('itemAdded', this.handleItemUpdated.bind(this))
      syncLogic.devicesMap.on('itemUpdated', this.handleItemUpdated.bind(this))
      syncLogic.devicesMap.on('itemRemoved', this.handleItemRemoved.bind(this));
    },

    handleItemUpdated(deviceItem) {
      // Extract 'descriptor' value from the item
      const { descriptor } = deviceItem.item

      // Dispatch 'UPDATE_DEVICE' action to add/update device into the store
      syncLogic.manager.store.dispatch({
        type: actions.UPDATE_DEVICE,
        payload: {
          key: descriptor.key,
          ...descriptor.data,
        },
      })
    },

    handleItemRemoved({ key }) {
      // If the removed device is the current one
      if (key === syncLogic.tokenHelpers.getCurrent()) {

        // Trigger user logout via Flex Action framework
        syncLogic.flex.Actions.invokeAction('Logout', {
          forceLogout: true,
          // We pass current user activity in the payload to preserve it
          activitySid: syncLogic.flexState.worker.activity.sid,
        })
      }

      // Dispatch 'REMOVE_DEVICE' action to remove device reference from the store
      syncLogic.manager.store.dispatch({
        type: actions.REMOVE_DEVICE,
        payload: key,
      })
    },

    async registerCurrentDevice() {
      const { browser, os } = UAParser(navigator)

      // Invoke the `set` method against the sync map ...
      await syncLogic.devicesMap.set(
        // ...with the current device token...
        syncLogic.tokenHelpers.getCurrent(),
        // ... and some extra details to display later on
        {
          started: new Date().toLocaleString(),
          details: {
            browser: browser.name,
            os: os.name,
          },
        }
      );
    },

    formatDevicePayload: (acc, item) => {
      const { descriptor } = item
      acc[descriptor.key] = {
        key: descriptor.key,
        ...descriptor.data,
      }

      return acc
    }
  },

  tokenHelpers: {
    deviceTokenKey: 'FLEX_REMOTE_LOGOUT_PLUGIN_DEVICE_TOKEN',
    getCurrent() {
      if (localStorage.getItem(this.getKey())) {
        return localStorage.getItem(this.getKey())
      } else {
        const t = uuid()
        localStorage.setItem(this.getKey(), t)
        return t
      }
    },

    removeCurrent() {
      localStorage.removeItem(this.getKey())
    },

    getKey() {
      return `${this.deviceTokenKey}`
    },

    addFlexListeners() {
      syncLogic.flex.Actions.addListener('beforeLogout', this.removeCurrent.bind(this))
    },
  },

  logoutDevice(deviceKey) {
    this.devicesMap.remove(deviceKey)
  },
}
