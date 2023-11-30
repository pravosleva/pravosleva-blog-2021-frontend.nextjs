import Alert, { AlertColor } from '@mui/material/Alert'
import { SxProps } from '@mui/system'
import { AlertTitle, IconButton, Theme } from '@mui/material'

export type TCustomAlertControl = {
  id: string;
  // color: 'primary' | 'secondary' | 'error' | 'success';
  Icon: React.ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}
export const CustomAlert = ({ header, description, alert, controls }: {
  header: string;
  description?: string;
  alert: {
    variant: 'standard' | 'filled' | 'outlined';
    severity?: AlertColor;
    icon?: boolean;
    sx?: SxProps<Theme>;
    // action?: React.ReactNode;
  };
  controls?: TCustomAlertControl[];
}) => {
  return (
    <Alert
      icon={alert.icon}
      variant={alert.variant}
      severity={alert.severity}
      sx={alert.sx}
      action={!!controls && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {
            controls.map(({ id, Icon, onClick, isDisabled }) => (
              <IconButton
                key={id}
                aria-label={`action ${id}`}
                disabled={isDisabled}
                // color=''
                onClick={onClick}
                size='small'
              >
                {Icon}
              </IconButton>
            ))
          }
        </div>
      )}
    >
      {
        !!description ? (
          <>
            <AlertTitle>{header}</AlertTitle>
            {description}
          </>
        ) : (
          header
        )
      }
    </Alert>
  )
}
