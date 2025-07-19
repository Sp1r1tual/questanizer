import useForm from "../../../hooks/auth/useForm";

import { renderHook, act } from "@testing-library/react";

describe("useForm", () => {
    const initialValues = { email: "" };

    const mockValidate = jest.fn((values) => {
        const errors = {};

        if (!values.email) errors.email = "Email is required";
        else if (!values.email.includes("@")) errors.email = "Email is invalid";

        return errors;
    });

    const mockSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("initializes with initial values", () => {
        const { result } = renderHook(() =>
            useForm({
                initialValues,
                validate: mockValidate,
                onSubmit: mockSubmit,
            })
        );

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
    });

    it("handles input change and clears field-specific error", () => {
        const { result } = renderHook(() =>
            useForm({
                initialValues,
                validate: mockValidate,
                onSubmit: mockSubmit,
            })
        );

        act(() => {
            result.current.setErrors({ email: "Email is required" });
        });

        act(() => {
            result.current.handleChange("email")({
                target: { value: "test@" },
            });
        });

        expect(result.current.values.email).toBe("test@");
        expect(result.current.errors.email).toBeUndefined();
    });

    it("does not submit if validation fails", async () => {
        const { result } = renderHook(() =>
            useForm({
                initialValues,
                validate: mockValidate,
                onSubmit: mockSubmit,
            })
        );

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockValidate).toHaveBeenCalled();
        expect(mockSubmit).not.toHaveBeenCalled();
        expect(result.current.errors.email).toBe("Email is required");
    });

    it("submits if validation passes", async () => {
        const validValues = { email: "test@example.com" };

        const validateSuccess = jest.fn(() => ({}));
        const { result } = renderHook(() =>
            useForm({
                initialValues: validValues,
                validate: validateSuccess,
                onSubmit: mockSubmit,
            })
        );

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(validateSuccess).toHaveBeenCalled();
        expect(mockSubmit).toHaveBeenCalledWith(validValues);
        expect(result.current.errors).toEqual({});
    });
});
