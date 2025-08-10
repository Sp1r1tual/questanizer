const useConfirmModalTexts = (confirmModal, t) => {
    if (!confirmModal?.actionType) {
        return {
            title: "",
            message: "",
        };
    }

    switch (confirmModal.actionType) {
        case "delete":
            return {
                title: t("organizer.confirmation.deleteTitle"),
                message: t("organizer.confirmation.deleteMessage", {
                    task: confirmModal.taskText,
                }),
            };
        case "complete":
            return {
                title: t("organizer.confirmation.completeTitle"),
                message: t("organizer.confirmation.completeMessage", {
                    task: confirmModal.taskText,
                }),
            };
        case "group-delete-completed":
            return {
                title: t("organizer.confirmation.deleteAllCompletedTitle"),
                message: t("organizer.confirmation.deleteAllCompletedMessage"),
            };
        case "group-delete-overdue":
            return {
                title: t("organizer.confirmation.defaultTitle"),
                message: t("organizer.confirmation.deleteAllOverdueMessage"),
            };
        default:
            return {
                title: t("organizer.confirmation.defaultTitle"),
                message: t("organizer.confirmation.defaultMessage"),
            };
    }
};

export { useConfirmModalTexts };
