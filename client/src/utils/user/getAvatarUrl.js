import defaultUserAvatarIcon from "../../assets/avatar-people-user-svgrepo-com.png";

const getAvatarUrl = (photoUrl) => {
    const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/+$/, "");

    if (!photoUrl || typeof photoUrl !== "string" || !photoUrl.trim()) {
        return defaultUserAvatarIcon;
    }

    const trimmedUrl = photoUrl.trim();
    const isAbsoluteUrl =
        trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://");

    if (isAbsoluteUrl) return trimmedUrl;

    const normalizedPath = trimmedUrl.startsWith("/")
        ? trimmedUrl
        : `/${trimmedUrl}`;

    return `${baseUrl}${normalizedPath}`;
};

export default getAvatarUrl;
