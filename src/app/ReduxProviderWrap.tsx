"use client"

import { Provider } from "react-redux";
import { store, persistedStore } from "@/redux/3_redux";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";

const ReduxProviderWrap = ({children}: {children:ReactNode}) => {
    return (
        <Provider store={store}>
          <PersistGate persistor={persistedStore}>
              {children}
          </PersistGate>
        </Provider>
    )
}

export default ReduxProviderWrap;