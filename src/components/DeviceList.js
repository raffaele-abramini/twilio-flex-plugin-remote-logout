import * as styles from './styles'
import React from 'react'
import { syncLogic } from '../syncLogic'

export const DeviceList = ({ devices, refs }) => {
  const handleLogout = (deviceKey) => {
    // Disconnect device
    syncLogic.logoutDevice(deviceKey);

    // Hide popup after a second
    setTimeout(() => refs.modal.hide(), 1000)
  }

  const renderDeviceRows = () => Object.keys(devices).map(deviceKey => {
    const { details, started } = devices[deviceKey]
    return (
      <styles.DeviceRow key={deviceKey}>
        <styles.DeviceRowDetail>
          <p>{details.browser} | {details.os}</p>
          <p>{started}</p>
        </styles.DeviceRowDetail>
        <styles.LogoutDeviceBtn
          icon="Logout"
          onClick={() => handleLogout(deviceKey)}
          title="Logout device"
        />
      </styles.DeviceRow>
    )
  })

  const areDevicesConnected = () => devices && Object.keys(devices).length;

  return (
    <styles.InnerBox>
      {
        areDevicesConnected()
          ? <>
            <styles.Title>
              You're logged in on other devices <span role="img" aria-label="Thinking face">🤔</span>
            </styles.Title>
            {renderDeviceRows()}
          </>
          : (
            <styles.Title>
              This is the only device where you're logged in!
              <span role="img" aria-label="Let's celebrate!">&nbsp;🎉</span>
            </styles.Title>
          )
      }
    </styles.InnerBox>
  )
}
