import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";

import React from "react";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "./chakra/createEmotionCache";
import ClientStyleContext from "./chakra/context.client";

interface ClientCacheProviderProps {
    children: React.ReactNode
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
    const [cache, setCache] = React.useState(createEmotionCache());

    function reset() {
        setCache(createEmotionCache());
    }

    return (
        <ClientStyleContext.Provider value={{ reset }}>
            <CacheProvider value={cache}>{children}</CacheProvider>
        </ClientStyleContext.Provider>
    );
}

hydrate(
    <ClientCacheProvider>
        <RemixBrowser />
    </ClientCacheProvider>,
    document
);
