import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import brainReducer from './slices/bainSlice';
import devReducer from './slices/devSlice';
import writingReducer from './slices/writingSlice';
import { officeReducer, meetingsReducer, workflowReducer } from './slices/moduleSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        brain: brainReducer,
        dev: devReducer,
        writing: writingReducer,
        office: officeReducer,
        meetings: meetingsReducer,
        workflow: workflowReducer,
    }
});