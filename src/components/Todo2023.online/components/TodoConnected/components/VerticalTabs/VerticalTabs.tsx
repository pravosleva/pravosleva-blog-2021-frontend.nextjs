import { useState, useMemo, useCallback, useLayoutEffect } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useCompare } from '~/hooks/useDeepEffect'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            pt: 0, // 2,
            pl: 2,
            pb: 2,
            pr: 0,
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function getTabProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

type TProps = {
  defaultActiveIndex?: number;
  cfg: {
    [key: string]: {
      label: string;
      Content: React.ReactNode;
    },
  }
}

export const VerticalTabs = ({ cfg }: TProps) => {
  const [value, setValue] = useState<number>(0)

  // NOTE: When tab will be removed...
  useLayoutEffect(() => {
    setValue(0)
  }, [useCompare([Object.keys(cfg).length])])

  const handleChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }, [setValue])
  const MemoizedTabs = useMemo(() => {
    return (
      <Tabs
        orientation='vertical'
        variant='scrollable'
        value={value}
        onChange={handleChange}
        aria-label='Vertical tabs'
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          p: 0,
        }}
      >
        {
          Object.keys(cfg).map((key, i) => (
            <Tab
              key={`${key}-${i}`}
              label={
                cfg[key].label.length > 8
                  ? `${cfg[key].label.substring(0, 8)}...`
                  : cfg[key].label
              }
              {...getTabProps(i)}
              sx={{
                px: 3,
                // mr: 1,
                fontSize: 'small',
              }}
            />
          ))
        }
      </Tabs>
    )
  }, [cfg, value, handleChange])
  const MemoizedPanels = useMemo(() => {
    return (
      <>
        {
          Object.keys(cfg).map((key, i) => (
            <TabPanel
              key={`${key}-${i}`}
              value={value}
              index={i}
            >
              {cfg[key].Content}
            </TabPanel>
          ))
        }
      </>
    )
  }, [cfg, value])

  return (
    <div
      // sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
      style={{
        display: 'flex',
        // border: '1px solid red',
        // maxHeight: '300px',
        // overflowY: 'hidden',
      }}
    >
      {Object.keys(cfg).length > 1 && MemoizedTabs}
      <div
        style={{
          // border: '1px solid red',
          width: '100%',
        }}
      >
        {MemoizedPanels}
      </div>
    </div>
  );
}
