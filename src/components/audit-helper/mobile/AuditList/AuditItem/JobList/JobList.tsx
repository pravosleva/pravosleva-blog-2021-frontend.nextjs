import { IJob, TSubJob } from "~/components/audit-helper"
import { JobItem } from './JobItem'
import { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import { todo2023HttpClient } from "~/utils/todo2023HttpClient";
import { useStyles } from './styles'
import {
  // VariantType,
  useSnackbar,
} from 'notistack'
import { useCompare } from "~/hooks/useDeepEffect"
import clsx from "clsx"

type TProps = {
  jobs: IJob[],
  auditId: string;
  auditTsUpdate: number;
  onAddJob: (ps: {
    auditId: string;
    name: string;
    subjobs: TSubJob[];
  }) => void;
  onAddSubjob: (ps: {
    name: string;
    auditId: string;
    jobId: string;
  }) => void;
  onToggleJobDone: ({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }) => void;
  onRemoveJob: ({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }) => void;
  onToggleSubjob: ({
    auditId,
    jobId,
    subjobId,
  }: {
    auditId: string;
    jobId: string;
    subjobId: string;
  }) => void;
  isEditable: boolean;
}

export const JobList = memo(({
  jobs,
  auditId,
  // auditTsUpdate,
  onAddJob,
  onAddSubjob,
  onToggleJobDone,
  onRemoveJob,
  onToggleSubjob,
  isEditable,
}: TProps) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const handleActualize = useCallback(async () => {
    let newsCounter = 0
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
        enqueueSnackbar(`ERR! ${err?.message || 'No err.message'}`, { variant: 'warning', autoHideDuration: 10000 })
        return []
      })
    if (remoteJobs.length > 0) {
      for (const remoteJob of remoteJobs) {
        // NOTE: Если такой работы нет в списке -> Добавить ее
        const jobIndex = jobs.findIndex(({ name }) => remoteJob.name === name)
        if (jobIndex === -1) {
          // NOTE: Add local job
          onAddJob({
            auditId,
            name: remoteJob.name,
            subjobs: remoteJob.subjobs,
          })
          enqueueSnackbar(`New Job 👉 ${remoteJob.name}`, { variant: 'warning', autoHideDuration: 7000 })
          newsCounter += 1
        } else {
          // NOTE: Проверяем ее на предмет subjobs
          const remoteSubjobs = remoteJob.subjobs
          const localSubjobs = jobs[jobIndex].subjobs

          for (const remoteSubjob of remoteSubjobs) {
            const localSubjobIndex = localSubjobs.findIndex(({ name }) => remoteSubjob.name === name)
            if (localSubjobIndex === -1) {
              // TODO: Add local subjob
              onAddSubjob({
                name: remoteSubjob.name,
                auditId,
                jobId: jobs[jobIndex].id,
              })
              enqueueSnackbar(`New Subjob in ${remoteJob.name} 👉 ${remoteSubjob.name}`, { variant: 'warning', autoHideDuration: 10000 })
              newsCounter += 1
            }
          }
        }
      }
    }

    if (newsCounter === 0) enqueueSnackbar('Уже актуально', { variant: 'success', autoHideDuration: 3000 })
  }, [useCompare(jobs)])
  return (
    <>
      {
        !!jobs && jobs.length > 0 ? (
          <div className={classes.warpper}>
            {jobs.map((job) => (
              <JobItem
                auditId={auditId}
                job={job}
                key={job.id}
                onToggleJobDone={onToggleJobDone}
                onRemoveJob={onRemoveJob}
                onToggleSubjob={onToggleSubjob}
                isEditable={isEditable}
              />
            ))}
            {
              isEditable && (
                <div className={clsx(classes.buttonWrapper, classes.desktopStickyBottomButton, 'backdrop-blur--lite')}>
                  <Button fullWidth variant="outlined" onClick={handleActualize}>Актуализировать</Button>
                </div>
              )
            }
          </div>
        ) : null
      }
    </>
  )
}, (prevPs, nextPs) => prevPs.auditTsUpdate === nextPs.auditTsUpdate && prevPs.isEditable === nextPs.isEditable)
