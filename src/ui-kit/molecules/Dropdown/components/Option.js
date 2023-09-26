import React, { Fragment } from 'react'
import { getEscapedRegexpChars } from '@/utils/getEscapedRegexpChars'

/* eslint-disable no-useless-escape */

export const Option = (props) => {
  const { text, inputValue } = props
  const escapedInputValue = getEscapedRegexpChars(inputValue)
  const matchExp = new RegExp(`${escapedInputValue}`, 'i')

  return (
    <div>
      {text.match(matchExp) && (
        <Fragment>
          {text.match(matchExp).index > 0 ? (
            <Fragment>
              <span>{text.slice(0, text.match(matchExp).index)}</span>
              <span
                style={{
                  fontWeight: '600',
                }}
              >
                {inputValue.toLowerCase()}
              </span>
            </Fragment>
          ) : (
            <Fragment>
              <span
                style={{
                  fontWeight: '600',
                }}
              >
                {inputValue.charAt(0).toUpperCase()}
                {inputValue.slice(1).toLowerCase()}
              </span>
            </Fragment>
          )}
          <span>{text.slice(text.match(matchExp).index + inputValue.length)}</span>
        </Fragment>
      )}
      {!text.match(matchExp) && <span>{text}</span>}
    </div>
  )
}

// Option.propTypes = {
//   text: PropTypes.string.isRequired,
//   inputValue: PropTypes.string,
// };

// Option.defaultProps = {
//   inputValue: '',
// };
