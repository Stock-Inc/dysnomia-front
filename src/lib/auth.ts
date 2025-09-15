"use server";
import {cookies} from "next/headers";
import hash from "@/lib/hash";

const BACKEND_URL = "https://api.femboymatrix.su";
const COOKIE_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days
const COOKIE_SECRET = await hash("SHA-256", process.env.SALT_PHRASE!);

console.log(COOKIE_SECRET);

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
        console.log(JSON.stringify(credentials));
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(credentials),
        });
        console.log(response);
        const data = await response.json();
        //TODO: Store access token in cookies
        if (response.ok) {
            const cookieJar = await cookies();
            cookieJar.set("dysnomia", credentials.username + COOKIE_SECRET + data.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: COOKIE_EXPIRATION_TIME,
            });
            return {
                success: true,
                message: "Logged in",
                accessToken: data.accessToken,
            };
        } else {
            return {
                success: false,
                message: response.statusText,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: (error as Error).message,
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
        const response = await fetch(`${BACKEND_URL}/registration`, {
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

export type SessionCheckResponse = {
    success: boolean,
    message: string,
    username?: string,
    accessToken?: string,
}

export async function checkForActiveSessions(): Promise<SessionCheckResponse> {
    try {
        const cookieJar = await cookies();
        const cookie = cookieJar.get("dysnomia");
        if (!cookie) {
            return {
                success: false,
                message: "No active session found",
            };
        }
        const [username, refreshToken] = cookie.value.split(COOKIE_SECRET);
        let newRefreshToken: string;
        try {
            const response = await fetch(`${BACKEND_URL}/refresh_token`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + refreshToken,
                }
            });
            if (response.ok) {
                const data = await response.json();
                newRefreshToken = data.refreshToken;
                const newAccessToken = data.accessToken;
                cookieJar.set("dysnomia", username + "thisisagreatwayofstoringstuffiamsurenothingwillevergowrong" + newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: COOKIE_EXPIRATION_TIME,
                });
                return {
                    success: true,
                    message: "Session active",
                    username: username,
                    accessToken: newAccessToken,
                };
            } else {
                return {
                    success: false,
                    message: response.statusText,
                };
            }
        } catch (e) {
            return {
                success: false,
                message: (e as Error).message,
            };
        }
    } catch (e) {
        return {
            success: false,
            message: (e as Error).message,
        };
    }

}