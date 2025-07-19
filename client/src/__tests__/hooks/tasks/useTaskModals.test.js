import { useDispatch, useSelector } from "react-redux";
import useTaskModals from "../../../hooks/tasks/useTaskModals";

import { renderHook, act } from "@testing-library/react";
import {
    setModalActive,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    setIsInputInvalid,
} from "../../../store/tasks/tasksSlice";

jest.mock("react-redux");
jest.mock("../../../store/tasks/tasksSlice", () => ({
    setModalActive: jest.fn((payload) => ({ type: "setModalActive", payload })),
    closeModal: jest.fn(() => ({ type: "closeModal" })),
    openConfirmModal: jest.fn((payload) => ({
        type: "openConfirmModal",
        payload,
    })),
    closeConfirmModal: jest.fn(() => ({ type: "closeConfirmModal" })),
    setIsInputInvalid: jest.fn((payload) => ({
        type: "setIsInputInvalid",
        payload,
    })),
}));

describe("useTaskModals", () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(dispatchMock);
    });

    it("onOpenModal dispatches setIsInputInvalid(true) if inputTask is empty or whitespace", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "   ",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onOpenModal();
        });

        expect(dispatchMock).toHaveBeenCalledWith(setIsInputInvalid(true));
        expect(dispatchMock).not.toHaveBeenCalledWith(setModalActive(true));
    });

    it("onOpenModal dispatches setIsInputInvalid(false) and setModalActive(true) if inputTask has text", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: " Task ",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onOpenModal();
        });

        expect(dispatchMock).toHaveBeenCalledWith(setIsInputInvalid(false));
        expect(dispatchMock).toHaveBeenCalledWith(setModalActive(true));
    });

    it("onCloseModal dispatches closeModal", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onCloseModal();
        });

        expect(dispatchMock).toHaveBeenCalledWith(closeModal());
    });

    it("onOpenConfirmModal dispatches openConfirmModal with correct payload", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onOpenConfirmModal("delete", 123, "Task text");
        });

        expect(dispatchMock).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "delete",
                taskId: 123,
                taskText: "Task text",
            })
        );
    });

    it("onOpenGroupDeleteConfirmModal dispatches openConfirmModal with null taskId and empty taskText", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onOpenGroupDeleteConfirmModal("group-delete");
        });

        expect(dispatchMock).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "group-delete",
                taskId: null,
                taskText: "",
            })
        );
    });

    it("onCloseConfirmModal dispatches closeConfirmModal", () => {
        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "",
                    modalActive: false,
                    confirmModal: {},
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        act(() => {
            result.current.onCloseConfirmModal();
        });

        expect(dispatchMock).toHaveBeenCalledWith(closeConfirmModal());
    });

    it("returns modalActive and confirmModal from state", () => {
        const modalActive = true;
        const confirmModal = { isOpen: true, actionType: "delete" };

        useSelector.mockImplementation((selector) =>
            selector({
                tasks: {
                    inputTask: "test",
                    modalActive,
                    confirmModal,
                },
            })
        );

        const { result } = renderHook(() => useTaskModals());

        expect(result.current.modalActive).toBe(modalActive);
        expect(result.current.confirmModal).toBe(confirmModal);
    });
});
