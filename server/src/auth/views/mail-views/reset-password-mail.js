const resetPasswordMailTemplate = (resetLink) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto">
            <h2 style="color: #333">Password Reset Request</h2>
            <p>
                You have requested to reset your password. Click the link below to reset
                your password:
            </p>
            <div style="margin: 20px 0">
                <a
                    href="${resetLink}"
                    style="
                    background-color: #007bff;
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                    "
                >
                    Reset Password
                </a>
            </div>
            <p style="color: #666; font-size: 14px">
                This link will expire in 15 minutes for security reasons.
            </p>
            <p style="color: #666; font-size: 14px">
                If you didn't request this password reset, please ignore this email.
            </p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee" />
            <p style="color: #999; font-size: 12px">
                If the button doesn't work, copy and paste this link into your
                browser:<br />
                <a href="${resetLink}">${resetLink}</a>
            </p>
        </div>
    `;
};

export { resetPasswordMailTemplate };
