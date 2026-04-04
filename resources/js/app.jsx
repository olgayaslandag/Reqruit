import './bootstrap';
import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import i18n from './i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Reqruit';

// Global olarak scroll davranışını ayarla - sayfa geçişlerinde scroll pozisyonunu koru
router.on('before', (event) => {
    event.detail.visit.preserveScroll = true;
});

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
