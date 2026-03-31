import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Reqruit';

// Initialize Bootstrap only in browser environment since it manipulates the DOM  
// We'll import the Bootstrap JS directly which will be available through the script tag in app.blade.php

// Just make sure that Bootstrap components work as intended in the browser
if (typeof window !== 'undefined') {
    // Since Bootstrap JS is now loaded via script tag in app.blade.php, 
    // it's globally available and we don't need to import it here
    // All components should work automatically
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#0d6efd',
    },
});
