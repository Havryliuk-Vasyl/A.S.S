import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null}
  onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "feajfw8v8rr2nv0ruwrm2rnr2ar9a2ir9uv990mq29rvm2ar";
const API_URL = "https://localhost:7219";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: any }) => {
  const [authState, setAuthState] = useState<{ 
    token: string | null; 
    authenticated: boolean | null 
  }>({ 
    token: null, 
    authenticated: null 
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log("Token from Secure Store: " + token);

        if (token){
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          setAuthState({
            token: token,
            authenticated: true,
          });
        }
      }
      catch (e) {
        console.log("Error in Secure Storage: " + e);
      }
    }

    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/Authorization/register`, { email, password });
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/Authorization/login`, { email, password });

      const token = result.data.data.token;

      setAuthState({ 
        token: token,
        authenticated: true
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, token); 

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response?.data?.message };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = null;

    setAuthState({
      token: null,
      authenticated: false
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}