import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname == "/refresh") {
    return NextResponse.redirect(new URL("/student", request.url));
  }
}
