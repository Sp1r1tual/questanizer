import { useState } from "react";
import isDateValid from "../../utils/validation/isDateValid";

const useTaskModalState = ({
    initialDeadline,
    setDeadline,
    onSubmit,
    onClose,
}) => {
    const [isDateInvalid, setIsDateInvalid] = useState(false);
    const [pageModal, setPageModal] = useState("deadline");
    const [difficulty, setDifficulty] = useState(null);

    const handleDateChange = (event) => {
        const newDate = event.target.value;

        setDeadline(newDate);
        setIsDateInvalid(!isDateValid(newDate));
    };

    const handleAddWithDeadline = () => {
        if (!initialDeadline || !isDateValid(initialDeadline)) {
            setIsDateInvalid(true);
            return;
        }
        setPageModal("difficulty");
    };

    const handleAddWithoutDeadline = () => {
        setDeadline("");
        setIsDateInvalid(false);
        setPageModal("difficulty");
    };

    const handleBack = () => {
        setPageModal("deadline");
        setDifficulty(null);
    };

    const handleFinalSubmit = async () => {
        if (!difficulty) return;

        const result = await onSubmit({
            hasDeadline: !!initialDeadline,
            difficulty,
        });

        if (result?.success) {
            onClose();
        }
    };

    return {
        isDateInvalid,
        pageModal,
        difficulty,
        handleDateChange,
        handleAddWithDeadline,
        handleAddWithoutDeadline,
        handleBack,
        handleFinalSubmit,
        setDifficulty,
    };
};

export default useTaskModalState;
