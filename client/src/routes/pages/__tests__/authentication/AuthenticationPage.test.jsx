import { render, screen } from "@testing-library/react";
import AuthenticationPage from "../../authentication/AuthenticationPage";

jest.mock("../../authentication/components/AuthForm", () => {
    return () => <div data-testid="mock-auth-form">Mock AuthForm</div>;
});

jest.mock("../../authentication/components/LoginImage", () => {
    return () => <div data-testid="mock-login-image">Mock LoginImage</div>;
});

jest.mock("../../../../components/footer/Footer", () => {
    return () => <div data-testid="mock-footer">Mock Footer</div>;
});

describe("AuthenticationPage", () => {
    it("renders AuthForm, LoginImage and Footer components", () => {
        render(<AuthenticationPage />);
        const authForm = screen.getByTestId("mock-auth-form");
        const loginImage = screen.getByTestId("mock-login-image");
        const footer = screen.getByTestId("mock-footer");

        expect(authForm).toBeInTheDocument();
        expect(loginImage).toBeInTheDocument();
        expect(footer).toBeInTheDocument();
    });

    it("renders basic wrappers with CSS modules", () => {
        render(<AuthenticationPage />);
    });
});
