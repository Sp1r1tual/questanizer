import { fetchUserProfile } from "../../../store/user/userProfileThunks";

const getCurrentUserId = async (thunkAPI) => {
    let currentUserId = thunkAPI.getState().user.profile?.id;

    if (!currentUserId) {
        try {
            const profile = await thunkAPI
                .dispatch(fetchUserProfile())
                .unwrap();

            currentUserId = profile.id;
        } catch (error) {
            throw new Error("Failed to fetch user current user ID");
        }
    }

    return currentUserId;
};

export { getCurrentUserId };
