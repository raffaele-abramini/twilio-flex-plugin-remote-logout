import { IconButton, styled } from '@twilio/flex-ui';

export const OuterBox = styled("div")`
  margin-left: auto;
  margin-top: 2px;
`
export const InnerBox = styled("div")`
  background: ${p => p.theme.colors.base2};
  width: 220px;
  color: ${p => p.theme.calculated.textColor};
  padding: 12px 12px 8px;
  margin-top: 9px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.2);
  animation: fadn 0.15s forwards;

  @keyframes fadn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`
export const Title = styled("p")`
  font-weight: bold;
  margin-top: 0;
  
  &:not(:last-child) {
    margin-bottom: 12px;
  }
`

export const DeviceRow = styled("div")`
  display: flex;
  padding: 8px 0 4px; 
  margin-top: 6px;
  border-top: 1px solid ${p => p.theme.colors.base4};
`
export const DeviceRowDetail = styled("div")`
  padding-right: 4px;
  margin-right: auto;
  font-size: 11px;
`

const setBg  = (p, det) => {
  const bg = det.bg || p.theme.colors.notificationIconColorError;
  return `linear-gradient(${bg}, ${bg})`;
}

export const LogoutDeviceBtn = styled(IconButton)`
  flex-shrink: 0;
  background-image: ${setBg};
  color: white;

  svg {
     width: 20px;
     height: 20px;
  }
`
export const ToggleButton = styled(IconButton)`
    background-image: ${p => p.isOpen ? setBg(p, { bg: 'rgba(0,0,0,0.4)' }) : ''};
`

export const Alert = styled("div")`
    animation: flashDangerColor 0.5s infinite alternate;
    
    @keyframes flashDangerColor {
      from { color: #ff2020; }
      to { color: #ff7272; }
    }
`
