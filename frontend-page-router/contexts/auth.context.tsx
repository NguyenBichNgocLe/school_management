import {
  ActionDispatch,
  createContext,
  PropsWithChildren,
  useEffect,
  useReducer,
} from "react";

export type RoleType = "admin" | "principal" | "teacher";

export interface AuthContextData {
  role?: RoleType;
}
export const AuthContext = createContext<AuthContextData>({});
export const UpdateAuthContext = createContext<
  ActionDispatch<[role: RoleType]>
>(null as any);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [authData, updateAuth] = useReducer((data, role: RoleType) => {
    return { ...data, role };
  }, {});

  return (
    <AuthContext.Provider value={authData}>
      <UpdateAuthContext.Provider value={updateAuth}>
        {children}
      </UpdateAuthContext.Provider>
    </AuthContext.Provider>
  );
};
