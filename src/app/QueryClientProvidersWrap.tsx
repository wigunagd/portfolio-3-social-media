"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react";

const QueryClientProvidersWrap = ({children} : {children: ReactNode}) => {
    const [queryCLient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryCLient}>
            {children}
        </QueryClientProvider>
    )
}

export default QueryClientProvidersWrap;