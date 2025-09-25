import {NextRequest, NextResponse} from "next/server";
import {checkForActiveSessions} from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    const protectedRoutes = ['/home', '/dashboard', '/profile'];
    const authRoutes = ['/login', '/signup'];
    const publicRoutes = ['/', '/about']; // Add other public routes

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    let hasActiveSession: boolean;
    try {
        const activeSessionData = await checkForActiveSessions();
        hasActiveSession = activeSessionData.success;
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isProtectedRoute && !hasActiveSession) return NextResponse.redirect(new URL('/login', request.url));

    if (isAuthRoute && hasActiveSession) return NextResponse.redirect(new URL('/home', request.url));

    if (isPublicRoute) return NextResponse.next();

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};