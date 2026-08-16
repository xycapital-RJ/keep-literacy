export interface JwtPayload {
  sub: string;   // userId
  email: string;
}

/** Attached to req.user by JwtStrategy after token verification */
export interface AuthenticatedUser {
  userId: string;
  email: string;
}
