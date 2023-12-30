import { useEffect, useState, useMemo } from 'react'
import { TAudit } from '~/components/audit-helper'
import { useCompare } from '~/hooks/useDeepEffect'
import { getTimeAgo } from '~/utils/time-tools/getTimeAgo'

type TProps = {
  audits: TAudit[];
}

const getLastTs = ({ audits, key }: { audits: TAudit[]; key: 'tsUpdate' }): number | undefined => {
  let lastTs

  for (const audit of audits) {
    if (!lastTs) lastTs = audit[key]

    if (audit[key] > lastTs) lastTs = audit[key]
  }

  return lastTs
}

export const useLastUpdatedAuditTs = ({
  audits,
}: TProps) => {
  const [lastTsUpdate, setLastTsUpdate] = useState<number | undefined>(getLastTs({ audits, key: 'tsUpdate' }))
  useEffect(() => {
    setLastTsUpdate(getLastTs({ audits, key: 'tsUpdate' }))
  }, [useCompare([audits])])

  const lastTsUpdateTimeAgoText = useMemo(() => getTimeAgo(lastTsUpdate), [lastTsUpdate])

  return {
    last: {
      tsUpdate: {
        value: lastTsUpdate,
        timeAgoText: lastTsUpdateTimeAgoText,
      }
    }
  }
}
