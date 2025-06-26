import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Outlet } from "react-router-dom";

const MockLoginPage = () => <div data-testid="login-page">Mock Login Page</div>;
const MockRegistrationPage = () => (
    <div data-testid="registration-page">Mock Registration Page</div>
);
const MockVerifyEmailPage = () => (
    <div data-testid="verify-email-page">Mock Verify Email Page</div>
);
const MockAuthenticatedLayout = () => (
    <div data-testid="authenticated-layout">
        <Outlet />
    </div>
);
const MockDashboard = ({ children }) => (
    <div data-testid="dashboard">{children}</div>
);
const MockTasksView = () => <div data-testid="tasks-view">Mock Tasks View</div>;
const MockUserStatsView = () => (
    <div data-testid="user-stats-view">Mock User Stats View</div>
);
const MockBossBattlePage = () => (
    <div data-testid="boss-battle-page">Mock Boss Battle Page</div>
);
const MockAnswersPage = () => (
    <div data-testid="answers-page">Mock Answers Page</div>
);

const createTestRouter = (initialEntries = ["/"]) => {
    return createMemoryRouter(
        [
            {
                path: "/login",
                element: <MockLoginPage />,
            },
            {
                path: "/registration",
                element: <MockRegistrationPage />,
            },
            {
                path: "/verify-email",
                element: <MockVerifyEmailPage />,
            },
            {
                path: "/",
                element: <MockAuthenticatedLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <MockDashboard>
                                <MockUserStatsView />
                                <MockTasksView />
                            </MockDashboard>
                        ),
                    },
                    {
                        path: "boss",
                        element: <MockBossBattlePage />,
                    },
                    {
                        path: "faq",
                        element: <MockAnswersPage />,
                    },
                ],
            },
        ],
        {
            initialEntries: initialEntries,
        }
    );
};

describe("App Router", () => {
    test("renders LoginPage for /login route", () => {
        const router = createTestRouter(["/login"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    test("renders RegistrationPage for /registration route", () => {
        const router = createTestRouter(["/registration"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("registration-page")).toBeInTheDocument();
    });

    test("renders VerifyEmailPage for /verify-email route", () => {
        const router = createTestRouter(["/verify-email"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("verify-email-page")).toBeInTheDocument();
    });

    test("renders Dashboard, UserStatsView, and TasksView for the default / route", () => {
        const router = createTestRouter(["/"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();
        expect(screen.getByTestId("dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("user-stats-view")).toBeInTheDocument();
        expect(screen.getByTestId("tasks-view")).toBeInTheDocument();
    });

    test("renders BossBattlePage for /boss route within AuthenticatedLayout", () => {
        const router = createTestRouter(["/boss"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();
        expect(screen.getByTestId("boss-battle-page")).toBeInTheDocument();
    });

    test("renders AnswersPage for /faq route within AuthenticatedLayout", () => {
        const router = createTestRouter(["/faq"]);

        render(<RouterProvider router={router} />);

        expect(screen.getByTestId("authenticated-layout")).toBeInTheDocument();
        expect(screen.getByTestId("answers-page")).toBeInTheDocument();
    });
});
