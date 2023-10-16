/* eslint-disable import/no-unresolved */
import React, { Fragment } from 'react'
import { compose, withStateHandlers } from 'recompose'
import styled, { css } from 'styled-components'
import ReactHtmlParser from 'react-html-parser'
// import moment from 'moment'
import { SpeedGraph } from '~/ui-kit.special/SpeedGraph'
import { DistributionFunctionGraph } from '~/ui-kit.special/DistributionFunctionGraph'
import { Block, Note, StickyH2 } from '~/ui-kit.special'
import { TTask } from '~/components/time-scoring/types'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'

const Wrapper = styled("div")`
  width: 100%;
  height: 100vh;
  @media (max-width: 767px) {
    top: 0;
    bottom: 0; /* tst */
  }
  @media (min-width: 768px) {
  }
  position: relative;
  box-sizing: border-box;
`
const List = styled("div")<{
  test?: boolean;
  opened?: boolean;
}>`
  background-color: #fff;
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  height: 100%;
  ${(p) =>
    p.test &&
    css`
      border: 1px dashed red;
    `}
  @media(min-width: 768px) {
    min-width: 550px;
    width: 550px;
    /* при открытии/закрытии должна учитываться разница ширин обоих сайдбаров */
    transform: translateX(calc(100% - calc(550px - 585px)));
    ${(p) =>
      !p.opened &&
      css`
        transform: translateX(calc(0px - calc(550px - 585px)));
        background-color: #fff;
      `}
    transition: transform 0.3s ease-in-out, background-color 0.3s linear;
  }
  @media (max-width: 767px) {
    min-width: 100%;
    width: 100%;
    /* opacity: 0.8; */
    transform: translateX(0);
    ${(p) =>
      !p.opened &&
      css`
        transform: translateX(-100%);
        background-color: #fff;
      `}
    transition: transform 0.5s ease-in-out, background-color 0.5s linear;
  }
  /*
    display: flex;
    justify-content: center;
    align-items: center;
    */
`
const InternalListWrapper = styled("div")`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  /*
    display: flex;
    justify-content: center;
    align-items: center;
    */
  box-sizing: border-box;
`
const ListDesktopToggler = styled("button")`
  position: absolute;
  top: 0;
  right: -30px;
  width: 30px;
  height: 100%;
  padding: 0;
  cursor: pointer;
  border: none;
  background-color: rgba(255, 255, 255, 0.8);
  color: inherit;
  font-size: 30px;
  opacity: 0.3 !important;
  @media (max-width: 767px) {
    display: none;
  }
  border-radius: 0 8px 8px 0;
`
const Content = styled("div")<{
  test?: boolean;
}>`
  opacity: 1;
  ${(p) =>
    p.test &&
    css`
      border: 1px dashed red;
    `}
  box-sizing: border-box;
  min-height: 100%;
  height: 100%;
  overflow-y: auto;
`

// type TProps = {
//   listOpened: boolean;
//   activeEmployee?: string;
//   taskList: TTask[];
//   activeComplexity?: number;
//   testDates: any[];
//   listToggler: (_e: any) => void;
// }

export const withAbsoluteList = (ComposedComponent: any) =>
  compose(
    withStateHandlers(
      {
        listOpened: false,
      },
      {
        listToggler: ({ listOpened }, _props) => (val) => ({
          listOpened: val === true || val === false ? val : !listOpened,
        }),
      }
    ),
    // lifecycle({
    //   componentDidUpdate() {
    //     console.log("Absolute list updated");
    //   },
    // })
  )((props: any) => (
    <Wrapper>
      <List opened={props.listOpened}>
        {/* @ts-ignore */}
        <InternalListWrapper opened={props.listOpened}>
          <Content>
            <ResponsiveBlock>
              {props.activeEmployee &&
              props.taskList
                .filter((e: TTask) => e.employee === props.activeEmployee)
                .filter(
                  (e: TTask) => e.startDate && e.realFinishDate && e.forecastFinishDate
                ) ? (
                <Fragment>
                  <>
                    <StickyH2>
                      <i
                        className="fa fa-chart-line"
                        style={{ marginRight: "15px" }}
                      />
                      {props.activeEmployee} | Distribution
                    </StickyH2>
                    <Block>
                      <DistributionFunctionGraph
                        activeEmployee={props.activeEmployee}
                        theTasks={
                          props.activeEmployee
                            ? props.taskList
                                .filter(
                                  (e: TTask) => e.employee === props.activeEmployee
                                )
                                .filter(
                                  (e: TTask) =>
                                    e.startDate &&
                                    e.realFinishDate &&
                                    e.forecastFinishDate
                                )
                                .filter((e: TTask) =>
                                  props.activeComplexity
                                    ? e.complexity === props.activeComplexity
                                    : true
                                )
                            : []
                        }
                        testDiff={((employee) => {
                          const obj = props.testDates.filter((e: any) =>
                            Object.keys(e).includes(employee)
                          )
                            ? props.testDates.filter((e: any) =>
                                Object.keys(e).includes(employee)
                              )[0]
                            : null;

                          if (!obj) return null;
                          return (
                            // moment(obj[employee].finishDate).valueOf() -
                            // moment(obj[employee].startDate).valueOf()
                            obj[employee].finishDate - obj[employee].startDate
                          );
                        })(props.activeEmployee)}
                        testStart={((employee) => {
                          const obj = props.testDates.filter((e: any) =>
                            Object.keys(e).includes(employee)
                          )[0];

                          if (!obj) return null;
                          // return moment(
                          //   props.testDates.filter((e: any) =>
                          //     Object.keys(e).includes(employee)
                          //   )[0]
                          //     ? obj[employee].startDate
                          //     : null
                          // ).valueOf();
                          return props.testDates.filter((e: any) => Object.keys(e).includes(employee))[0] ? obj[employee].startDate : null
                        })(props.activeEmployee)}
                      />
                    </Block>

                    <StickyH2>
                      <i
                        className="fa fa-chart-bar"
                        style={{ marginRight: "15px" }}
                      />
                      {props.activeEmployee} | Speed
                    </StickyH2>
                    <Block>
                      <SpeedGraph
                        activeEmployee={props.activeEmployee}
                        theTasks={
                          props.activeEmployee
                            ? props.taskList
                                .filter(
                                  (e: TTask) => e.employee === props.activeEmployee
                                )
                                .filter(
                                  (e: TTask) =>
                                    e.startDate &&
                                    e.realFinishDate &&
                                    e.forecastFinishDate
                                )
                                .filter((e: TTask) =>
                                  props.activeComplexity
                                    ? e.complexity === props.activeComplexity
                                    : true
                                )
                            : []
                        }
                      />
                    </Block>
                  </>
                </Fragment>
              ) : (
                <>
                  <StickyH2>
                    <i
                      className="fa fa-wrench"
                      style={{ marginRight: "15px" }}
                    />
                    TODO
                  </StickyH2>
                  <Block>
                    <Note>
                      <ul>
                        {[
                          "Точность прогноза",
                          "Эффективность прогноза",
                          "График эффективности прогнозов за отдельный период",
                        ].map((e) => (
                          <li key={Math.random()}>{ReactHtmlParser(e)}</li>
                        ))}
                      </ul>
                      <em>Please, select the employee...</em>
                    </Note>
                  </Block>
                </>
              )}
            </ResponsiveBlock>
          </Content>
          <ListDesktopToggler onClick={() => props.listToggler()}>
            {props.listOpened ? (
              <i
                style={{ fontSize: "16px" }}
                className="fa fa-angle-double-left"
              />
            ) : (
              <i
                style={{ fontSize: "16px" }}
                className="fa fa-angle-double-right"
              />
            )}
          </ListDesktopToggler>
        </InternalListWrapper>
      </List>
      <ComposedComponent {...props} />
    </Wrapper>
  ));

// withLayout.propTypes = {
//   listOpened: PropTypes.bool.isRequired,
//   listToggler: PropTypes.func.isRequired,
// };
// withLayout.defaultProps = {
//   listOpened: () => {},
// };
