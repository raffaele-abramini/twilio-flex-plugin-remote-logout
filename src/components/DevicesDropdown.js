import * as styles from './styles'
import * as icons from './icons'
import { connect } from 'react-redux'
import React from 'react'
import { ModalPopupWithEntryControl as DropdownWithTrigger } from '@twilio/flex-ui'
import { DeviceList } from './DeviceList'
import { syncLogic } from '../syncLogic'

export const DevicesDropdown = ({ devices = {} }) => {
  const refs = {}
  const { [syncLogic.tokenHelpers.getCurrent()]: currentDevice, ...otherDevices } = devices;
  const areOtherDevicesConnected = () => otherDevices && Object.keys(otherDevices).length;

  const setModalRef = (element) => {
    refs.modal = element || refs.modal
  }


  const renderControl = (isOpen) => (
    <styles.ToggleButton
      isOpen={isOpen}
      icon={areOtherDevicesConnected()
        ? <styles.Alert>{isOpen ? <icons.MultiLoginBold/> : <icons.MultiLogin/>}</styles.Alert>
        : isOpen ? <icons.SingleLoginBold/> : <icons.SingleLogin/>
      }
    />
  )

  return (
    <styles.OuterBox>
      <DropdownWithTrigger
        alignRight
        autoClose
        entryControl={renderControl}
        ref={setModalRef}
      >
        <DeviceList
          devices={otherDevices}
          refs={refs}
        />
      </DropdownWithTrigger>
    </styles.OuterBox>
  )
}

export const ConnectedDevicesDropdown = connect((state) => ({
  devices: state.devices
}))(DevicesDropdown)

