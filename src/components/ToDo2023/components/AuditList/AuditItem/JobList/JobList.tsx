import { IJob } from "~/components/ToDo2023/state"
import { JobItem } from './JobItem'

export const JobList = ({
  jobs,
  auditId,
}: {
  jobs: IJob[],
  auditId: string;
}) => {
  
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
    </div>
  )
}
