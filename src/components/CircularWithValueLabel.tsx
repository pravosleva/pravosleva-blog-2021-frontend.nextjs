import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import { themeColor, themeColorsNames } from '~/ui-kit';
// import { styled } from '@mui/material/styles';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 10,
//   borderRadius: 5,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 5,
//     backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
//   },
// }));

function FacebookCircularProgress(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'flex' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        disableShrink
        variant="determinate"
        sx={{
          // color: (theme) => (theme.palette.mode === 'light' ? theme.palette.primary : theme.palette.secondary),
          color: (theme) => theme.palette.primary.dark,
          // color: 'rgb(203,213,225)',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

type TProps = {
  progressValue: number;
}

export const CircularWithValueLabel = ({
  progressValue,
}: TProps) => {
  // const [progress, setProgress] = React.useState(10);
  // React.useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  // return <CircularProgressWithLabel value={progressValue} />;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <FacebookCircularProgress value={progressValue} />
      {/* <br />
      <BorderLinearProgress variant="determinate" value={progressValue} /> */}
    </Box>
  );
}
