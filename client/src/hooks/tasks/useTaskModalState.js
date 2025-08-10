import { useState } from "react";
import { isDateValid } from "../../utils/validation/isDateValid";

const useTaskModalState = ({ deadline, setDeadline, onSubmit, onClose }) => {
    const [isDateInvalid, setIsDateInvalid] = useState(false);
    const [pageModal, setPageModal] = useState("deadline");
    const [difficulty, setDifficulty] = useState(null);

    const handleDateChange = (event) => {
        const newDate = event.target.value;

        setDeadline(newDate);
        setIsDateInvalid(!isDateValid(newDate));
    };

    const handleAddWithDeadline = () => {
        if (!deadline || !isDateValid(deadline)) {
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
            hasDeadline: !!deadline,
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

export { useTaskModalState };
