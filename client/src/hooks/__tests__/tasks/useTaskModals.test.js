import { useTaskModals } from "../../tasks/useTaskModals";

import {
    setInputTask,
    setModalActive,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
} from "../../../store/tasks/tasksSlice";

describe("useTaskModals", () => {
    const dispatch = jest.fn();

    it("opens a modal if input is not empty", () => {
        const { onOpenModal } = useTaskModals({ inputTask: "task", dispatch });
        onOpenModal();
        expect(dispatch).toHaveBeenCalledWith(setModalActive(true));
    });

    it("does not open the modal if the input is empty - but updates it", () => {
        const { onOpenModal } = useTaskModals({ inputTask: "   ", dispatch });
        onOpenModal();
        expect(dispatch).toHaveBeenCalledWith(setInputTask("   "));
    });

    it("closes the modal", () => {
        const { onCloseModal } = useTaskModals({ inputTask: "", dispatch });
        onCloseModal();
        expect(dispatch).toHaveBeenCalledWith(closeModal());
    });

    it("opens the confirm modal", () => {
        const { onOpenConfirmModal } = useTaskModals({
            inputTask: "",
            dispatch,
        });
        onOpenConfirmModal("delete", "1", "Text");
        expect(dispatch).toHaveBeenCalledWith(
            openConfirmModal({
                actionType: "delete",
                taskId: "1",
                taskText: "Text",
            })
        );
    });

    it("closes the confirm modal", () => {
        const { onCloseConfirmModal } = useTaskModals({
            inputTask: "",
            dispatch,
        });
        onCloseConfirmModal();
        expect(dispatch).toHaveBeenCalledWith(closeConfirmModal());
    });

    it("changes the input value", () => {
        const { onInputChange } = useTaskModals({ inputTask: "", dispatch });
        onInputChange("New value");
        expect(dispatch).toHaveBeenCalledWith(setInputTask("New value"));
    });
});
