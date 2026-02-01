'use client';

import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext<any>(null);

function authReducer(state: any, action: any) {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload.user,
                session: action.payload.session,
                isAuthenticated: true,
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: { ...state.user, ...action.payload}
            };
        case "LOGOUT":
            return null;
        default:
            return state;
    }
}

export function AuthProvider({ children, initialSession }: { children: React.ReactNode; initialSession: any }) {
    const [state, dispatch] = useReducer(authReducer, initialSession);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);