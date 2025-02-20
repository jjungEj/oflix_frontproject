
import React, { createContext, useEffect, useState } from 'react';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({ children }) => {
    const [isLogin, setLogin] = useState(false);
    
    

   
    const logout = () => {
        
    };

    
    // useEffect(() => {
        
    //     if (token) {
            
    //         setLogin(true);
    //     }
    // }, []);

    

    return (
        <LoginContext.Provider value={{ isLogin, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;

