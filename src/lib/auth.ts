"use server";
import {cookies} from "next/headers";
import Interceptors from "undici-types/interceptors";
import responseError = Interceptors.responseError;

export type LoginData = {
    username: string,
    password: string,
}

export type LoginResponse = {
    success: boolean,
    message: string,
    accessToken?: string,
}

export async function loginAction(credentials: LoginData): Promise<LoginResponse> {
    try {
        const response = await fetch("https://api.femboymatrix.su/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (response.ok) {
            const cookieJar = await cookies();
            cookieJar.set("dysnomia", data.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 5,
            });
            return {
                success: true,
                message: "Logged in",
                accessToken: data.accessToken,
            };
        } else {
            return {
                success: false,
                message: "Invalid Username or Password",
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Network Error",
        };
    }
}

export type SignupData = {
    username: string,
    email: string,
    password: string,
}

export type SignupResponse = {
    success: boolean,
    message: string,
}

export async function signupAction(credentials: SignupData): Promise<SignupResponse> {
    try {
        const response = await fetch("https://api.femboymatrix.su/registration", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
        if (response.ok) {
            return {
                success: true,
                message: "Signed up",
            };
        } else {
            return {
                success: false,
                message: "A user with that username or email already exists",
            };
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
        };
    }
}