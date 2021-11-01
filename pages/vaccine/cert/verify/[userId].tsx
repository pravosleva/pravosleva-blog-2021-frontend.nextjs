import React from 'react'
import axios from 'axios'
import { CertVerifiedPage } from '~/components/covid-trash'

// TODO: перенести в hoc по аналогии с privateRouteHOC?
// import { privateRouteHOC } from '@/helpers/services/hoc/privateRouteHOC'

const API_URL = process.env.API_URL || 'http://localhost:1337'

const api = axios.create({ baseURL: API_URL })
const isDev = process.env.NODE_ENV === 'development'

const VerifyPage = ({ userData, errorMsg }: any) => {
  return <>
    {isDev && !!errorMsg && (
      <pre style={{ border: '1px solid red' }}>{JSON.stringify(userData, null, 2)}</pre>
    )}
    {!!errorMsg && <div>{errorMsg}</div>}
    {
      !errorMsg && (
        <CertVerifiedPage
          userData={userData}
        />
      )
    }
  </>
}

VerifyPage.getInitialProps = async (ctx: any) => {
  const { query } = ctx
  const { userId } = query
  let errorMsg = null

  const fetchUserData = async (userId: string) => {
    if (!userId) return null

    const result = await api
      .get(`/users/${userId}`)
      .then((res) => res.data)
      .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

    // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
    if (typeof result === 'string') {
      errorMsg = result
    }
    return result
  }

  const result = await fetchUserData(userId)

  return { userData: result, errorMsg }
}

export default VerifyPage