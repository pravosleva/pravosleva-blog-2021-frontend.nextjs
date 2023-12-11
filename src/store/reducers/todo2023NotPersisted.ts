import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { NTodo } from '~/components/audit-helper'

export type TState = {
  strapiTodos: NTodo.TTodo[];
  strapiTodosMeta: NTodo.TMeta;
}
export const initialState: TState = {
  strapiTodos: [],
  strapiTodosMeta: null,
}

export const todo2023NotPersistedSlice: any = createSlice({
  name: 'todo2023NotPersisted',
  initialState,
  reducers: {
    // NOTE: v2 (todo strapi)
    addStrapiTodo: (state: TState, action: { payload: NTodo.TTodo; }) => {
      try {
        state.strapiTodos.push(action.payload)
      } catch (err) {
        state.strapiTodos = [action.payload]
      }
    },
    removeStrapiTodo: (state: TState, action: { payload: number; }) => {
      try {
        state.strapiTodos = state.strapiTodos.filter(({ id }) => id !== action.payload)
      } catch (err) {
        state.strapiTodos = []
      }
    },
    updateStrapiTodo: (state: TState, action: { payload: NTodo.TTodo; }) => {
      try {
        const targetIndex = state.strapiTodos.findIndex(({ id }) => id === action.payload.id)

        if (targetIndex === -1) {
          // throw new Error(`Нет такого id: ${action.payload.id}`)
          state.strapiTodos.push(action.payload)
        } else {
          state.strapiTodos[targetIndex] = action.payload
        }
      } catch (err) {
        console.warn(err)
        state.strapiTodos = [action.payload]
      }
    },
    replaceStrapiTodos: (state: TState, action: { payload: NTodo.TTodo[]; }) => {
      state.strapiTodos = action.payload
    },
    updateStrapiTodosAndMeta: (
      state: TState,
      action: {
        payload: {
          meta: NTodo.TMeta;
          list: NTodo.TTodo[];
        };
      }
    ) => {
      state.strapiTodos = action.payload.list
      state.strapiTodosMeta = action.payload.meta
    },
    updateStrapiTodosMeta: (
      state: TState,
      action: {
        payload: NTodo.TMeta;
      }
    ) => {
      state.strapiTodosMeta = action.payload
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.todo2023NotPersisted,
      };
    },
  },
})

export const {
  addStrapiTodo,
  removeStrapiTodo,
  updateStrapiTodo,
  replaceStrapiTodos,
  updateStrapiTodosAndMeta,
  updateStrapiTodosMeta,
} = todo2023NotPersistedSlice.actions

export const reducer = todo2023NotPersistedSlice.reducer
