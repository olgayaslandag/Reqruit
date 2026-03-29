import { createContext, useContext } from 'react';

const PageActionContext = createContext();

export const PageActionProvider = ({ actions = {}, children }) => {
    return (
        <PageActionContext.Provider value={actions}>
            {children}
        </PageActionContext.Provider>
    );
};

export const usePageActions = () => {
    const context = useContext(PageActionContext);
    if (!context) {
        throw new Error('usePageActions must be used within a PageActionProvider');
    }
    return context;
};