"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";
import type {
  AuthInitialSessionData,
  AuthState,
  AuthAction,
  AuthContextType,
  User,
  Session,
} from "@/types";
import { authClient } from "@/lib/auth-client";

const initialAuthState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "LOGOUT":
      return initialAuthState;
    default:
      return state;
  }
}

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: AuthInitialSessionData | null;
}) {

  const [loadingClientSession, setLoadingClientSession] = useState(true);

  const [state, dispatch] = useReducer(
    authReducer,
    initialSession?.user && initialSession?.session
      ? {
          user: initialSession.user,
          session: initialSession.session,
          isAuthenticated: true,
        }
      : initialAuthState
  );

  useEffect(() => {
    if (!initialSession?.user && !state.isAuthenticated && loadingClientSession) {
      const fetchClientSession = async () => {
        try {
          const session = await authClient.getSession({
            fetchOptions: { credentials: "include", throw: false },
          });

          if (session.data?.user && session.data?.session) {
            dispatch({
              type: "LOGIN",
              payload: {
                user: session.data.user as User,
                session: session.data as Session,
              },
            });
          } else {
            if (state.isAuthenticated) {
                dispatch({ type: "LOGOUT" });
            }
          }
        } catch (error) {
          console.error("Failed to fetch client session:", error);
          if (state.isAuthenticated) {
            dispatch({ type: "LOGOUT" });
          }
        } finally {
          setLoadingClientSession(false);
        }
      };

      fetchClientSession();
    } else {
      setLoadingClientSession(false);
    }
  }, [initialSession, state.isAuthenticated, loadingClientSession, dispatch]);

  if (loadingClientSession && !state.isAuthenticated) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};