import test from "node:test";
import AuthPage from "./AuthPage";
import { render, screen } from "@testing-library/react";
import { expect } from "@jest/globals";

describe(AuthPage, () => {
    test("check auth container", () => {
        render(<AuthPage />);
        const authContainer = screen.getByTestId("authContainer");
        expect(authContainer).not.toBe(undefined);
    })
})