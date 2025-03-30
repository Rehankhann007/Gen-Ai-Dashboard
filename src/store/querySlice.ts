
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the query state
interface QueryResult {
  id: string;
  data: any;
  chartType: 'bar' | 'line' | 'pie' | 'area';
}

export interface QueryState {
  currentQuery: string;
  isLoading: boolean;
  error: string | null;
  queryHistory: string[];
  results: QueryResult[];
}

const initialState: QueryState = {
  currentQuery: '',
  isLoading: false,
  error: null,
  queryHistory: [],
  results: [],
};

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    submitQuery: (state) => {
      state.isLoading = true;
      state.error = null;
      if (state.currentQuery.trim() !== '') {
        state.queryHistory = [state.currentQuery, ...state.queryHistory];
      }
    },
    querySuccess: (state, action: PayloadAction<QueryResult>) => {
      state.isLoading = false;
      state.results = [action.payload, ...state.results];
      state.currentQuery = '';
    },
    queryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCurrentQuery, submitQuery, querySuccess, queryFailure, clearError } = querySlice.actions;

export default querySlice.reducer;
