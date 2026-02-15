import { authClient } from "@/lib/auth-client";

export type BetterAuthInferredSession = typeof authClient.$Infer.Session;

export type User = BetterAuthInferredSession["user"] & { memberCode?: string };;

export type Session = Omit<BetterAuthInferredSession, "user">;

export interface AuthInitialSessionData {
  user: User | null;
  session: Session | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: "LOGIN"; payload: { user: User; session: Session } }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "LOGOUT" };

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}