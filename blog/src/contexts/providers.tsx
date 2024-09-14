'use client'

import Chakra from "./chakra"
import { SessionProvider } from "next-auth/react";
import { useQueryClient, QueryClientProvider, QueryClient  } from "@tanstack/react-query";


export default function Providers({ children }: { children: React.ReactNode }) {
    const client = new QueryClient()
    return (
        <>
            <SessionProvider>
                <QueryClientProvider client={client}>
                    <Chakra>
                        {children}
                    </Chakra>
                </QueryClientProvider>
            </SessionProvider>
        </>
    )
}