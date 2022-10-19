import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import { Provider } from "react-redux";
import { store } from "../store";
import { NextPage } from "next";
import React, { ReactElement, ReactNode } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType;
  };
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <UserProvider>
      <PayPalScriptProvider
        options={{
          "client-id": `${process.env.CLIENT_ID}`,
        }}
      >
        <Provider store={store}>
          {getLayout(<Component {...pageProps} />)}
        </Provider>
      </PayPalScriptProvider>
    </UserProvider>
  );
}

export default MyApp;
