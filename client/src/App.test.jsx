import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./routes/pages/authentication/AuthenticationPage", () => () => (
    <div>Mocked AuthenticationPage</div>
));

jest.mock("./layouts/AuthenticatedLayout", () => () => (
    <div>Mocked AuthenticatedLayout</div>
));

describe("App routing", () => {
    it("renders an AuthenticationPage on /authentication", () => {
        render(
            <MemoryRouter initialEntries={["/authentication"]}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Mocked AuthenticationPage")
        ).toBeInTheDocument();
    });

    it("renders AuthenticatedLayout on all other paths", () => {
        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <App />
            </MemoryRouter>
        );

        expect(
            screen.getByText("Mocked AuthenticatedLayout")
        ).toBeInTheDocument();
    });
});
