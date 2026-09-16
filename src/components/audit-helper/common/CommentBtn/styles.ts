import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  commentBox: {
    height: '100%',
    border: '2px solid rgba(203,213,225,1)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3, 2, 2, 2),
    display: 'flex',
    flexDirection: 'column',
    minHeight: '52px',
    position: 'relative',
    fontWeight: 'bold',
    fontSize: 'small',
  },
  editableCommentBox: {
    padding: theme.spacing(3, 2, 5, 2),
  },
  absoluteBadgeRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgb(203, 213, 225)',
    color: '#1e293b',
    borderRadius: '0 12px 0 16px',
    padding: '0px 8px 2px 10px',
    fontSize: '12px',
    lineHeight: '1.5em',
    fontWeight: 'bold',
  },
  absoluteControls: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    color: '#fff',
    display: 'flex',
    gap: '1px',

    '& button': {
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      padding: '4px 16px',
    },
    '& button:first-child': {
      borderRadius: theme.spacing(1, 0, 0, 1),
    },
    '& button:last-child': {
      borderRadius: theme.spacing(0, 1, 1, 0),
    },
  },
  btnDelete: {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  btnEdit: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  commentTitle: {
    maxWidth: '100%',
  },
  commentDescription: {
    fontFamily: 'monospace',
    maxHeight: '92px',
    overflowY: 'auto',
    height: '100%',

    '& > pre': {
      borderRadius: theme.spacing(2, 2, 0, 0),
      marginBottom: 0,
      backgroundColor: 'transparent',
      padding: theme.spacing(1, 1, 1, 1),
      
      // 🔥 Важно: защищаем внутренние теги <pre>, если разметка рендерится через них
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },

    // 🎯 ФИКС 1: Меняем "pre" на "pre-wrap" — это разрешает автоматический перенос строк
    whiteSpace: 'pre-wrap',

    // 🎯 ФИКС 2: Инструктируем браузер агрессивно разрывать слишком длинные слова/ссылки
    wordBreak: 'break-word', 
    overflowWrap: 'break-word',
  },
  commentAction: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      marginLeft: 'auto',
      display: 'flex',
      gap: theme.spacing(1),
    },
  },
}))
