// @flow

import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  feedRequest: ['nextPageUrl', 'searchText', 'category', 'position'],
  feedSuccess: ['nextPageUrl', 'items'],
  feedFailure: ['error'],
  feedClear: null,
  geolocationRequested: null,
  feedUpdateSearch: ['searchText'],
  feedCancelSearch: null
})

export const FeedTypes = Types
export default Creators

const STATUS_INITIAL = 0
const STATUS_REQUESTED_LOCALIZATION = 1
const STATUS_REQUESTED_FEED = 2
const STATUS_FEED_RETRIEVED = 3

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  items: {},
  fetching: null,
  error: null,
  nextPageUrl: null,
  searchText: null,
  category: null,
  paramsUpdated: false,
  requestStatus: STATUS_INITIAL
})

/* ------------- Reducers ------------- */

// request the feed with a given url.
export const request = (state: Object, { nextPageUrl }: Object) => {
  if (nextPageUrl === 'LastPage') {
    return Object.assign({}, state, { fetching: false })
  }
  return Object.assign({}, state,
    {
      fetching: true,
      nextPageUrl,
      requestStatus: STATUS_REQUESTED_FEED,
      paramsUpdated: false
    })
}

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

  return Object.assign({}, state,
    {
      fetching: false,
      error: null,
      items: allItems,
      nextPageUrl: nextUrl,
      requestStatus: STATUS_FEED_RETRIEVED,
      paramsUpdated: false
    })
}

// failed to get the user
export const failure = (state: Object, action) => {
  const { error } = action
  return Object.assign({}, state, {
    fetching: false,
    error: error,
    nextPageUrl: null,
    requestStatus: STATUS_FEED_RETRIEVED,
    paramsUpdated: false
  })
}

export const clear = (state: Object) => {
  var newState = Object.assign({}, state,
    {
      fetching: false,
      items: {},
      nextPageUrl: null,
      requestStatus: STATUS_INITIAL
    })
  return newState
}

export const updateSearch = (state: Object, action: Object) => {
  const { searchText } = action
  return Object.assign({}, state, {searchText: searchText, paramsUpdated: true})
}

export const cancelSearch = (state: Object) => {
  return Object.assign({}, state, {searchText: null, paramsUpdated: true})
}

export const geolocationRequested = (state: Object) =>
  Object.assign({}, state, {
    requestStatus: STATUS_REQUESTED_LOCALIZATION,
    paramsUpdated: false
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FEED_CLEAR]: clear,
  [Types.FEED_REQUEST]: request,
  [Types.FEED_SUCCESS]: success,
  [Types.FEED_FAILURE]: failure,
  [Types.FEED_UPDATE_SEARCH]: updateSearch,
  [Types.FEED_CANCEL_SEARCH]: cancelSearch,
  [Types.GEOLOCATION_REQUESTED]: geolocationRequested
})
