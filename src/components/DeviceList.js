import * as styles from './styles';
import React from 'react';
import { syncLogic } from '../syncLogic';

export const DeviceList = ({ devices, refs }) => {
  const handleLogout = (deviceKey) => {
    // Disconnect device
    syncLogic.logoutDevice(deviceKey);

    // Hide popup after a second
    setTimeout(() => refs.modal.hide(), 1000);
  };

  const renderDeviceRows = () => Object.keys(devices).map(deviceKey => {
    const { details, started } = devices[deviceKey];
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
    );
  });

  const areOtherDevicesConnected = () => devices && Object.keys(devices).length;

  return (
    <styles.InnerBox>
      {
        areOtherDevicesConnected()
          ? <>
            <styles.Title>
              You are logged in on {Object.keys(devices).length > 1 ? 'other devices' : 'another device'}.
            </styles.Title>
            {renderDeviceRows()}
          </>
          : (
            <styles.Title>
              You are only logged in on this device.
            </styles.Title>
          )
      }
    </styles.InnerBox>
  );
};
