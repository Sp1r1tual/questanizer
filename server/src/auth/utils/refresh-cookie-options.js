const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/api",
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

export { REFRESH_COOKIE_OPTIONS };
