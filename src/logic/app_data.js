import { createContext } from "preact";
import { useMemo, useContext, useState } from "preact/hooks";

export const ACTION_SET_DOC_SIZE = "ACTION_SET_DOC_SIZE";

const AppContext = createContext();

const reducer = (store, action, payload) => {
  switch (action) {
    case ACTION_SET_DOC_SIZE:
      return { ...store, fileSize: payload };
  }
  return store;
};

export const AppProvider = ({ children }) => {
  const [store, setStore] = useState({
    fileSize: 0,
    dispatch: () => {},
  });
  store.dispatch = useMemo(
    () => (action, payload) => setStore(reducer(store, action, payload)),
    []
  );
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export const useAppData = () => {
  return useContext(AppContext);
};
