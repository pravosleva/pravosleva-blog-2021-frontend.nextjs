/* eslint-disable react/destructuring-assignment */
import React from "react"
// import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { groupLog } from "~/utils/groupLog"

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
const Fab = styled("button")`
  width: 56px;
  height: 56px;
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  /* background-color: #29B6F6; */
  /* background-color: rgba(27,123, 255,0.8); */
  background-color: rgba(106, 197, 232,0.8);
  color: #fff;
  outline: none;

  transition: background-color 0.5s ease-in-out;
`
const ListMobileToggler = styled(Fab)<{
  opened?: boolean;
}>`
  bottom: 16px;
  right: 16px;
  z-index: 4;
  ${(p) => p.opened &&
    css`
      background-color: #1b7bff;
    `}
  @media(min-width: 768px) {
    display: none;
  }
  position: fixed;
`
const SidebarMobileToggler = styled(Fab)<{
  opened?: boolean;
}>`
  bottom: calc(32px + 56px);
  right: 16px;
  z-index: 4;
  ${(p) => p.opened &&
    css`
      background-color: #1b7bff;
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
      <i className="fa fa-chart-line" style={{ fontSize: "30px" }} />
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
    >
      <i className="fa fa-cogs" style={{ fontSize: "30px" }} />
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
