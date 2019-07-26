import * as styles from './styles'
import * as icons from './icons'
import { connect } from 'react-redux'
import React from 'react'
import { ModalPopupWithEntryControl as DropdownWithIcon } from '@twilio/flex-ui'
import { DeviceList } from './DeviceList'
import { syncLogic } from '../syncLogic'

export const DevicesDropdown = ({ devices = {} }) => {
  const refs = {}

  const setModalRef = (element) => {
    refs.modal = element || refs.modal
  }

  const renderControl = (isOpen) => (
    <styles.ToggleButton
      isOpen={isOpen}
      icon={!devices || !Object.keys(devices).length
        ? isOpen ? <icons.SingleLoginBold /> : <icons.SingleLogin />
        : <styles.Alert>{isOpen ? <icons.MultiLoginBold /> : <icons.MultiLogin />}</styles.Alert>}
    />
  )

  return (
    <styles.OuterBox>
      <DropdownWithIcon
        alignRight
        autoClose
        entryControl={renderControl}
        ref={setModalRef}
      >
        <DeviceList
          devices={devices}
          refs={refs}
        />
      </DropdownWithIcon>
    </styles.OuterBox>
  )
}

export const ConnectedDevicesDropdown = connect((state) => {
  const { [syncLogic.tokenHelpers.getCurrent()]: currentDevice, ...otherDevices } = state.devices
  return {
    devices: otherDevices,
  }
})(DevicesDropdown)

