const redux = require('redux');
const createStore = redux.createStore;
const thunkMiddleware = require('redux-thunk').default;
const axios = require('axios');
const applyMiddleware = redux.applyMiddleware;

const initialState = {
  loading: false,
  users: [],
  error: '',
};

const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';

const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUserError = (error) => {
  return {
    type: FETCH_USERS_ERROR,
    error: error,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        error: '',
      };

    case FETCH_USERS_ERROR:
      return {
        ...state,
        users: [],
        error: action.payload,
      };
  }
};

const fetchUsers = () => (dispatch) => {
  dispatch(fetchUserRequest());
  axios
    .get('https://jsonplaceholder.typicode.com/users')
    .then((response) => {
      const users = response.data.map((user) => user.name);
      dispatch(fetchUserSuccess(users));
    })
    .catch((error) => {
      dispatch(fetchUserError(error.message));
    });
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
store.subscribe(() => console.log(store.getState()));
store.dispatch(fetchUsers());
