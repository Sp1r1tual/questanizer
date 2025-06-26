const VerifyEmailPage = () => {
    return (
        <div className="verify-email-page">
            <h1>Check your email</h1>
            <p>
                We’ve sent a confirmation link to your email address. Please
                click it to activate your account💌
            </p>
            {/* <button onClick={handleResend} disabled={cooldown > 0}>
                {cooldown > 0 ? `Try again in ${cooldown}s` : "Resend email"}
            </button> */}
        </div>
    );
};

export default VerifyEmailPage;
