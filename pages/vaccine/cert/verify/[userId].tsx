import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import { CertVerifiedPage } from '~/components/covid-trash'
import { TUserData } from '~/components/covid-trash/like-gosuslugi/UserInfoSection/interfaces'

// TODO: перенести в hoc по аналогии с privateRouteHOC?
// import { privateRouteHOC } from '@/helpers/services/hoc/privateRouteHOC'

// const API_URL = process.env.API_URL || 'http://localhost:1337'

// const API_URL = 'http://pravosleva.ru/express-helper/'

// const api = axios.create({ baseURL: API_URL })
const isDev = process.env.NODE_ENV === 'development'

const VerifyPage = ({ userData, errorMsg }: any) => {
  const [isTimerEnabled, setIsTimerEnabled] = useState<boolean>(true)
  useEffect(() => {
    const disableLoader = () => {
      setTimeout(() => {
        setIsTimerEnabled(false)
      }, 3000)
    }
    if (typeof window !== 'undefined') disableLoader()
  }, [typeof window])
  
  return <>
    {
      isTimerEnabled && (
        <div className="container-app-loader">
          <div className="container-pulse pulse animated" />
          <div className="container-app-logo">
            <div className="app-logo" />
          </div>
        </div>
      )
    }
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

const fakeUsers: {[key: string]: TUserData} = {
  '128256': {
    confirmed: true,
    blocked: false,
    _id: '128256',
    username: 'Den',
    email: 'selection4test@gmail.com',
    fullName: 'Полторацкий Денис Владимирович',
    passportSN: 4607337817,
    dateOfBirth: '1986-04-13', // NOTE: Если создано из админки, прилетит именно в таком формате "1986-04-13"
    provider: 'NoName',
    createdAt: '2023-02-04T17:28:53.074Z', // ISO
    updatedAt: '2023-02-04T17:28:53.074Z', // ISO
    __v: 0,
    role: {
      _id: '0',
      name: 'user',
      description: 'user',
      type: 'NoName',
      createdAt: '2023-02-04T17:28:53.074Z', // ISO
      updatedAt: '2023-02-04T17:28:53.074Z', // ISO
      __v: 0,
      id: '0',
    },
    id: '128256',
  }
}

VerifyPage.getInitialProps = (ctx: any) => {
  const { query } = ctx
  const { userId } = query
  let errorMsg = null

  // const fetchUserData = async (userId: string) => {
  //   if (!userId) return null

  //   const result = await api
  //     .get(`/users/${userId}`)
  //     .then((res) => !!res.data)
  //     .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  //   // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
  //   if (typeof result === 'string') errorMsg = result

  //   return result
  // }

  // const result = await fetchUserData(userId)

  const result = fakeUsers[userId] || 'ERR: Not found'

  return { userData: result, errorMsg }
}

export default VerifyPage