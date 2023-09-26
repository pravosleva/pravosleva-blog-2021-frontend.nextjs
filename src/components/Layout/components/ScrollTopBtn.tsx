// import styled, { css } from 'styled-components'
// import { getLoaderColorByThemeName } from '@/utils/globalTheme/getLoaderColorByThemeName'

// const getTextColorByThemeName = (themeName) => {
//   switch (themeName) {
//     case 'gray':
//     case 'hard-gray':
//       return '#0162c8'
//     case 'light':
//     case 'dark':
//     default:
//       return '#fff'
//   }
// }

// export const ScrollTopBtn = styled('div')`
//   position: fixed;
//   z-index: 3;
//   right: 16px;
//   bottom: 16px;
//   border-radius: 50%;
//   border: none;
//   box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
//   cursor: pointer;
//   text-align: center;
//   width: 56px;
//   height: 56px;
//   ${({ themeName }) =>
//     themeName &&
//     css`
//       color: ${getLoaderColorByThemeName(themeName)};
//       background-color: ${getTextColorByThemeName(themeName)};
//     `}
//   &:hover {
//     ${({ themeName }) =>
//       themeName &&
//       css`
//         background-color: ${getLoaderColorByThemeName(themeName)};
//         color: ${getTextColorByThemeName(themeName)};
//       `}
//   }
//   outline: none;

//   transform: translateX(100px);
//   transition: all 0.3s ease-out;
//   ${(p) =>
//     p.isShowed &&
//     css`
//       transform: translateX(0px);
//     `}
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

export const ScrollTopBtn = () => null
