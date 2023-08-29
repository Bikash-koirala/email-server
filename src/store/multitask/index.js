import { createSlice } from "@reduxjs/toolkit";
import { REPLY_MODE } from "../../constants";
import { truncateString } from "../../utils/truncate";
import { uuid } from "../../utils/uuid";

export const multiTaskState = {
  tasks: [],
  isEmailOpened: false,
  currentTask: 'primaryEmailBoard'
};

export const multiTaskSlice = createSlice({
  name: "multiTask",
  initialState: multiTaskState,
  reducers: {
    /**
     * @description Action to add the new task
     * @param {*} state: Multi task State
     * @returns void
     * @argument:  { taskId: string, taskHeading:string, mailId: string, taskMode: Reply | Forward | noAction}
     */
    addMultiTask : (state, action) => {
      if(state.tasks.length >= 5) return;
      const {taskId = '', taskHeading = '', mailId = '', taskMode = REPLY_MODE.noAction} = action.payload || {};
      if(!!taskId && state.tasks.some(mt => mt.taskId === taskId)) return;
      const id = taskId || uuid();
      state.tasks = [...state.tasks, {taskId:id, taskHeading, mailId, taskMode}];
      state.currentTask= id
    },
    updateMultiTaskHeading: (state, action) => {
      const {taskId, taskHeading} = action.payload;
      state.tasks = [...state.tasks]?.map(mt => {
        if(mt.taskId === taskId) {
          return {
            ...mt,
            taskHeading: truncateString(taskHeading)
          }
        }
        return mt;
      })
    },
    removeCurrentTask: (state, action) => {
      const taskId = action.payload;
      state.tasks = [...state.tasks].filter(mt => mt.taskId !== taskId)
    },
    updateCurrentTaskMode: (state, action) => {
      state.isEmailOpened = action.payload === 'primaryEmailBoard'
    },
    updateCurrentTask: (state, action) => {
      const id = action.payload;
      state.currentTask = id;
    }
  }
});

//export actions
export const { addMultiTask, updateMultiTaskHeading, removeCurrentTask, updateCurrentTaskMode, updateCurrentTask } = multiTaskSlice.actions;

export default multiTaskSlice.reducer;
