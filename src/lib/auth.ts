"use server";
import {cookies} from "next/headers";
import {EncryptJWT, jwtDecrypt} from "jose";

const BACKEND_URL = "https://api.femboymatrix.su";
const COOKIE_EXPIRATION_TIME = 60 * 60 * 24 * 7; // 7 days
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

export async function loginAction(credentials: LoginData): Promise<LoginResponse> {
    try {
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
            const payload = {
                username: credentials.username,
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
        console.log(response);
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
        const {payload} = await jwtDecrypt(cookie.value, COOKIE_SECRET);
        const username = payload.username as string;
        const refreshToken = payload.refreshToken as string;
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
                const newPayload = {
                    username,
                    refreshToken: newRefreshToken,
                };
                const newAccessToken = data.accessToken;
                const cookieContent = await new EncryptJWT(newPayload)
                    .setProtectedHeader({alg: "dir", enc: "A256GCM"})
                    .setExpirationTime('7 days')
                    .setIssuedAt()
                    .encrypt(COOKIE_SECRET);
                cookieJar.set("dysnomia", cookieContent, {
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