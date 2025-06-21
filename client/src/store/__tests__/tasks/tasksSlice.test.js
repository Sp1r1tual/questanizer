import tasksReducer, {
    setInputTask,
    setModalActive,
    addTask,
    closeModal,
    deleteTask,
    completeTask,
    setDeadline,
    openConfirmModal,
    closeConfirmModal,
    markDamageTaken,
} from "../../tasks/tasksSlice";

const MOCK_UUID = "mock-uuid-123";
global.crypto = {
    randomUUID: jest.fn(() => MOCK_UUID),
};

describe("tasksSlice", () => {
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

    beforeEach(() => {
        global.crypto.randomUUID.mockClear();
        global.crypto.randomUUID.mockReturnValue(MOCK_UUID);
        jest.spyOn(global, "Date").mockImplementation(() => ({
            toLocaleString: () => "1/1/2025, 12:00:00 AM",
        }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("must return the initial state when an undefined state is passed", () => {
        expect(tasksReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(
            initialState
        );
    });

    it("setInputTask should update inputTask and set isInputInvalid to false for valid input", () => {
        const payload = "New task text";
        const expectedState = {
            ...initialState,
            inputTask: payload,
            isInputInvalid: false,
        };

        expect(tasksReducer(initialState, setInputTask(payload))).toEqual(
            expectedState
        );
    });

    it("setInputTask should update inputTask and set isInputInvalid to true for empty input", () => {
        const payload = "";
        const expectedState = {
            ...initialState,
            inputTask: payload,
            isInputInvalid: true,
        };

        expect(tasksReducer(initialState, setInputTask(payload))).toEqual(
            expectedState
        );
    });

    it("setInputTask should update inputTask and set isInputInvalid to true for space-only input", () => {
        const payload = "   ";
        const expectedState = {
            ...initialState,
            inputTask: payload,
            isInputInvalid: true,
        };

        expect(tasksReducer(initialState, setInputTask(payload))).toEqual(
            expectedState
        );
    });

    it("setModalActive should set modalActive to true", () => {
        const expectedState = { ...initialState, modalActive: true };
        expect(tasksReducer(initialState, setModalActive(true))).toEqual(
            expectedState
        );
    });

    it("setModalActive should set modalActive to false", () => {
        const currentState = { ...initialState, modalActive: true };
        const expectedState = { ...initialState, modalActive: false };

        expect(tasksReducer(currentState, setModalActive(false))).toEqual(
            expectedState
        );
    });

    it("addTask should add a new task without a deadline", () => {
        const currentState = {
            ...initialState,
            inputTask: "Learn Redux Toolkit",
            modalActive: true,
        };
        const expectedTask = {
            id: MOCK_UUID,
            text: "Learn Redux Toolkit",
            createdAt: "1/1/2025, 12:00:00 AM",
            isCompleted: false,
            deadline: null,
            difficulty: null,
            damageTaken: false,
        };
        const expectedState = {
            ...initialState,
            tasks: [expectedTask],
            inputTask: "",
            deadline: "",
            modalActive: false,
        };

        expect(
            tasksReducer(
                currentState,
                addTask({ hasDeadline: false, difficulty: null })
            )
        ).toEqual(expectedState);
        expect(global.crypto.randomUUID).toHaveBeenCalledTimes(1);
    });

    it("addTask should add a new task with a deadline and difficulty", () => {
        const currentState = {
            ...initialState,
            inputTask: "Finish project",
            modalActive: true,
            deadline: "2025-12-31",
        };
        const expectedTask = {
            id: MOCK_UUID,
            text: "Finish project",
            createdAt: "1/1/2025, 12:00:00 AM",
            isCompleted: false,
            deadline: "2025-12-31",
            difficulty: "hard",
            damageTaken: false,
        };
        const expectedState = {
            ...initialState,
            tasks: [expectedTask],
            inputTask: "",
            deadline: "",
            modalActive: false,
        };

        expect(
            tasksReducer(
                currentState,
                addTask({ hasDeadline: true, difficulty: "hard" })
            )
        ).toEqual(expectedState);
    });

    it("addTask should not add a task if hasDeadline is true but deadline is empty", () => {
        const currentState = {
            ...initialState,
            inputTask: "Task with empty deadline",
            modalActive: true,
            deadline: "",
        };

        expect(
            tasksReducer(
                currentState,
                addTask({ hasDeadline: true, difficulty: null })
            )
        ).toEqual(currentState);
        expect(currentState.tasks).toHaveLength(0);
    });

    it("closeModal should reset inputTask, deadline and modalActive", () => {
        const currentState = {
            ...initialState,
            inputTask: "Some input",
            modalActive: true,
            deadline: "2025-01-01",
        };

        expect(tasksReducer(currentState, closeModal())).toEqual(initialState);
    });

    it("deleteTask should delete the task by ID and close confirmModal", () => {
        const taskIdToDelete = "task-id-1";
        const taskToKeep = {
            ...initialState.tasks[0],
            id: "task-id-2",
            text: "Task 2",
        };
        const currentState = {
            ...initialState,
            tasks: [
                {
                    ...initialState.tasks[0],
                    id: taskIdToDelete,
                    text: "Task 1",
                },
                taskToKeep,
            ],
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskId: taskIdToDelete,
                taskText: "Task 1",
            },
        };
        const expectedState = {
            ...initialState,
            tasks: [taskToKeep],
            confirmModal: {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            },
        };

        expect(tasksReducer(currentState, deleteTask(taskIdToDelete))).toEqual(
            expectedState
        );
    });

    it("completeTask should change isCompleted to true", () => {
        const taskIdToComplete = "task-id-1";
        const taskToChange = {
            id: taskIdToComplete,
            text: "Task to complete",
            isCompleted: false,
        };
        const currentState = {
            ...initialState,
            tasks: [taskToChange],
            confirmModal: {
                isOpen: true,
                actionType: "complete",
                taskId: taskIdToComplete,
                taskText: "Task to complete",
            },
        };
        const expectedState = {
            ...initialState,
            tasks: [{ ...taskToChange, isCompleted: true }],
            confirmModal: {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            },
        };

        expect(
            tasksReducer(currentState, completeTask(taskIdToComplete))
        ).toEqual(expectedState);
    });

    it("completeTask should change isCompleted to false if already completed", () => {
        const taskIdToComplete = "task-id-1";
        const taskToChange = {
            id: taskIdToComplete,
            text: "Task to uncomplete",
            isCompleted: true,
        };
        const currentState = {
            ...initialState,
            tasks: [taskToChange],
            confirmModal: {
                isOpen: true,
                actionType: "complete",
                taskId: taskIdToComplete,
                taskText: "Task to uncomplete",
            },
        };
        const expectedState = {
            ...initialState,
            tasks: [{ ...taskToChange, isCompleted: false }],
            confirmModal: {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            },
        };

        expect(
            tasksReducer(currentState, completeTask(taskIdToComplete))
        ).toEqual(expectedState);
    });

    it("setDeadline should set the deadline value", () => {
        const newDeadline = "2026-06-30";
        const expectedState = { ...initialState, deadline: newDeadline };

        expect(tasksReducer(initialState, setDeadline(newDeadline))).toEqual(
            expectedState
        );
    });

    it("openConfirmModal should open confirmModal with correct data", () => {
        const payload = {
            actionType: "delete",
            taskId: "task-id-to-confirm",
            taskText: "Task to be deleted",
        };
        const expectedState = {
            ...initialState,
            confirmModal: { ...payload, isOpen: true },
        };

        expect(tasksReducer(initialState, openConfirmModal(payload))).toEqual(
            expectedState
        );
    });

    it("closeConfirmModal should close confirmModal and reset its data", () => {
        const currentState = {
            ...initialState,
            confirmModal: {
                isOpen: true,
                actionType: "delete",
                taskId: "some-id",
                taskText: "Some task",
            },
        };

        expect(tasksReducer(currentState, closeConfirmModal())).toEqual(
            initialState
        );
    });

    it("markDamageTaken should set damageTaken to true for the corresponding task", () => {
        const taskIdToMark = "task-id-dmg";
        const taskToChange = {
            id: taskIdToMark,
            text: "Overdue task",
            damageTaken: false,
        };
        const currentState = { ...initialState, tasks: [taskToChange] };
        const expectedState = {
            ...initialState,
            tasks: [{ ...taskToChange, damageTaken: true }],
        };

        expect(
            tasksReducer(currentState, markDamageTaken(taskIdToMark))
        ).toEqual(expectedState);
    });

    it("markDamageTaken should not change state if task not found", () => {
        const taskIdToMark = "non-existent-id";
        const taskToChange = {
            id: "existing-id",
            text: "Existing task",
            damageTaken: false,
        };
        const currentState = { ...initialState, tasks: [taskToChange] };

        expect(
            tasksReducer(currentState, markDamageTaken(taskIdToMark))
        ).toEqual(currentState);
    });
});
