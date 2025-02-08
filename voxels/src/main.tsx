import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from "react-router";
import {AppRouter} from "@/components";
import {MantineProvider} from "@mantine/core";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <MantineProvider>
                <AppRouter/>
            </MantineProvider>
        </BrowserRouter>
    </StrictMode>,
)
