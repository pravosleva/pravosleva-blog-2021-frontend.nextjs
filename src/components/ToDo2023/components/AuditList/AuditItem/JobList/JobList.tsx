import { IJob } from "~/components/ToDo2023/state"
import { JobItem } from './JobItem'
import { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import { todo2023HttpClient } from "~/utils/todo2023HttpClient";
import { useDispatch } from "react-redux";
import { addJob, addSubjob } from "~/store/reducers/todo2023";
import {
  // VariantType,
  useSnackbar,
} from 'notistack'

export const JobList = memo(({
  jobs,
  auditId,
  // auditTsUpdate,
}: {
  jobs: IJob[],
  auditId: string;
  auditTsUpdate: number;
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const handleActualize = useCallback(async () => {
    // NOTE: Get remote standardJobList -> Put to jobs
    const remoteJobs: IJob[] = await todo2023HttpClient.getJobs()
      .then((res) => {
        // console.log(res)
        // @ts-ignore
        if (!res?.jobs) throw new Error('jobs was not received')
        // @ts-ignore
        return res.jobs
      })
      .catch((err) => {
        console.log(err)
        return []
      })
    if (remoteJobs.length > 0) {
      for (const remoteJob of remoteJobs) {
        // NOTE: Если такой работы нет в списке -> Добавить ее
        const jobIndex = jobs.findIndex(({ name }) => remoteJob.name === name)
        if (jobIndex === -1) {
          // NOTE: Add local job
          dispatch(addJob({
            auditId,
            name: remoteJob.name,
            subjobs: remoteJob.subjobs,
          }))
          enqueueSnackbar(`New Job 👉 ${remoteJob.name}`, { variant: 'success', autoHideDuration: 10000 })
        } else {
          // NOTE: Проверяем ее на предмет subjobs
          const remoteSubjobs = remoteJob.subjobs
          const localSubjobs = jobs[jobIndex].subjobs

          for (const remoteSubjob of remoteSubjobs) {
            const localSubjobIndex = localSubjobs.findIndex(({ name }) => remoteSubjob.name === name)
            if (localSubjobIndex === -1) {
              // TODO: Add local subjob
              dispatch(addSubjob({
                name: remoteSubjob.name,
                auditId,
                jobId: jobs[jobIndex].id,
              }))
              enqueueSnackbar(`New Subjob in ${remoteJob.name} 👉 ${remoteSubjob.name}`, { variant: 'success', autoHideDuration: 10000 })
            }
          }
        }
      }
    }
  }, [])
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: '8px',
        paddingLeft: '16px',
        // paddingRight: '10px',
        borderLeft: '4px solid lightgray',
      }}
    >
      {jobs.map((job) => (
        <JobItem
          auditId={auditId}
          job={job}
          key={job.id}
        />
      ))}
      <Button variant="outlined" onClick={handleActualize}>Актуализировать</Button>
    </div>
  )
}, (prevPs, nextPs) => prevPs.auditTsUpdate === nextPs.auditTsUpdate)
