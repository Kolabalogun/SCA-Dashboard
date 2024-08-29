"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "@/contexts/AuthContext";
import AppContextProvider from "@/contexts/AppContext";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-dark-300 font-sans text-white antialiased",
          fontSans.variable
        )}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContextProvider>
              <AuthProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  <ChakraProvider>{children}</ChakraProvider>
                </ThemeProvider>
              </AuthProvider>
            </AppContextProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
