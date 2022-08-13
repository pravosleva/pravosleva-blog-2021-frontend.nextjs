import { Button, TextField, Box, Alert } from '@mui/material'
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import { ReportTable } from './components'
import { useStickyState } from '~/hooks/useStickyState'
import { TReport } from '~/components/Autopark2022/components/Report/interfaces'

type TProps = {
  project_id: string;
  chat_id: string;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const fetchGetProjectReport = async ({ chat_id, project_id, mileage }: { chat_id: string, project_id: string, mileage: number }) => {
  const result = await api
    .post('/project/get-report', {
      chat_id,
      project_id,
      current_mileage: mileage,
    })
    .then((res: any) => {
      // console.log(res)
      return res.data
    })
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}

export const Report = ({
  project_id,
  chat_id,
}: TProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [apiErr, setApiErr] = useState<string>('')
  // const [mileage, setMileage] = useState<number>(0)
  const [mileage, setMileage] = useStickyState(0, "autopark.current-mileage")
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false)
  const handleChangeMileage = useCallback((e: any) => {
    setMileage(parseInt(e.target.value))
    setIsSubmitDisabled(false)
  }, [project_id, chat_id])
  const [report, setReport] = useState<TReport[] | null>(null)
  const resetErr = useCallback(() => {
    setApiErr('')
    // setReport(null)
  }, [])
  const handleSubmit = useCallback(() => {
    resetErr()
    setIsLoading(true)
    fetchGetProjectReport({ chat_id, project_id, mileage })
      .then((res) => {
        if (res.ok && !!res.report) {
          setReport(res.report)
        } else {
          throw new Error(res?.message || 'No message from backend')
        }
      })
      .catch((err) => {
        setApiErr(typeof err === 'string' ? err : err.message || 'No err.message')
      })
      .finally(() => {
        setIsLoading(false)
        setIsSubmitDisabled(true)
      })
  }, [chat_id, project_id, mileage])
  const hasAnyReport = useMemo(() => !!report && Array.isArray(report) && report.length > 0, [report])

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField value={mileage} size='small' fullWidth disabled={isLoading} variant="outlined" label="Пробег" type="number" onChange={handleChangeMileage}></TextField>
      </Box>

      {
        !isSubmitDisabled && (
          <Box sx={{ mb: 2 }}>
            <Button fullWidth disabled={isLoading || !mileage} variant='contained' onClick={handleSubmit} color='secondary' startIcon={<LocalFireDepartmentIcon />}>Получить отчет</Button>
          </Box>
        )
      }

      {!!apiErr && (
        <Alert sx={{ mb: 2 }} variant="filled" severity="error">
          {apiErr}
        </Alert>
      )}

      {hasAnyReport && isSubmitDisabled ? (
        <Box sx={{ mb: 2 }}>
          {/* <pre>{JSON.stringify(report, null, 2)}</pre> */}
          <ReportTable report={report || []} />
        </Box>
      ) : isSubmitDisabled
        ? (
          <Alert sx={{ mb: 2 }} variant="filled" severity="info">
            Пока нет расходников
          </Alert>
        ) : null
      }
    </>
  )
}
