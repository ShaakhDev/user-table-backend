import { verifyJwtToken } from "../modules/jwt.js";

export async function AuthChecker(req) {
    if (!req.headers['authorization']) {
        return { status: 403, message: "Token not found" };
    }
    const data = verifyJwtToken(req.headers["authorization"].split(" ")[1]);
    if (!data) return { status: 403, message: "Invalid token" };
    return { status: 200, message: "Token verified" };
}