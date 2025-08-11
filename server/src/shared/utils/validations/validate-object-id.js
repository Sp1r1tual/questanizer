import { isValidObjectId } from "mongoose";

import { ApiError } from "../../exceptions/api-error.js";

const validateObjectId = (id, label = "ID") => {
    if (!isValidObjectId(id)) {
        throw ApiError.BadRequest(`Invalid ${label}`);
    }
};

const validateObjectIds = (ids, labels = []) => {
    ids.forEach((id, i) => {
        const label = labels[i] || `ID #${i + 1}`;

        validateObjectId(id, label);
    });
};

const validateUserId = (userId) => validateObjectId(userId, "user ID");
const validateTaskId = (taskId) => validateObjectId(taskId, "task ID");
const validateTaskAndUserIds = (taskId, userId) =>
    validateObjectIds([taskId, userId], ["task ID", "user ID"]);

export {
    validateObjectId,
    validateObjectIds,
    validateUserId,
    validateTaskId,
    validateTaskAndUserIds,
};
