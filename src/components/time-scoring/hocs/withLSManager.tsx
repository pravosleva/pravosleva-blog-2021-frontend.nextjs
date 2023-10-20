import React from 'react'
// @ts-ignore
import ls from 'local-storage'
import { compose, withStateHandlers, withHandlers, lifecycle } from 'recompose'
import swal from 'sweetalert2'
// import { useSnackbar, SnackbarMessage as TSnackbarMessage, OptionsObject as IOptionsObject } from 'notistack'
// import moment from 'moment'
import { groupLog } from '~/utils/groupLog'
import { TTask } from '~/components/time-scoring/types'

export const withLSManager = (ComposedComponent: any) => compose(
  withStateHandlers(
    ({
      // @ts-ignore
      initialState = {
        employeeNames: [], // Like this: ['str'] but original names only!
        taskList: [], // Like this: [{ id, employee, description, (startDate, forecastFinishDate, realFinishDate) }]
        errors: [],
        activeTaskID: 0,
        activeEmployee: '',
        activeComplexity: 0, // All by default (or 1-5)
        stepCounter: 0, // Service msg for date setting process
        testDates: [], // Should be set like [{ 'employeeName': { startDate, finishDate } }]
      },
    }) => ({
      employeeNames: initialState.employeeNames,
      errors: initialState.errors,
      taskList: initialState.taskList,
      activeTaskID: initialState.activeTaskID,
      activeEmployee: initialState.activeEmployee,
      activeComplexity: initialState.activeComplexity,
      stepCounter: initialState.stepCounter,
      testDates: initialState.testDates,
    }),
    {
      setStateFieldValue: (prevState) => (fieldName, value) => ({
        ...prevState,
        [fieldName]: value,
      }),
      setMainErrors: (prevState) => (arr) => ({ ...prevState, errors: arr }),
      // setFormStateField: prevState => (fieldName, value) => {
      //   const { formState } = prevState;
      //   const newFormState = { ...formState };
      //
      //   newFormState[fieldName] = value;
      //
      //   return { ...prevState, formState: newFormState };
      // },
      activeTaskIDToggler: (prevState) => (id) => {
        if (prevState.activeTaskID === id) {
          return { ...prevState, activeTaskID: 0 }
        }
        return { ...prevState, activeTaskID: id }
      },
      activeEmployeeToggler: (prevState) => (employee) => {
        if (prevState.activeEmployee === employee) {
          return { ...prevState, activeEmployee: '' }
        }
        return { ...prevState, activeEmployee: employee }
      },
      complexityToggler: (prevState) => (val = 0) => {
        if (prevState.activeComplexity === val) {
          return prevState
        }
        return { ...prevState, activeComplexity: val }
      },
      initStep: (prevState) => (val?: number) => {
        switch (val) {
          case 0:
          case 1:
          case 2: {
            return { ...prevState, stepCounter: val }
          }
          default: {
            const { stepCounter } = prevState
            let newStep

            if (stepCounter === 0) newStep = 1
            if (stepCounter === 1) newStep = 2
            if (stepCounter === 2) newStep = 0

            groupLog({
              spaceName: '- initStep',
              items: [
                `prev: ${stepCounter}`,
                `next: ${newStep}`
              ],
            })

            return { ...prevState, stepCounter: newStep }
          }
        }
      },
    },
  ),
  withHandlers({
    setFieldValueToLS: () => (fieldName: string, value: any) => ls.set(fieldName, JSON.stringify(value)),
    getFieldFromLS: () => (fieldName: string) => {
      if (!ls(fieldName)) {
        return Promise.reject(`${fieldName} not found in ls`)
      }
      const fieldFromLS = JSON.parse(ls.get(fieldName))

      groupLog({
        spaceName: `2. В ls есть key ${fieldName}`,
        items: [
          fieldFromLS,
          'Need to set to state...',
        ],
      })

      return Promise.resolve(fieldFromLS)
    },
  }),
  withHandlers({
    hasEmployeeInLS: (props: any) => async (name: string) => {
      return props
        .getFieldFromLS('employeeNames')
        .then((jsonFromLS: any) => {
          if (jsonFromLS && Array.isArray(jsonFromLS)) {
            return jsonFromLS.some((e) => e === name)
          }
          return false
        })
        .catch(() => false)
    },
  }),
  // @ts-ignore
  lifecycle({
    // @ts-ignore
    componentDidMount() {
      // @ts-ignore
      this.props
        .getFieldFromLS('employeeNames')
        .then((fieldFromLS: any) => {
          // @ts-ignore
          if (fieldFromLS) this.props.setStateFieldValue('employeeNames', fieldFromLS)
        })
        .then(() => {
          if (
            // @ts-ignore
            this.props.employeeNames &&
              // @ts-ignore
              Array.isArray(this.props.employeeNames) &&
              // @ts-ignore
              this.props.employeeNames.length > 0
          ) {
            const arr: any[] = []
            // @ts-ignore
            this.props.employeeNames.forEach((employee: string) => {
              const nowMS = new Date().getTime()// moment().valueOf()

              arr.push({
                [employee]: { startDate: nowMS, finishDate: nowMS },
              })
            })

            // console.log(arr);

            // @ts-ignore
            this.props.setStateFieldValue('testDates', arr)
          }
        })
        .catch((error: any) => console.log(error))

      // @ts-ignore
      this.props
        .getFieldFromLS('taskList')
        .then((fieldFromLS: any) => {
          // @ts-ignore
          if (!!fieldFromLS) this.props.setStateFieldValue('taskList', fieldFromLS)
        })
        .catch((error: any) => console.log(error))

      // EXPERIENCE

      // --- #1 ПРОИЗВОЛЬНАЯ СОРТИРОВКА МАССИВА
      const middleElement = 'middle' // Любое значение не совпадающее с "зарезервированными"
      const orderTemplate = [
        // Массив, задающий порядок элементов, вот это хардкод
        'STR5',
        'STR3',
        middleElement,
        '_last2',
        '_last1',
      ]
      const designerSort = (arr: any[]) => [...arr].sort((a, b) => {
        let a_index = orderTemplate.indexOf(a)
        if (a_index === -1) a_index = orderTemplate.indexOf(middleElement)

        let b_index = orderTemplate.indexOf(b)
        if (b_index === -1) b_index = orderTemplate.indexOf(middleElement)

        return a_index - b_index
      })

      // TST
      const tstArr = [
        'srt1',
        'str2',
        'STR3',
        'str4',
        '_last1',
        'STR5',
        '_last2',
        'str6',
      ]
      const sortedArr = designerSort(tstArr)

      // ---

      // --- #2
      function* iteratorGenerator(arr: any[]) {
        for (let i = 0; i < arr.length; i++) {
          yield arr[i]
        }
      }

      const topTemplate = ['STR5', 'STR3']
      const bottomTemplate = ['_last2', '_last1']

      const designerSort2 = (arr: any[]) => {
        const iterator = iteratorGenerator(arr)
        let currentItem = iterator.next()
        const resultTop = []
        const resultMiddle = []
        const resultBottom = []

        while (!currentItem.done) {
          // console.log(currentItem.value);
          if (topTemplate.includes(currentItem.value)) {
            resultTop.unshift(currentItem.value)
          } else if (bottomTemplate.includes(currentItem.value)) {
            resultBottom.push(currentItem.value)
          } else {
            resultMiddle.push(currentItem.value)
          }
          currentItem = iterator.next()
        }

        return [
          ...resultTop.sort(
            (e1, e2) => topTemplate.indexOf(e1) - topTemplate.indexOf(e2),
          ),
          ...resultMiddle,
          ...resultBottom.sort(
            (e1, e2) => bottomTemplate.indexOf(e1) - bottomTemplate.indexOf(e2),
          ),
        ]
      }

      const tstArr2 = [
        'srt1',
        'str2',
        'STR3',
        'str4',
        '_last1',
        'STR5',
        '_last2',
        'str6',
      ]
      const sortedArr2 = designerSort2(tstArr2)

      groupLog({ spaceName: 'ПРОИЗВОЛЬНАЯ СОРТИРОВКА МАССИВА', items: [
        'v1',
        'tstArr',
        tstArr,
        'orderTemplate',
        orderTemplate,
        'sortedArr',
        sortedArr,
        'v2',
        'tstArr2',
        tstArr2,
        'topTemplate',
        topTemplate,
        'bottomTemplate',
        bottomTemplate,
        'sortedArr2',
        sortedArr2,
      ]})
      // ---

      function fn(a: any) {
        // eslint-disable-next-line no-param-reassign
        a.b = '321'
        return a
      }
      const arg = { b: '123' }

      console.log(arg)
      fn(arg)
      console.log(arg)
    },
    componentDidUpdate() {
      // console.log('componentDidUpdate ()');
      // specialLog('componentDidUpdate ()\nthis.props.formState=', null, [this.props.formState]);
    },
  }),
  withHandlers({
    getProps: (props) => () => props,
  }),
  withHandlers({
    addNewEmployeeToLS: (props: any) => () => {
      // @ts-ignore
      swal
        .fire({
          title: 'Новый исполнитель',
          // text: 'Will be added to localStorage',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
          },
          inputValue: '',
          showCancelButton: true,
          confirmButtonText: 'Add',
          inputValidator: async (value) => {
            const isExists = await props.hasEmployeeInLS(value)

            console.log(isExists)

            if (!value) return 'You have to write something!'
            if (isExists) return `${value} Already exists in LS!`
            return false
          },
          confirmButtonColor: '#1b7bff',
          // footer: '<a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">How you can receive it</a>',
        })
        .then((result: any) => {
          if (!!result.value) {
            groupLog({ spaceName: 'addNewEmployeeToLS ()', items: [
              props,
              `New result.value= ${result.value || 'nothing'}`,
            ]})

            props
              .getFieldFromLS('employeeNames')
              .then((arr: any) => {
                const newArr = [...arr, result.value]

                props.setFieldValueToLS('employeeNames', newArr)
              })
              .then(() => {
                props
                  .getFieldFromLS('employeeNames')
                  .then((fieldFromLS: string) => props.setStateFieldValue('employeeNames', fieldFromLS))
                  .catch((error: any) => console.log(error))
              })
              .catch(() => {
                // console.log(error);

                swal.fire(
                  'Ok',
                  `${result.value} will be created as first employee.`,
                  'success',
                )

                props.setFieldValueToLS('employeeNames', [result.value])
                props.setStateFieldValue('employeeNames', [result.value])
              })

            return result.value
          }
          return null
        })
        .then(
          (name: string | null) => {
            if (!name) throw new Error('ERR: name required!')

            const testDates = [...props.testDates]
            const nowMS = new Date().getTime() // moment().valueOf()
            const newElm = { [name]: { startDate: nowMS, finishDate: nowMS } }

            props.setStateFieldValue('testDates', [...testDates, newElm])
          },
          (error) => groupLog({
            spaceName: `THROUBLES! New name should be added to props.testDates`,
            items: [error],
          }),
        )
        .catch((error) => groupLog({
          spaceName: `THROUBLES! New name could not be added to LS`,
          items: [
            error,
          ]
        }))
    },
    removeEmployeeFromLS: (props) => () => {
      props
        .getFieldFromLS('employeeNames')
        .then(
          async (arr: any) => {
            if (!arr || !Array.isArray(arr) || arr.length === 0) {
              // return toast.warn('No employees yet...', { autoClose: 7000 })
              return groupLog({
                spaceName: 'No employees yet',
                items: [
                  arr,
                ],
              })
            }

            const inputOptions = {}

            arr.forEach((e) => {
              // @ts-ignore
              inputOptions[e] = e
            })

            const { value: employee } = await swal.fire({
              title: 'Удалить исполнителя',
              // text: 'From localStorage',
              input: 'select',
              inputOptions,
              inputPlaceholder: 'Выберите из списка',
              showCancelButton: true,
              confirmButtonColor: '#1b7bff',
              footer: '⚠️ Вместе с его задачами',
            })

            return { employee, oldArr: arr }
          },
          (error: any) => groupLog({ spaceName: 'FAIL!', items: ['warn', error] }),
        )
        .then(({ employee, oldArr }: any) => {
          if (!employee) return false

          const newArr = [...oldArr].filter((e) => e !== employee)

          props.setFieldValueToLS('employeeNames', newArr)

          return { newArr, employee }
        })
        .then(({ newArr, employee }: any) => {
          if (newArr) props.setStateFieldValue('employeeNames', newArr)

          return employee
        })
        .then((employee: string) => {
          // And also we have to remove all task with this employee.
          props
            .getFieldFromLS('taskList')
            .then((taskListFromLS: any) => {
              if (!!taskListFromLS) {
                const newTaskList = taskListFromLS.filter(
                  (e: any) => e.employee !== employee,
                )

                props.setStateFieldValue('taskList', newTaskList)
                props.setFieldValueToLS('taskList', newTaskList)
              }
            })
            .catch((error: any) => groupLog({ spaceName: 'removeEmployeeFromLS () CRASHED!', items: ['warn', error] }))

          return employee
        })
        .then((employee: string) => {
          props.setStateFieldValue('testDates', [
            ...props.testDates.filter(
              (obj: any) => !Object.keys(obj).includes(employee),
            ),
          ])
        })
        .then(() => groupLog({ spaceName: 'RESULT of removeEmployeeFromLS ()\ngetProps ()', items: [
          props.getProps(),
        ]}))
        .then(() => props.activeEmployeeToggler(''))
        .catch((error: any) => console.log(error))
    },
    createNewTask: (props) => ({ cb }: { cb?: {
      onSuccess: (e: { isOk: boolean; message?: string; isFirst?: boolean }) => void;
      onError: (e: { isOk: boolean; message?: string; isFirst?: boolean }) => void;
    }}) => {
      props
        .getFieldFromLS('employeeNames')
        .then(async (arr: any) => {
          if (!arr || !Array.isArray(arr) || arr.length === 0) {
            // toast.warn('Please add first employee...', { autoClose: 7000 })
          }

          const inputOptions: any = {}

          arr.forEach((e: any) => {
            inputOptions[e] = e
          })

          swal
            .mixin({
              // input: 'textarea',
              allowOutsideClick: false,
              confirmButtonText: 'Next &rarr;',
              // confirmButtonColor: '#4558BB',
              confirmButtonColor: '#1b7bff',
              showCancelButton: true,
              progressSteps: ['1', '2', '3'],
              // @ts-ignore
              inputValidator: (value) => !value && 'You have to write something!',
            })
            .queue([
              {
                title: 'Description',
                text: 'For this task',
                input: 'textarea',
                inputValue: '',
                // @ts-ignore
                customClass: 'fullWidth',
              },
              {
                title: 'Select a employee',
                text: 'For this task',
                input: 'select',
                inputOptions,
                inputPlaceholder: 'Select a employee',
                showCancelButton: true,
              },
              {
                title: 'Complexity',
                text: 'From 1 to 5',
                icon: 'question',
                input: 'range',
                inputAttributes: {
                  min: '1',
                  max: '5',
                  step: '1',
                },
                inputValue: '1',
                // @ts-ignore
                customClass: 'fullWidth',
              },
            ])
            .then((result: any) => {
              console.log(result)
              if (
                !result ||
                  !result.value ||
                  !result.value[0]
                  // || !result.value[1]
              ) {
                throw new Error('FCKUP')
              }
              return result.value
            })
            .then((value) => {
              const id = new Date().getTime() // ms (number) =id
              const newTask: any = {
                id,
                description: value[0],
              }

              if (value[1]) newTask.employee = value[1]
              if (value[2]) newTask.complexity = Number(value[2])

              let newTaskList = []

              props
                .getFieldFromLS('taskList')
                .then((taskListFromLS: any) => {
                  if (taskListFromLS) {
                    newTaskList = [...taskListFromLS, newTask]
                    props.setStateFieldValue('taskList', newTaskList)
                    props.setFieldValueToLS('taskList', newTaskList)

                    const firstString = newTask.description.split('\n')[0]
                    const symbolsLimit = 10
                    if (!!cb) cb.onSuccess({ isOk: true, message: `Создано: ${firstString.substring(0, symbolsLimit)}${firstString.length > symbolsLimit ? '...' : ''}` })
                    return
                  }
                  // newTaskList = [newTask];
                  // props.setStateFieldValue('taskList', newTaskList);
                  // props.setFieldValueToLS('taskList', newTaskList);
                  groupLog({ spaceName: 'WTF', items: [
                    `taskListFromLS is ${
                      taskListFromLS || typeof taskListFromLS
                    }`,
                  ]})
                })
                .catch((error: any) => {
                  groupLog({ spaceName: 'WTF', items: [
                    error,
                    '[newTask] will be set to ls',
                  ]})
                  newTaskList = [newTask]
                  props.setStateFieldValue('taskList', newTaskList)
                  props.setFieldValueToLS('taskList', newTaskList)
                  if (!!cb) cb.onSuccess({ isOk: true, message: 'Ваша первая задача создана', isFirst: true })
                })
            })
            .catch((err) => {
              groupLog({ spaceName: 'createNewTask () FAILED', items: [err] })
              if (!!cb) cb.onError({ isOk: false, message: `#1 ${err?.message || 'No err.message'}` })
            })
        })
        .catch((err: any) => {
          if (!!cb) cb.onError({ isOk: false, message: `#2 ${err?.message || 'No err.message'}` })
        })
    },
    assign: (props) => (id: any) => {
      props
        .getFieldFromLS('employeeNames')
        .then(async (arr: any) => {
          const inputOptions: any = {}

          arr.forEach((e: any) => {
            inputOptions[e] = e
          })

          swal
            .mixin({
              allowOutsideClick: false,
              confirmButtonText: 'Next &rarr;',
              showCancelButton: true,
              progressSteps: ['1'],
              // @ts-ignore
              inputValidator: (value) => !value && 'You have to write something!',
              confirmButtonColor: '#1b7bff',
            })
            .queue([
              {
                title: 'Select an employee',
                input: 'select',
                inputOptions,
                inputPlaceholder: 'Select a employee',
                showCancelButton: true,
              },
            ])
            .then((result: any) => {
              console.log(result)
              if (!result.value[0]) {
                throw new Error('FCKUP')
              }
              return result.value[0]
            })
            .then((value) => {
              props
                .getFieldFromLS('taskList')
                .then((taskListFromLS: TTask[]) => {
                  if (taskListFromLS) {
                    const requiredTask = taskListFromLS.filter(
                      (task: TTask) => task.id === id,
                    )[0]
                    requiredTask.employee = value
                    const newTaskList = [
                      ...taskListFromLS.filter((task) => task.id !== id),
                      requiredTask,
                    ]
                    props.setStateFieldValue('taskList', newTaskList)
                    props.setFieldValueToLS('taskList', newTaskList)
                    // toast.info(`<strong>#${id}</strong> assigned to ${value}`, { autoClose: 7000 })
                    return
                  }
                  // newTaskList = [newTask];
                  // props.setStateFieldValue('taskList', newTaskList);
                  // props.setFieldValueToLS('taskList', newTaskList);
                  groupLog({ spaceName: 'WTF', items: [
                    `taskListFromLS is ${
                      taskListFromLS || typeof taskListFromLS
                    }`,
                  ]})
                })
              // .then(() => )
                .catch((error: any) => {
                  groupLog({ spaceName: 'WTF', items: [
                    error,
                    '[newTask] will be set to ls',
                  ]})
                  // newTaskList = [newTask];
                  // props.setStateFieldValue('taskList', newTaskList);
                  // props.setFieldValueToLS('taskList', newTaskList);
                })
            })
            .catch((error) => console.log(error))
        })
        .catch((error: any) => console.log(error))
    },
    setStartDate: (props) => (ts: number, id: number) => {
      // date is moment obj; date.valueOf() =ms (number)
      
      // console.log(date.valueOf(), id);

      groupLog({
        spaceName: 'setStartDate #1',
        items: [
          `ts: ${ts} (${typeof ts}); id: ${id} (${typeof id})`
        ],
      })

      props
        .getFieldFromLS('taskList')
        .then((taskListFromLS: TTask[]) => {
          groupLog({
            spaceName: 'setStartDate #2 | taskListFromLS',
            items: [
              taskListFromLS,
              `ids: ${taskListFromLS.map(({ id }) => id).join(', ')}`
            ],
          })

          const requiredTask = taskListFromLS.filter(
            (task: TTask) => task.id === id,
          )[0]

          groupLog({
            spaceName: 'setStartDate #3 | requiredTask',
            items: [
              requiredTask,
            ],
          })

          requiredTask.startDate = ts

          const newTaskList = [
            ...taskListFromLS.filter((task) => task.id !== id),
            requiredTask,
          ]

          props.setStateFieldValue('taskList', newTaskList)
          props.setFieldValueToLS('taskList', newTaskList)
        })
        .catch((error: any) => console.log(error))
    },
    setRealFinishDate: (props) => (ts: number | undefined, id: number) => {
      // date is moment obj; date.valueOf() =ms (number)
      // console.log(date.valueOf(), id);
      props
        .getFieldFromLS('taskList')
        .then((taskListFromLS: TTask[]) => {
          const requiredTask = taskListFromLS.filter(
            (task) => task.id === id,
          )[0]

          if (!ts) delete requiredTask.realFinishDate
          else requiredTask.realFinishDate = ts

          const newTaskList = [
            ...taskListFromLS.filter((task) => task.id !== id),
            requiredTask,
          ]

          props.setStateFieldValue('taskList', newTaskList)
          props.setFieldValueToLS('taskList', newTaskList)
        })
        .catch((error: any) => console.log(error))
    },
    setForecastFinishDate: (props) => (ts: number, id: number) => {
      // console.log(date.valueOf(), id);
      props
        .getFieldFromLS('taskList')
        .then((taskListFromLS: TTask[]) => {
          const requiredTask = taskListFromLS.filter(
            (task) => task.id === id,
          )[0]
          requiredTask.forecastFinishDate = ts

          const newTaskList = [
            ...taskListFromLS.filter((task) => task.id !== id),
            requiredTask,
          ]

          props.setStateFieldValue('taskList', newTaskList)
          props.setFieldValueToLS('taskList', newTaskList)
        })
        .catch((error: any) => console.log(error))
    },
    removeTaskFromLS: (props) => (id: any) => {
      // @ts-ignore
      swal
        .fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          // cancelButtonColor: '#3085d6',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
          // reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            props
              .getFieldFromLS('taskList')
              .then((taskListFromLS: TTask[]) => {
                props.setStateFieldValue('taskList', [
                  ...taskListFromLS.filter((task) => task.id !== id),
                ])
                props.setFieldValueToLS('taskList', [
                  ...taskListFromLS.filter((task) => task.id !== id),
                ])
              })
            // .then(() => {
            //   swal(
            //     'Deleted!',
            //     'Your file has been deleted.',
            //     'success'
            //   );
            // })
              .catch((error: any) => console.log(error))
          }
        })
    },
    editTask: (props) => (id: number, taskObj: TTask) => {
      swal
        .mixin({
          allowOutsideClick: false,
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,
          progressSteps: ['1', '2'],
          // @ts-ignore
          inputValidator: (value) => !value && 'You have to write something!',
          confirmButtonColor: '#1b7bff',
        })
        .queue([
          {
            title: 'Description',
            text: `#${id}`,
            input: 'textarea',
            inputAttributes: {
              // autocapitalize: 'off',
            },
            inputValue: taskObj.description,
            showCancelButton: true,
            // confirmButtonText: 'Edit',
            // customClass: 'fullWidth',
            // footer: '<a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">How you can receive it</a>',
          },
          {
            title: 'Complexity',
            text: 'From 1 to 5',
            icon: 'question',
            input: 'range',
            inputAttributes: { min: '1', max: '5', step: '1' },
            inputValue: String(taskObj.complexity) || '1',
            // customClass: 'fullWidth',
          },
        ])
        .then((result: any) => {
          if (!!result.value) {
            props
              .getFieldFromLS('taskList')
              .then((taskListFromLS: TTask[]) => {
                const requiredTask = taskListFromLS.find(
                  (task) => task.id === id,
                )
                if (!requiredTask) throw new Error('Task not found')

                console.log(requiredTask)

                requiredTask.description = result.value[0]
                requiredTask.complexity = Number(result.value[1])

                const newTaskList = [
                  ...taskListFromLS.filter((task) => task.id !== id),
                  requiredTask,
                ]

                return newTaskList
              })
              .then((newTaskList: TTask[]) => {
                props.setStateFieldValue('taskList', newTaskList)
                props.setFieldValueToLS('taskList', newTaskList)
              })
              .catch((error: any) => console.log(error))
          }
        })
        .catch((error) => console.log(error))
    },
    setTestDate: (props) => (dateType: any, date: any, employee: string) => {
      // console.log(date)
      const obj = props.testDates.filter((e: any) => Object.keys(e).includes(employee))[0]

      switch (dateType) {
        case 'startDate':
        case 'finishDate':
          // console.log(obj[employee]); // { startDate, finishDate }
          obj[employee] = { ...obj[employee], [dateType]: date }
          break
        default:
          console.log(`NOT FOR ${dateType}`)
      }

      props.setStateFieldValue('testDates', [
        ...props.testDates.filter((e: any) => !Object.keys(e).includes(employee)),
        obj,
      ])
    },
  }),
)((props) => <ComposedComponent {...props} />)
