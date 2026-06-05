// store.js — Simple State Management (Redux-like)

// ─── Action Types ─────────────────────────────────────────────────────────────
export const ACTIONS = {
  SET_USER:            'SET_USER',
  CLEAR_USER:          'CLEAR_USER',
  SET_THEME:           'SET_THEME',
  ADD_POST:            'ADD_POST',
  REMOVE_POST:         'REMOVE_POST',
  SET_POSTS:           'SET_POSTS',
  SET_LOADING:         'SET_LOADING',
  SET_ERROR:           'SET_ERROR',
  CLEAR_ERROR:         'CLEAR_ERROR',
  ADD_NOTIFICATION:    'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
};

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  user:          null,
  theme:         'light',
  posts:         [],
  loading:       false,
  error:         null,
  notifications: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.CLEAR_USER:
      return { ...state, user: null };
    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };
    case ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload };
    case ACTIONS.ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] };
    case ACTIONS.REMOVE_POST:
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTIONS.ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, action.payload] };
    case ACTIONS.REMOVE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    default:
      return state;
  }
};

// ─── Store ────────────────────────────────────────────────────────────────────
const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => ({ ...state }),

    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(fn => fn(state));
      console.log(`[Store] ${action.type}`, action.payload ?? '');
    },

    subscribe: (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn); // unsubscribe
    },
  };
};

export const store = createStore(reducer, initialState);

// ─── Action Creators ──────────────────────────────────────────────────────────
export const actions = {
  setUser:            (user)   => store.dispatch({ type: ACTIONS.SET_USER, payload: user }),
  clearUser:          ()       => store.dispatch({ type: ACTIONS.CLEAR_USER }),
  setTheme:           (theme)  => store.dispatch({ type: ACTIONS.SET_THEME, payload: theme }),
  setPosts:           (posts)  => store.dispatch({ type: ACTIONS.SET_POSTS, payload: posts }),
  addPost:            (post)   => store.dispatch({ type: ACTIONS.ADD_POST, payload: post }),
  removePost:         (id)     => store.dispatch({ type: ACTIONS.REMOVE_POST, payload: id }),
  setLoading:         (val)    => store.dispatch({ type: ACTIONS.SET_LOADING, payload: val }),
  setError:           (err)    => store.dispatch({ type: ACTIONS.SET_ERROR, payload: err }),
  clearError:         ()       => store.dispatch({ type: ACTIONS.CLEAR_ERROR }),
  addNotification:    (notif)  => store.dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: notif }),
  removeNotification: (id)     => store.dispatch({ type: ACTIONS.REMOVE_NOTIFICATION, payload: id }),
};

export default store;
