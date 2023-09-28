// import { useEffect, useState } from 'react'
// import axios, { AxiosResponse } from 'axios'
import json from './car-marks-list-by-uremont.json'

const { marks } = json
/*
const baseURL = 'https://api-frontend.uservice.io'
type TUremontRes = {
  success: number,
  marks?: any[],
  message?: string,
  errors?: {
    [key: string]: string[]
  }
}
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })
const responseValidator = (res: TUremontRes) => {
  if (res.success !== 1 || !res.marks) {
    let errMsg = 'Err by uremont.com! '
    if (!!res.errors && typeof res.errors === 'object') {
      for (const key in res.errors) {
        if (Array.isArray(res.errors[key])) errMsg += `${key}: ${res.errors[key].join(', ')}`
      }
    }
    throw new Error(errMsg)
  }
  return res
}
const fetchMarksData = async () => {
  const formData = new FormData()
  formData.append('type_id', '1')
  formData.append('lang', 'ru')

  const result = await api
    .post(
      '/car/mark/get-list',
      formData,
      {
        headers: {
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
          // 'Cache-Control': 'no-cache',
          // 'Origin': 'https://uremont.com',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Content-Type': 'multipart/form-data',
          'Content-Length': 289,
          // 'Sec-Fetch-Dest': 'empty',
        },
      }
    )
    .then((res: AxiosResponse) => res.data)
    .then(responseValidator)
    .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

  return result
}
*/

export const CarSelectSample = () => {
  // const [marks, setMarks] = useState([])
  // const [err, setErr] = useState<string | null>(null)
  // useEffect(() => {
  //   fetchMarksData()
  //     .then((res) => {
  //       if (typeof res === 'string') setErr(res)
  //       else setMarks(res.marks)
  //     })
  // }, [])

  return (
    <pre>{JSON.stringify(marks.map(m => m.name), null, 2)}</pre>
  )
}
