import { useEffect, useState } from "react";

import { getAvatarUrl } from "@/utils/user/getAvatarUrl";

const useAvatar = (photoUrl, defaultAvatar) => {
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatar);

  useEffect(() => {
    if (photoUrl) {
      setAvatarSrc(getAvatarUrl(photoUrl));
    } else {
      setAvatarSrc(defaultAvatar);
    }
  }, [photoUrl, defaultAvatar]);

  const handleError = () => {
    setAvatarSrc(defaultAvatar);
  };

  return { avatarSrc, handleError };
};

export { useAvatar };
