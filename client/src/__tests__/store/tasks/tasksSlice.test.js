import reducer, {
    setInputTask,
    setIsInputInvalid,
    setModalActive,
    closeModal,
    setDeadline,
    openConfirmModal,
    closeConfirmModal,
    markDamageTaken,
    clearTasksState,
} from "../../../store/tasks/tasksSlice";

import {
    fetchTasks,
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
} from "../../../store/tasks/tasksThunks";

const initialState = {
    tasks: [],
    inputTask: "",
    isInputInvalid: false,
    modalActive: false,
    deadline: "",
    confirmModal: {
        isOpen: false,
        actionType: null,
        taskId: null,
        taskText: "",
    },
};

describe("tasksSlice", () => {
    it("should return initial state", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it("should handle setInputTask", () => {
        const state = reducer(initialState, setInputTask("Do homework"));

        expect(state.inputTask).toBe("Do homework");
    });

    it("should handle setIsInputInvalid", () => {
        const state = reducer(initialState, setIsInputInvalid(true));

        expect(state.isInputInvalid).toBe(true);
    });

    it("should handle setModalActive", () => {
        const state = reducer(initialState, setModalActive(true));

        expect(state.modalActive).toBe(true);
    });

    it("should handle closeModal", () => {
        const state = reducer(
            {
                ...initialState,
                inputTask: "Temp",
                deadline: "2025-08-01",
                modalActive: true,
            },
            closeModal()
        );
        expect(state).toEqual(initialState);
    });

    it("should handle setDeadline", () => {
        const state = reducer(initialState, setDeadline("2025-07-30"));

        expect(state.deadline).toBe("2025-07-30");
    });

    it("should handle openConfirmModal", () => {
        const payload = {
            actionType: "delete",
            taskId: "abc123",
            taskText: "Test task",
        };
        const state = reducer(initialState, openConfirmModal(payload));

        expect(state.confirmModal).toEqual({
            isOpen: true,
            ...payload,
        });
    });

    it("should handle closeConfirmModal", () => {
        const preState = {
            ...initialState,
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskId: "1",
                taskText: "abc",
            },
        };
        const state = reducer(preState, closeConfirmModal());

        expect(state.confirmModal).toEqual(initialState.confirmModal);
    });

    it("should handle markDamageTaken", () => {
        const task = { _id: "1", text: "test", damageTaken: false };
        const preState = {
            ...initialState,
            tasks: [task],
        };

        const state = reducer(preState, markDamageTaken("1"));

        expect(state.tasks[0].damageTaken).toBe(true);
    });

    it("should handle clearTasksState", () => {
        const preState = {
            ...initialState,
            inputTask: "dirty",
            modalActive: true,
        };
        const state = reducer(preState, clearTasksState());

        expect(state).toEqual(initialState);
    });

    it("should handle fetchTasks.fulfilled", () => {
        const mockTasks = [{ _id: "1", text: "A" }];
        const state = reducer(initialState, {
            type: fetchTasks.fulfilled.type,
            payload: mockTasks,
        });

        expect(state.tasks).toEqual(mockTasks);
        expect(state.loading).toBe(false);
    });

    it("should handle addTaskAsync.fulfilled", () => {
        const newTask = { _id: "2", text: "New" };
        const preState = {
            ...initialState,
            tasks: [{ _id: "1", text: "Old" }],
        };

        const state = reducer(preState, {
            type: addTaskAsync.fulfilled.type,
            payload: newTask,
        });

        expect(state.tasks).toHaveLength(2);
        expect(state.tasks[1]).toEqual(newTask);
        expect(state.inputTask).toBe("");
        expect(state.deadline).toBe("");
        expect(state.modalActive).toBe(false);
    });

    it("should handle deleteTaskAsync.fulfilled", () => {
        const task1 = { _id: "1", text: "Test" };
        const task2 = { _id: "2", text: "Keep" };
        const preState = {
            ...initialState,
            tasks: [task1, task2],
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskId: "1",
                taskText: "Test",
            },
        };

        const state = reducer(preState, {
            type: deleteTaskAsync.fulfilled.type,
            payload: "1",
        });

        expect(state.tasks).toEqual([task2]);
        expect(state.confirmModal).toEqual(initialState.confirmModal);
    });

    it("should handle completeTaskAsync.fulfilled", () => {
        const task1 = { _id: "1", text: "Old", completed: false };
        const updated = { _id: "1", text: "Old", completed: true };

        const preState = {
            ...initialState,
            tasks: [task1],
            confirmModal: {
                isOpen: true,
                actionType: "complete",
                taskId: "1",
                taskText: "Old",
            },
        };

        const state = reducer(preState, {
            type: completeTaskAsync.fulfilled.type,
            payload: updated,
        });

        expect(state.tasks[0].completed).toBe(true);
        expect(state.confirmModal).toEqual(initialState.confirmModal);
    });
});
