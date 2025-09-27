"use server";
import {cookies} from "next/headers";
import {EncryptJWT, jwtDecrypt} from "jose";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;
const MAIN_COOKIE_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days
const ACCESS_COOKIE_EXPIRATION_TIME = 60 * 60 * 10; // 10 hours
const textEncoder = new TextEncoder();
const baseKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(process.env.COOKIE_SECRET),
    {name: "PBKDF2"},
    false,
    ["deriveBits", "deriveKey"],
);
const salt = textEncoder.encode("the-saltiest-salt-in-the-whole-world");
const COOKIE_SECRET = await crypto.subtle.deriveKey(
    {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: {name: "SHA-256"},
    },
    baseKey,
    {
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"],
);

export type LoginData = {
    username: string,
    password: string,
}

export type LoginResponse = {
    success: boolean,
    message: string,
    accessToken?: string,
}

async function setCookies(response: Response, username: string): Promise<{success: boolean, accessToken?: string}> {
    try {
        const data = await response.json();
        const payload = {
            username,
            refreshToken: data.refreshToken,
        };
        const cookieContent = await new EncryptJWT(payload)
            .setProtectedHeader({alg: "dir", enc: "A256GCM"})
            .setExpirationTime('7 days')
            .setIssuedAt()
            .encrypt(COOKIE_SECRET);
        const cookieJar = await cookies();
        cookieJar.set("dysnomia", cookieContent, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: MAIN_COOKIE_EXPIRATION_TIME,
        });
        cookieJar.set("dysnomia-access", data.accessToken, {
            sameSite: "strict",
            maxAge: ACCESS_COOKIE_EXPIRATION_TIME,
        });
        return {
            success: true,
            accessToken: data.accessToken,
        };
    } catch (e) {
        return {
            success: false
        };
    }
}

export async function loginAction(credentials: LoginData): Promise<LoginResponse> {
    const needed: LoginData = {username: credentials.username, password: credentials.password};
    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(needed),
        });
        console.log(response, JSON.stringify(needed));
        if (response.ok) {
            const {success, accessToken} = await setCookies(response, credentials.username);
            return {
                success,
                message: "Logged in",
                accessToken: accessToken, //FIXME: TEMPORARY TILL WE GET SPECIAL WEBSOCKET ONLY TOKENS
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
    accessToken?: string,
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
        console.log(response);
        if (response.ok) {
            const {success, accessToken} = await setCookies(response, credentials.username);
            return {
                success,
                message: "Signed up",
                accessToken: accessToken,
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
        const accessCookie = cookieJar.get("dysnomia-access");
        if (!accessCookie) {
            const mainCookie = cookieJar.get("dysnomia");
            if (!mainCookie) {
                return {
                    success: false,
                    message: "No active session found",
                };
            } else {
                const {payload} = await jwtDecrypt(mainCookie.value, COOKIE_SECRET);
                const username = payload.username as string;
                const refreshToken = payload.refreshToken as string;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/refresh_token`, {
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + refreshToken
                        }
                    });
                    if (response.ok) {
                        const {success, accessToken} = await setCookies(response, username);
                        return success ? {
                            success: true,
                            message: "session extended",
                            accessToken: accessToken,
                        } : {
                            success: false,
                            message: "session prolongation failed",
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
                        message: (e as Error).message
                    };
                }
            }
        } else {
            const accessToken = accessCookie.value;
            return {
                success: true,
                message: "session found",
                accessToken: accessToken,
            };
        }
    } catch (e) {
        return {
            success: false,
            message: (e as Error).message,
        };
    }
}

export async function logoutAction() {
    const cookieJar = await cookies();
    cookieJar.delete("dysnomia");
    cookieJar.delete("dysnomia-access");
}