import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './Components/ErrorBoundary';
import Preloader from './Components/Preloader';

const appName = import.meta.env.VITE_APP_NAME || 'Reqruit';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // Vite's glob import with lazy loading enables automatic code splitting
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx', { eager: false })),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Preloader>
                <ErrorBoundary>
                    <App {...props} />
                </ErrorBoundary>
            </Preloader>
        );
    },
    progress: {
        color: '#0d6efd',
    },
});
