import { useMemo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { TTask } from '~/components/time-scoring/types'
import { useCompare } from '~/hooks/useDeepEffect'
import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
import {
  // Block,
  Btn,
  ClosableSearchPanelToggler,
  Pie,
} from '~/ui-kit.special'

const TopSpaceWrapper = styled('div')<{ test?: boolean }>`
  ${(p) => p.test &&
    css`
      border: 1px dashed red;
    `}

  overflowX; hidden;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 2;
  /* background-color: rgba(27,123,255,0.8); */
  /* background-color: rgba(0,0,0,0.2); */
  /* background-image: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.45),
    rgba(32, 107, 235, 0.9),
    rgba(0, 0, 0, 0.45)
  ); */
  @media (min-width: 768px) {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  display: flex;
  flex-direction: column;
  gap: 0;
`

const TopSpaceInternalBox = styled('div')<{ test?: boolean }>`
  ${(p) => p.test &&
    css`
      border: 1px dashed red;
    `}
  padding: 0;

  display: flex;
  flex-direction: column;
`
// const BtnsWrapper = styled('div')`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-wrap: wrap;
//   gap: 16px;
//   margin-bottom: 16px;
//   @media (max-width: 767px) {
//     margin-bottom: 16px;
//   }
// `
const BtnsGrid = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})`
  width: 100%;
  padding: 16px 16px 16px 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  // @media (max-width: 767px) { margin-bottom: 16px; }
`
const StarsExternalWrapper = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})<{
  isRoundedForDesktop: boolean;
}>`
  border: none;
  z-index: 1;

  ${(p) => p.isRoundedForDesktop && css`
    @media (min-width: 601px) {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  `}
`

const StarsWrapper = styled('div')`
  margin: 0 auto;
  padding: 0px 0 16px 0;
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: space-evenly;
`
const DiagramWrapper = styled('div')`
  margin: 0px;
  overflowX: hidden;
  @media (max-width: 600px) {
    width: 100vw !important;
  }
`
const ToolsPanelToggler = styled('div').attrs({
  className: 'backdrop-blur--subdark',
})`
  cursor: pointer;
  border-radius: inherit;

  // &:hover { background-color: rgba(27, 123, 255, 0.2); }
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

type TProps = {
  isToolsOpened: boolean;
  employeeNames: string[];
  informativeTaskList: TTask[];
  activeComplexity: number;
  createNewTask: ({ cb }: { cb?: {
    onSuccess: ({ isOk, message, isFirst }: { isOk: boolean, message?: string, isFirst?: boolean }) => void;
    onError: ({ isOk, message, isFirst }: { isOk: boolean, message?: string, isFirst?: boolean }) => void;
  } }) => void;
  handleSearchValueChange: (event: { target: { value: string; } }) => void;
  removeEmployeeFromLS: () => void;
  complexityToggler: (rate: number) => void;
  handleToggleToolsPanel: () => void;

  taskList: TTask[];
  addNewEmployeeToLS: () => void;
}

export const TopSpace = ({
  isToolsOpened,
  employeeNames,
  informativeTaskList,
  activeComplexity,
  createNewTask,
  handleSearchValueChange,
  removeEmployeeFromLS,
  complexityToggler,
  handleToggleToolsPanel,

  taskList,
  addNewEmployeeToLS,
}: TProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const toast = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
    if (!document.hidden) enqueueSnackbar(msg, opts)
  }, [])

  const isDiagramRequired = useMemo(() => informativeTaskList.length > 0, [useCompare([informativeTaskList])])

  const Diagram = useMemo(() => {
    return taskList.length > 0 ? (
      <DiagramWrapper>
        <Pie taskList={informativeTaskList} />
      </DiagramWrapper>
    ) : (
      <div
        style={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        className='backdrop-blur--subdark'
      >Нет стастистики</div>
    )
  }, [useCompare([taskList, informativeTaskList])])

  return (
    <TopSpaceWrapper>
      <TopSpaceInternalBox>
        <BtnsGrid>
          <Btn
            color='secondary-outlined'
            onClick={addNewEmployeeToLS}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa fa-plus" />
            <i className="fa fa-user-circle" />
          </Btn>
          {employeeNames &&
          Array.isArray(employeeNames) &&
          employeeNames.length > 0 ? (
            <>
              <Btn color='secondary-outlined' onClick={() => {
                createNewTask({
                  cb: {
                    onSuccess: ({ isOk, message, isFirst }) => {
                      toast(
                        isFirst ? 'Ваша первая задача создана, теперь установите для нее дату startDate' : (message || 'Что-то пошло не так...'),
                        { autoHideDuration: 10000, variant: isOk ? 'success' : 'error', preventDuplicate: true },
                      )
                    },
                    onError: ({ isOk, message }) => {
                      toast(
                        message || `Что-то пошло не так... ${JSON.stringify({ isOk, message })}`,
                        { autoHideDuration: 10000, variant: 'error' },
                      )
                    },
                  }
                })
              }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <i className="fa fa-plus" />
                <span>Task</span>
              </Btn>
              <Btn
                color='secondary-outlined'
                onClick={() => removeEmployeeFromLS()}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa fa-minus" />
                <i className="fa fa-user-circle" />
              </Btn>
            </>
            ) : null}
        </BtnsGrid>

        <StarsExternalWrapper
          isRoundedForDesktop={!isDiagramRequired}
        >
          <StarsWrapper onClick={(e) => e.stopPropagation()}>
            <ClosableSearchPanelToggler
              onChange={handleSearchValueChange}
            />
            {[1, 2, 3, 4, 5].map((rate) => (
              <span
                style={{ cursor: 'pointer' }}
                key={rate}
                onClick={(e) => {
                  e.stopPropagation()
                  if (activeComplexity !== rate) complexityToggler(rate)
                }}
              >
                <i
                  className="fa fa-star"
                  style={{
                    transition: 'all 0.3s linear',
                    color: '#fff',
                    opacity: activeComplexity >= rate ? '1' : '0.2',
                  }}
                />
              </span>
            ))}
            <span
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                if (activeComplexity !== 0) complexityToggler(0)
              }}
            >
              <i
                className="fa fa-ban"
                style={{
                  transition: 'all 0.3s linear',
                  color: '#fff',
                  opacity: activeComplexity === 0 ? '1' : '0.2',
                }}
              />
            </span>
          </StarsWrapper>
        </StarsExternalWrapper>

        {isToolsOpened && isDiagramRequired && (
          <>
            {Diagram}
          </>
        )}
      </TopSpaceInternalBox>
      {
        isDiagramRequired && (
          <ToolsPanelToggler onClick={handleToggleToolsPanel}>
            {isToolsOpened ? (
              <i className="fas fa-chevron-up" />
            ) : (
              <i className="fas fa-chevron-down" />
            )}
          </ToolsPanelToggler>
        )
      }
    </TopSpaceWrapper>
  )
}
