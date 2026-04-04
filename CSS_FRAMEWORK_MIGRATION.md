# CSS Framework Migration: Bootstrap → Tailwind CSS

## Decision Summary
Following the U3 audit report, we decided to migrate fully to **Tailwind CSS** due to existing usage throughout the application and maintain consistency. Bootstrap has been removed to avoid CSS conflicts that cause certain Tailwind classes not to work properly.

## Changes Implemented

### 1. Package Updates
- Added Tailwind CSS and related dependencies to package.json
- Added Tailwind directives `@tailwind base`, `@tailwind components`, `@tailwind utilities` to `resources/css/app.css`
- Updated Vite configuration (was already in place)

### 2. HTML Template Updates (`resources/views/app.blade.php`)
- Removed Bootstrap CSS from the template head
- Removed Bootstrap JavaScript reference (`bootstrap.min.js`) from bottom of page
- Maintained existing admin template CSS and JavaScript that don't conflict with Tailwind

### 3. Custom Component Classes
Added Tailwind-based classes to replace common Bootstrap utility classes:
- `btn`, `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`
- `form-control` for form inputs
- `card` for content containers
- `alert`, `alert-danger`, `alert-success`, `alert-warning` for notifications
- `navbar` for navigation elements

### 4. JavaScript Adjustments
- Removed Bootstrap JavaScript plugin calls (tooltips, popovers, toasts) from `public/assets/js/pcoded.js`
- Replaced with comments indicating need for Tailwind-compatible alternatives
- Kept jQuery dependency as some admin template features may require it

### 5. CSS Conflicts Mitigation 
- Added specific Tailwind override rules to handle conflicts between admin template CSS and Tailwind classes
- Ensured Tailwind utilities take priority over conflicting Bootstrap classes

## Files Modified
1. `package.json` - Added Tailwind CSS dependencies
2. `resources/css/app.css` - Added Tailwind directives and component definitions
3. `resources/views/app.blade.php` - Removed bootstrap references
4. `public/assets/js/pcoded.js` - Removed Bootstrap plugin initializations

## Tailwind Configuration
- Configured in `tailwind.config.js`
- Set up properly for Inertia.js/React integration
- Added @tailwindcss/forms plugin

## Next Steps
1. Test all pages and components to ensure visual consistency
2. Replace Bootstrap-specific JavaScript interactions with Tailwind-compatible solutions (such as tippy.js for tooltips)
3. Update any remaining components that may rely on Bootstrap CSS classes
4. Implement dark mode support with Tailwind

## Rollback Information
- Bootstrap files remain in the repository in case fallback is needed
- Can restore Bootstrap by reversing these changes if critical functionality is broken

This migration resolves CSS conflicts where Tailwind classes were being overridden by Bootstrap and establishes Tailwind as the primary CSS framework going forward.