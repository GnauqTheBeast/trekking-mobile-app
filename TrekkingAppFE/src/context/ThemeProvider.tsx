import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({ fontFamily: 'OpenSans-Regular' });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeContext.Provider value={{ fontFamily: 'OpenSans-Regular' }}>
            {children}
        </ThemeContext.Provider>
    );
};
