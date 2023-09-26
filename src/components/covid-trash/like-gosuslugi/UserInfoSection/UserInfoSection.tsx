import React, { useMemo } from 'react'
import { TUserData } from '~/components/covid-trash/like-gosuslugi/UserInfoSection/interfaces'
// import styled from 'styled-components'
import { useStyles } from './styles'
import { withTranslator } from '~/hocs/withTranslator'
import { getRandomInteger } from '~/utils/getRandomInteger'
import slugify from 'slugify'

const getSlugifyOrNot = (original: string, currentLang: string): string => {
  let result = original

  if (currentLang !== 'ru-RU') {
    let tmp = ''
    const splitedBySpaces = result.split(' ')

    // NOTE: Correct (v1)
    // if (splitedBySpaces.length === 3) { tmp = `${splitedBySpaces[1]} ${splitedBySpaces[0]}` }

    // NOTE: Incorrect - like sosuslugi.ru (v2)
    if (splitedBySpaces.length === 3) { tmp = `${splitedBySpaces[0]} ${splitedBySpaces[1]}` }

    result = slugify(tmp).replace(/-/g, ' ')
  }

  return result
}

const getCensoredFullName = (fullName: string): string => {
  const splitedBySpace = fullName.split(' ')
  let results: string[] = []

  splitedBySpace.forEach((str) => {
    const firstSymbol = str[0]
    const censored = `${firstSymbol}${'*'.repeat(str.length - 1)}`

    results.push(censored)
  })

  return results.join(' ')
}
const getModifiedDate = (dateOfBirth: string): string => {
  const splitedByDash = dateOfBirth.split('-').reverse()

  return splitedByDash.join('.')
}
const getModifiedPassportSN = (passportSN: number, startsIndexes: number[], spaceIndex: number = 4): string => {
  const asString = String(passportSN)
  const asArr = asString.split('')
  let result = ''

  asArr.forEach((s, i) => {
    switch (true) {
      case i === spaceIndex:
        result += ' *'
        break;
      case startsIndexes.includes(i):
        result += '*'
        break;
      default:
        result += s
        break;
    }
  })

  return result
}

export const UserInfoSectionConnected = ({ userData,
  t,
  currentLang,
}: { userData: TUserData } & any) => {
  // @ts-ignore
  const classes: any = useStyles()
  const randomIntPassportId = useMemo(() => getModifiedPassportSN(getRandomInteger(100000000, 999999999), [1, 3, 4, 5], 2), [])
  const modifiedFullName = useMemo(() => getCensoredFullName(getSlugifyOrNot(userData.fullName, currentLang)), [userData.fullName, currentLang])

  return (
    <div className={classes.wrapper}>
      <h6>{modifiedFullName}</h6>
      <div className='small-text'>{t('COVID-TRASH_PASSPORT')}: <span className='gray'>{getModifiedPassportSN(userData.passportSN, [2, 3, 5, 6])}</span></div>
      {currentLang !== 'ru-RU' && <div className='small-text'>{t('COVID-TRASH_INTL-PASSPORT-ID')}: <span className='gray'>{randomIntPassportId}</span></div>}
      <div className='small-text'>{t('COVID-TRASH_DATE-OF-BIRTH')}: <span className='gray'>{getModifiedDate(userData.dateOfBirth)}</span></div>
    </div>
  )
}

export const UserInfoSection = withTranslator(UserInfoSectionConnected)
