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
            console.error("Failed to fetch user profile:", error);
            throw new Error("Unable to determine current user ID");
        }
    }

    return currentUserId;
};

export default getCurrentUserId;
