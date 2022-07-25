// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton'
import { CreateNewProject } from './components'
import { Box, Button } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from '~/components/Link';
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState';

type TProps = {
  chat_id: string
}

export const ProjectList = ({
  chat_id,
}: TProps) => {
  const projects = useSelector((s: IRootState) => s.autopark.userCheckerResponse?.projects || {})
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  return (
    <>
      <Box>
        {Object.keys(projects).map((id: string, i, a) => {
          return (
            // <ListItem key={id}>
            //   <ListItemButton>
            //     <ListItemText
            //       primary={projects[id].name}
            //       secondary={projects[id].description}
            //     />
            //   </ListItemButton>
            // </ListItem>
            <Button sx={{ mb: i !== a.length ? 2 : 0 }} fullWidth key={id} variant="outlined" color='primary' component={Link} noLinkStyle href={`/autopark-2022/${chat_id}/${id}`} shallow>
              {projects[id].name}
            </Button>
          )
        })}
      </Box>
      {isOneTimePasswordCorrect && (
        <Box>
          <CreateNewProject chat_id={chat_id} />
        </Box>
      )}
    </>
  )
}
