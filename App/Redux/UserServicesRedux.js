// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userServicesRequest: ['nextPageUrl', 'userUuid'],
  userServicesSuccess: ['nextPageUrl', 'userUuid', 'items'],
  userServicesFailure: null,
  userServicesClear: null
})

export const UserServicesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  items: {},
  fetching: null,
  error: null,
  nextPageUrl: null
})

/* ------------- Reducers ------------- */

// request the User Services with a given url.
export const request = (state: Object, { nextPageUrl, userUuid }: Object) => {
  if (nextPageUrl === 'LastPage') {
    return Object.assign({}, state, { fetching: false })
  }
  return Object.assign({}, state, {fetching: true, items: {}, nextPageUrl})
}//

// successful user lookup
export const success = (state: Object, action: Object) => {
  const { items } = action

  var nextUrl = null
  var newItems = {}
  var allItems
  if ('nextPageUrl' in action) {
    if ((action.nextPageUrl) && ('next' in action.nextPageUrl)) {
      nextUrl = action.nextPageUrl.next.url
    } else {
      // Everything went right, but no next field: Last Page
      nextUrl = 'LastPage'
    }
  }

  if ((action.nextPageUrl == null) || (action.nextPageUrl.next == null)) {
    nextUrl = null
  } else {
    nextUrl = action.nextPageUrl.next.url
  }
  for (var id in items) {
    newItems[items[id]['uuid']] = items[id]
  }
  allItems = Object.assign({}, state.items, newItems)

  return Object.assign({}, state, { fetching: false, error: null, items: allItems, nextPageUrl: nextUrl })
}

// failed to get the user
export const failure = (state: Object) =>
  Object.assign({}, state, { fetching: false, error: true, nextPageUrl: null })

export const clear = (state: Object) => {
  var newState = Object.assign({}, state, { fetching: false, items: {}, nextPageUrl: null })
  return newState
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_SERVICES_CLEAR]: clear,
  [Types.USER_SERVICES_REQUEST]: request,
  [Types.USER_SERVICES_SUCCESS]: success,
  [Types.USER_SERVICES_FAILURE]: failure
})
