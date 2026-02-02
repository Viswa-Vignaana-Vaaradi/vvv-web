"use client";

import { createContext, useContext, useReducer } from "react";
import type {
  AuthInitialSessionData,
  AuthState,
  AuthAction,
  AuthContextType,
  User,
  Session,
} from "@/types";

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
  const initialStateFromProps: AuthState = initialSession?.user
    ? {
        user: initialSession.user,
        session: initialSession.session,
        isAuthenticated: true,
      }
    : initialAuthState;

  const [state, dispatch] = useReducer(authReducer, initialStateFromProps);

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