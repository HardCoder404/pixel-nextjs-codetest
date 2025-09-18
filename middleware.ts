import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes under /orders
        if (req.nextUrl.pathname.startsWith("/orders")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/orders/:path*"],
};
