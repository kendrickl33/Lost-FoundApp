import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ email: '', displayName: '', id: '', icon: '',});

    return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
    );
};