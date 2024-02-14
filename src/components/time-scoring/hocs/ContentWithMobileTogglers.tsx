/* eslint-disable react/destructuring-assignment */
import React from 'react'
// import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { groupLog } from '~/utils/groupLog'
import { Fab } from '~/ui-kit.team-scoring-2019'
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import InfoIcon from '@mui/icons-material/Info'
import MoreVertIcon from '@mui/icons-material/MoreVert'

/*
  FAB EXAMPLES:
  https://codepen.io/ruslan_khomiak/pen/QGmwMP
  https://codepen.io/kylelavery88/pen/pjeJvb
*/

const Container = styled("div")<{
  test?: boolean;
}>`
  max-height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  ${(p) => p.test &&
    css`
      border: 1px solid red;
    `}
`

const ListMobileToggler = styled(Fab)<{
  opened?: boolean;
}>`
  bottom: 16px;
  right: 16px;
  z-index: 4;
  ${(p) => p.opened &&
    css`
      background-color: #6efacc;
      color: #000;
    `}
  @media(min-width: 768px) {
    display: none;
  }
  position: fixed;
`

const SidebarMobileToggler = styled(Fab)<{
  opened?: boolean;
  colored?: boolean;
}>`
  bottom: calc(32px + 56px);
  right: 16px;
  z-index: 4;
  ${(p) => p.colored &&
    css`
      /* background-color: rgba(255,120,30,1);
      border-color: rgba(255,120,30,1); */
      background-color: #ff8c59;
      border-color: #ff8c59;;
      color: #000;
    `}
  ${(p) => p.opened &&
    css`
      background-color: #6efacc;
      border-color: #6efacc;
      color: #000;
    `}
  @media(min-width: 768px) {
    display: none;
  }
  position: fixed;
`

type TProps = {
  listOpened?: boolean;
  listToggler: (val?: boolean) => void;
  sidebarOpened?: boolean;
  sidebarToggler: (val?: boolean) => void;
  content: any;
  testDates: Date[];
  activeEmployee?: string;
}

export const ContentWithMobileTogglers = (props: TProps) => (
  <Container>
    <ListMobileToggler
      onClick={() => {
        if (!props.listOpened && props.sidebarOpened) {
          props.sidebarToggler(false)
        }
        props.listToggler()
        groupLog({ spaceName: "props.testDates", items: [props.testDates] })
      }}
      opened={props.listOpened}
    >
      {
        !!props.activeEmployee
        ? <BarChartIcon fontSize='large' /> // <i className="fa fa-chart-bar" style={{ fontSize: "20px" }} />
        : <InfoIcon fontSize='large' /> // <i className="fas fa-info" style={{ fontSize: "18px" }} />
      }
    </ListMobileToggler>

    <SidebarMobileToggler
      onClick={() => {
        if (!props.sidebarOpened && props.listOpened) {
          props.listToggler(false)
        }
        props.sidebarToggler()
        groupLog({ spaceName: "props.testDates", items: [props.testDates] })
      }}
      opened={props.sidebarOpened}
      colored={!!props.activeEmployee}
    >
      {
        !!props.activeEmployee
        ? <FilterAltIcon fontSize='large' /> // <i className="fas fa-filter" style={{ fontSize: "16px" }}></i>
        : <MoreVertIcon fontSize='large' /> // <i className="fas fa-ellipsis-v" style={{ fontSize: "20px" }} />
      }
    </SidebarMobileToggler>

    {props.content ? props.content({ ...props }) : null}
  </Container>
)

// Content.propTypes = {
//   listToggler: PropTypes.func.isRequired,
//   listOpened: PropTypes.bool.isRequired,
//   sidebarToggler: PropTypes.func.isRequired,
//   sidebarOpened: PropTypes.bool.isRequired,
// }
// Content.defaultProps = {
//   ListMobileToggler: () => {},
// };
