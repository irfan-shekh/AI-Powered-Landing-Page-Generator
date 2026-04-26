import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = 'force-dynamic';

export const { GET, POST: originalPOST } = toNextJsHandler(auth);

export const POST = async (req: Request) => {
    console.log("Auth POST Request Origin:", req.headers.get("origin"));
    return originalPOST(req);
};
