import { ESubjobStatus, TSubJob } from "~/components/ToDo2023.offline/state/types";

export const standardJobList: {
  name: string;
  description?: string;
  subjobs?: TSubJob[];
}[] = [
  {
    name: 'Standard Job 1 etr ert ertert ert erterter',
    description: 'Descr',
    subjobs: [
      {
        name: 'Standard Subjob 1.1',

        // NOTE: This values will be replaced:
        id: '1.1-',
        status: ESubjobStatus.IN_PROGRESS,
        tsCreate: new Date().getTime(),
        tsUpdate: new Date().getTime(),
      },
      {
        name: 'Standard Subjob 1.2',

        // NOTE: This values will be replaced:
        id: '1.2-',
        status: ESubjobStatus.IN_PROGRESS,
        tsCreate: new Date().getTime(),
        tsUpdate: new Date().getTime(),
      }
    ]
  },
  {
    name: 'Standard Job 2'
  },
  {
    name: 'Standard Job 3'
  },
  {
    name: 'Standard Job 4'
  },
  {
    name: 'Standard Job 5',
    subjobs: [
      {
        name: 'Standard Subjob 5.1',

        // NOTE: This values will be replaced:
        id: '5.1-',
        status: ESubjobStatus.IN_PROGRESS,
        tsCreate: new Date().getTime(),
        tsUpdate: new Date().getTime(),
      }
    ]
  },
]
