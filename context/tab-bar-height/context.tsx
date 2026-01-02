import * as React from 'react';

type TabBarHeightContextValue = {
  height: number;
  setHeight: (next: number) => void;
};

const TabBarHeightContext = React.createContext<TabBarHeightContextValue | null>(null);

type TabBarHeightProviderProps = {
  children: React.ReactNode;
};

export function TabBarHeightProvider({ children }: TabBarHeightProviderProps) {
  const [height, setHeight] = React.useState(0);
  const value = React.useMemo(() => ({ height, setHeight }), [height]);
  return (
    <TabBarHeightContext.Provider value={value}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

export function useTabBarHeight() {
  const context = React.useContext(TabBarHeightContext);
  if (!context) {
    return { height: 0, setHeight: () => {} };
  }
  return context;
}
