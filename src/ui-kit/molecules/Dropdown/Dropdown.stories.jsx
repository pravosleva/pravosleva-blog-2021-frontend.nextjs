/* eslint-disable no-console, react/jsx-no-comment-textnodes */
import React, { useState, useMemo } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Dropdown } from '@/ui-kit/molecules/Dropdown'
import { Theme } from '@/ui-kit'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs' // number

// interface IProps {
//   children: React.ReactNode
//   value: string
//   isInputIncorrect?: boolean
//   errorMessage?: string
// }

export default {
  title: 'Storybook Knobs',
  decorators: [withKnobs],
}

/*
const DropdownLightBG = () => (
  <section>
    <div>
      <p>inputParams.editable=false // Можно ли редактировать ввод</p>
      <p>label='Test' // Лейбл</p>
      <p>hasOptionsBorder=true</p>
      <p>displayDropdownArrow=true // Стрелка dropdown</p>
      <p>отфильтрованные элементы Dropdown</p>
      <p>inputParams.value - вторым</p>
      <p>{'optionsFilterFunc={(option, value) => option.value !== value}'}</p>
    </div>
    <div
      style={{
        width: '100%',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFFFFF',
        paddingTop: '10px',
      }}
    >
      <Dropdown value="Test value" />
    </div>
    <div>
      <p>isInputIncorrect=true // Ошибка</p>
    </div>
    <div
      style={{
        width: '100%',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFFFFF',
        paddingTop: '10px',
      }}
    >
      <Dropdown value="Test value" isInputIncorrect errorMessage="Test error" />
    </div>
    <div>
      <p>Пустой value</p>
    </div>
    <div
      style={{
        width: '100%',
        height: '100px',
        dispaly: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFFFFF',
        paddingTop: '10px',
      }}
    >
      <Dropdown value="" />
    </div>
  </section>
)
*/

const ColumnContainer = styled('div')`
  display: flex;
  flex-direction: column;
  > div:not(:last-child) {
    margin-bottom: 10px;
  }
`
const Container = styled('div')`
  display: flex;
  > button:not(:last-child) {
    margin-right: 10px;
  }
  max-width: 600px;
`
const optionsData = [
  {
    id: '111',
    name: 'Замена колёс',
    value: 'Замена колёс',
  },
  {
    id: '222',
    name: 'Замена стекол',
    value: 'Замена стекол',
  },
]

const renderDropdownPack = ({ errorMessage, packTitle }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState('')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isInputIncorrect = useMemo(() => !optionsData.some(({ value: v }) => v.includes(value)), [value])
  const dropdownLabelText = text('Dropdown label text', 'Label')
  const isDropdownEditable = boolean('isEditable', true)

  return (
    <>
      <h2>{packTitle}</h2>
      <Container>
        <Dropdown
          // ref ввода
          // inputRef={ref}
          // Параметры для контроля работы Input-а
          inputParams={{
            placeholder: dropdownLabelText,
            onChange: (e) => setValue(e.target.value),
            // onKeyUp: (e) => console.log('KEYUP'),
            // onClick: (e) => console.log(e),
            value,
            editable: isDropdownEditable, // можно ли редактировать поле ввода
          }}
          height="small"
          // Параметры для контроля работы текущего выбранного элемента из списка DropDown
          activeOptionHandlers={{
            onClick: (item) => setValue(item.value),
          }}
          // Список всех элементов DropDown
          optionsData={optionsData}
          // Опциональная функция для фильтрации - будут отображены только отфильтрованные элементы Dropdown
          // Получает объект опции первым аргументом, текущее значение inputParams.value - вторым
          optionsFilterFunc={(option, value) => option.value !== value}
          // Параметры отображения для устроиств
          desktop
          mobile
          t={(t) => t}
          // Наличие границы у списка опций (предназначено для светлого фона)
          hasOptionsBorder
          // Текст лейбла
          label={dropdownLabelText}
          // Некорректные данные
          isInputIncorrect={isInputIncorrect}
          errorMessage={isInputIncorrect ? 'Incorrect value' : null}
          // Отображать стрелку выпадающего меню
          displayDropdownArrow={false}
        />
      </Container>
    </>
  )
}

const dropdownPacks = () => <ColumnContainer>{renderDropdownPack({ packTitle: 'Input & Dropdown' })}</ColumnContainer>

storiesOf('molecules', module).add('Dropdown', () => {
  return <ThemeProvider theme={Theme}>{dropdownPacks()}</ThemeProvider>
})
