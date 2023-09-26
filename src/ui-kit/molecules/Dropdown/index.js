import React, { Fragment, Component } from 'react'
import { Button } from '@/ui-kit/atoms/Button'
import { StatusMessage } from '@/ui-kit/atoms/StatusMessage'
import { InputLabel } from '@/ui-kit/atoms/InputLabel'
import { Wrapper, DropDownSelect, InputWrapper, OptionsBox, LineBox, LiItem, DropdownInput } from './components'
import { DropdownArrow } from './components/DropdownArrow'
import { ClearIcon } from './components/ClearIcon'
import { Option } from './components/Option'

class DropdownComponent extends Component {
  itemList = React.createRef()

  state = {
    showDropdown: false,
    hightlight: -1,
    isInputFocused: false,
    isInputHovered: false,
  }

  open = () => {
    this.setState({
      showDropdown: true,
    })
  }

  close = () => {
    this.setState({
      showDropdown: false,
    })
  }

  onFocus = () => {
    const { inputParams } = this.props

    if (!!inputParams?.onFocus) inputParams.onFocus()

    this.setState({ isInputFocused: true })
    this.open()
  }

  handleChange = (e) => {
    this.open()

    if (!e.target.value) {
      this.resetHightlight()
    }
  }

  changeHightlight = (el) => {
    this.setState({
      hightlight: el,
    })
  }

  resetHightlight = () => {
    this.setState({
      hightlight: -1,
    })
  }

  next = () => {
    const { showDropdown, hightlight } = this.state
    const { optionsData } = this.props

    if (!showDropdown) {
      this.open()
    }
    if (Array.isArray(optionsData) && hightlight < optionsData.length - 1) {
      this.setState((prevState) => ({
        hightlight: prevState.hightlight + 1,
      }))

      let cur = this.itemList.current.querySelectorAll('.over')
      if (cur.length) {
        let curPos = cur[0].getBoundingClientRect()
        let listPos = this.itemList.current.getBoundingClientRect()
        let dist = this.itemList.current.scrollTop + curPos.bottom - listPos.bottom
        if (dist >= 0) this.itemList.current.scrollTop = dist + curPos.height
      }
    }
  }

  previous = () => {
    const { showDropdown, hightlight } = this.state
    const { optionsData } = this.props

    if (hightlight === 0) return
    if (!showDropdown) this.open()
    this.setState((prevState) => ({
      hightlight:
        prevState.hightlight === -1 ? Array.isArray(optionsData) && optionsData.length - 1 : prevState.hightlight - 1,
    }))

    let cur = this.itemList.current.querySelectorAll('.over')
    if (cur.length) {
      let curPos = cur[0].getBoundingClientRect()
      let listPos = this.itemList.current.getBoundingClientRect()
      let dist = curPos.top - listPos.top
      if (dist <= 0) this.itemList.current.scrollTop += dist - curPos.height
    }
  }

  processControl = (e) => {
    const { hightlight } = this.state
    const { optionsData } = this.props

    if ([38, 40, 27, 13, 9].includes(e.keyCode)) {
      switch (e.keyCode) {
        case 38: // up
          this.previous()
          break
        case 40: // down
          this.next()
          break
        case 9: // tab
        case 13: // enter
          if (hightlight !== -1) {
            this.handleOptionSelect(optionsData[hightlight])
          }
          break
        case 27: // escape
          this.close()
          break
        default:
          break
      }
    }
  }

  handleOptionSelect = (el = '') => {
    const { activeOptionHandlers } = this.props

    if (!!activeOptionHandlers?.onClick) activeOptionHandlers.onClick(el)

    this.close()
    this.resetHightlight()
  }

  onBlur = () => {
    const { hightlight } = this.state

    this.setState({ isInputFocused: false })
    if (parseInt(hightlight) === -1) {
      this.close()
    }
  }

  onMouseOver = () => {
    this.setState({ isInputHovered: true })
  }

  onMouseOut = () => {
    this.setState({ isInputHovered: false })
  }

  render() {
    const {
      height,
      inputParams,
      linkParams,
      // btnParams, // TODO
      optionsData,
      optionsFilterFunc,
      inputRef,
      noSolidSeparator,
      t,
      noInputBorder,
      hasOptionsBorder,
      isInputIncorrect,
      displayDropdownArrow,
      displayClearIcon,
      onClearIconClick,
      label,
      errorMessage,
      successMessage,
      infoMessage,
      rgs,
    } = this.props

    const { showDropdown, hightlight, isInputFocused, isInputHovered } = this.state

    const isDropdownVisible = showDropdown && Array.isArray(optionsData) && optionsData.length

    return (
      <Fragment>
        <Wrapper>
          <DropDownSelect height={height}>
            <InputWrapper>
              {!!label && !!inputParams.value && (
                <InputLabel
                  visible={!!inputParams.value}
                  isInputFocused={isInputFocused}
                  isInputHovered={isInputHovered}
                  isInputIncorrect={isInputIncorrect}
                  isInputFilled={inputParams && inputParams.value}
                  height={height}
                  animated
                  rgs={rgs}
                >
                  {label}
                </InputLabel>
              )}
              <DropdownInput
                hasBorder={!noInputBorder}
                height={height}
                ref={inputRef}
                attached={linkParams ? 'left' : undefined}
                show={showDropdown && Array.isArray(optionsData) && optionsData.length > 0}
                placeholder={inputParams && inputParams.placeholder ? t(inputParams.placeholder) : 'No params'}
                onChange={(e) => {
                  if (!!inputParams?.editable && !!inputParams?.onChange) inputParams.onChange(e)
                  this.handleChange(e)
                }}
                value={(inputParams && inputParams.value) || ''}
                onKeyUp={(e) => {
                  if (!!inputParams?.onKeyUp) inputParams.onKeyUp(e)
                }}
                onKeyDown={(e) => {
                  this.processControl(e)
                }}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                editable={inputParams.editable}
                isIncorrect={isInputIncorrect}
                rgs={rgs}
              />
              {!!displayDropdownArrow && (
                <DropdownArrow
                  isDropdownVisible={isDropdownVisible}
                  isInputHovered={isInputHovered}
                  isInputFilled={inputParams && inputParams.value}
                  height={height}
                />
              )}
              {!!displayClearIcon && <ClearIcon onClick={onClearIconClick} />}
              {noSolidSeparator && !!isDropdownVisible && <LineBox />}
              <OptionsBox
                show={isDropdownVisible}
                hasBorder={hasOptionsBorder}
                hasTopBorder={noSolidSeparator}
                isInputFocused={isInputFocused}
                isInputIncorrect={isInputIncorrect}
                height={height}
                rgs={rgs}
              >
                <ul ref={this.itemList}>
                  {Array.isArray(optionsData) && optionsData.length
                    ? optionsData
                        .filter(optionsFilterFunc ? (item) => optionsFilterFunc(item, inputParams.value) : () => true)
                        .map((item, index) => (
                          <LiItem
                            className={hightlight === index ? 'over' : ''}
                            onMouseOver={() => {
                              this.changeHightlight(index)
                            }}
                            onMouseOut={this.resetHightlight}
                            key={item.id}
                            onClick={() => {
                              this.handleOptionSelect(item)
                            }}
                            rgs={rgs}
                          >
                            {item.name ? <Option text={item.name} inputValue={inputParams.value} /> : ''}
                          </LiItem>
                        ))
                    : null}
                </ul>
              </OptionsBox>
            </InputWrapper>
            {linkParams ? (
              <Button
                attached="right"
                width="wide"
                size="large"
                // as={Link}
                type="orange"
                to={linkParams && linkParams.to ? linkParams.to : '/'}
                onClick={() => linkParams.onClick()}
                style={{
                  paddingLeft: '15px',
                  paddingRight: '15px',
                }}
              >
                {linkParams && linkParams.label ? t(linkParams.label) : 'No params'}
              </Button>
            ) : null}
          </DropDownSelect>
          {!!errorMessage && <StatusMessage messageType="error">{errorMessage}</StatusMessage>}
          {!!successMessage && <StatusMessage messageType="success">{successMessage}</StatusMessage>}
          {!!infoMessage && <StatusMessage messageType="info">{infoMessage}</StatusMessage>}
        </Wrapper>
      </Fragment>
    )
  }
}

// TODO: TypeScript...
// DropDown.propTypes = {
//   inputParams: PropTypes.shape({
//     value: PropTypes.string,
//     placeholder: PropTypes.string,
//     onClick: PropTypes.func,
//     onKeyUp: PropTypes.func,
//     editable: PropTypes.bool,
//   }),
//   linkParams: PropTypes.shape({
//     label: PropTypes.string,
//     to: PropTypes.string,
//     onClick: PropTypes.func,
//   }),
//   optionsData: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//       name: PropTypes.string,
//     }),
//   ),
//   optionsFilterFunc: PropTypes.func,
//   inputRef: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.shape({
//       current: PropTypes.instanceOf(
//         typeof Element !== 'undefined' ? Element : Object,
//       ),
//     }),
//   ]),
//   activeOptionHandlers: PropTypes.shape({
//     onClick: PropTypes.func,
//   }),
//   noSolidSeparator: PropTypes.bool, // разделитель между опциями и вводом не сплошной
//   noInputBorder: PropTypes.bool, // убрать бордер у ввода (для тёмного фона)
//   hasOptionsBorder: PropTypes.bool, // добавить бордер списку опций
//   displayDropdownArrow: PropTypes.bool, // отображать стрелку выпадающего меню
//   isInputIncorrect: PropTypes.bool, // подсветить ввод как некорректный
//   label: PropTypes.string, // текст лейбла
//   errorMessage: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.arrayOf(PropTypes.string),
//   ]), // строка с сообщением об ошибке
//   successMessage: PropTypes.string, // строка с сообщением об успехе
//   infoMessage: PropTypes.string, // строка с информационным сообщением
//   t: PropTypes.func.isRequired, // TODO вынести локализацию вовне
// };

// DropDown.defaultProps = {
//   inputParams: null,
//   linkParams: null,
//   optionsData: [],
//   optionsDataFunc: null,
//   inputRef: null,
//   activeOptionHandlers: null,
//   noInputBorder: false,
//   noSolidSeparator: false,
//   hasOptionsBorder: false,
//   displayDropdownArrow: false,
//   isInputIncorrect: false,
//   label: '',
//   errorMessage: '',
//   successMessage: '',
//   infoMessage: '',
// };

export const Dropdown = DropdownComponent
