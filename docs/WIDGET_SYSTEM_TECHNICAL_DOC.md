# Widget System Technical Documentation

## Overview

The Widget system is an embeddable component that allows external websites to integrate recruitment forms from the reqruit platform. The system provides a hierarchical department navigation structure, with forms available at various department levels.

## Architecture

### Frontend Components

#### `public/widget/reqruit.js`
- **Initialization**: Configurable with options like container element, base URL, department slug, and theme settings
- **State Management**: Maintains application state including current department ID, departments list, breadcrumb trail, form data, loading states, and errors
- **API Interactions**: Communicates with the backend API through dedicated endpoints

### Backend Components

#### `app/Http/Controllers/Api/WidgetController.php`
Handles department-related requests:
- Retrieves root departments (`GET /api/widget/departments`)
- Gets department by ID (`GET /api/widget/departments/{id}`)
- Gets department by slug (`GET /api/widget/departments/slug/{slug}`)

#### `app/Http/Controllers/Api/WidgetFormController.php`
Handles form-related requests:
- Shows individual forms (`GET /api/widget/forms/{slug}`)
- Submits form data (`POST /api/widget/forms/{slug}/submit`)

#### `app/Services/WidgetService.php`
Core business logic service:
- `getRootDepartments()` - Gets root-level departments
- `getDepartmentWithDetails()` - Gets specific department with children and forms
- `getDepartmentBySlug()` - Gets department by slug identifier
- `getFormBySlug()` - Gets form by slug identifier
- `buildValidationRules()` - Creates validation rules based on form fields
- `handleSubmission()` - Processes form submissions

#### `app/Http/Resources/DepartmentResource.php`
Transforms department models into API responses with properties:
- `has_children`: Boolean indicating presence of nested departments
- `has_form`: Boolean indicating presence of associated forms
- `no_content_message`: Special message when neither children nor forms exist
- `form`: Embedded form resource when available
- `children`: Collection of child department resources

## Hierarchical Department Flow

1. **Start**: Widget loads root departments by default
2. **Navigation**: Users can drill down into department hierarchies
3. **Form Display**: At any level, if a department has a form, it can be presented
4. **Breadcrumbs**: Tracks navigation path for easy back navigation
5. **URL Sync**: Department selection updates URL for shareable links

## Handling Missing Departments and Forms Scenarios

The widget system has been enhanced to gracefully handle scenarios where neither sub-departments nor forms are available in a specified department:

### Backend Behavior (DepartmentResource.php:17-19)
```php
$noContentMessage = (!$hasChildren && !$hasForm) ?
    'Bu departmanda alt departman veya başvuru formu bulunmamaktadır.' :
    null;
```

When both `has_children` and `has_form` are false, the `no_content_message` field contains:
`"Bu departmanda alt departman veya başvuru formu bulunmamaktadır."` (Turkish for "This department does not have sub-departments or application forms.")

### Frontend Behavior (reqruit.js:447-455)

When no children or forms are available:

**In loadDepartment function:**
1. Current department information gets added to the breadcrumbs
2. State sets departments to an empty array: `state.departments = [];`
3. State clears active form: `state.form = null;`
4. Special message stored in state: `state.no_content_message = ...`
5. This message is displayed in the UI (line 606-610)

**In renderDepartments function:**
- Renders the `state.no_content_message` content if specified
- If no specific message exists, displays generic: "Bu departmanda alt departman veya form bulunamadı." (This department does not have sub-departments or forms)

## Initialization Options

```javascript
ReqruitWidget.init({
  container: '#reqruit-widget',  // Selector or DOM element for widget
  baseUrl: '',                   // API base URL (defaults to current site)
  department: null,              // Initial department slug (optional)
  theme: {
    primaryColor: '#4f46e5',     // Primary theme color
    primaryHover: '#4338ca',     // Hover state primary color
    borderRadius: '8px',         // Border radius
    fontFamily: 'system-ui',     // Font family
    backgroundColor: '#f9fafb',  // Background color
    cardBackground: '#ffffff',   // Card background
    textColor: '#111827',        // Text color
    borderColor: '#e5e7eb',      // Border color
    errorColor: '#dc2626',       // Error color
    successColor: '#16a34a'      // Success color
  }
});
```

## API Endpoints

### Department Endpoints
- `GET /api/widget/departments` - Root departments list
- `GET /api/widget/departments/{id}` - Specific department by ID
- `GET /api/widget/departments/slug/{slug}` - Specific department by slug

### Form Endpoints
- `GET /api/widget/forms/{slug}` - Form data
- `POST /api/widget/forms/{slug}/submit` - Submit form data

## Response Structure

### Single Department Resource
```json
{
  "id": 1,
  "title": "IT Department",
  "slug": "it",
  "has_children": true,
  "has_form": false,
  "no_content_message": null,
  "form": null,
  "children": [...]
}
```

### Form Submission Response
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "reference_no": "REF-000123456"
  }
}
```

## Security & Validation

1. **Form Validation**: WidgetService builds validation rules dynamically based on form fields
2. **File Upload Protection**: All file uploads use the configured storage system with size/type validation
3. **SQL Injection Prevention**: All queries use Laravel's ORM with proper escaping
4. **XSS Prevention**: Input sanitization performed on output rendering
5. **CSRF Protection**: Implemented on form submission endpoint

## Implementation Guidelines

### For Developers Adding New Widget Functionality
1. Follow existing pattern for API response consistency
2. Maintain state integrity when changing navigation flow
3. Preserve theme configuration flexibility
4. Ensure proper breadcrumb behavior
5. Always set appropriate `has_children` and `has_form` boolean values in DepartmentResource

### Deployment Requirements
1. Ensure `public/widget/reqruit.js` is publicly accessible
2. Widget API routes must be accessible without authentication for embedding
3. Cross-origin request sharing (CORS) properly configured for embed environments
4. Database schema supports nested department relationships

### Usage Example
```html
<div id="reqruit-widget"></div>
<script src="/widget/reqruit.js"></script>
<script>
  ReqruitWidget.init({
    container: '#reqruit-widget'
  });
</script>
```

This system enables embedded recruitment forms while handling complex department structures and gracefully managing missing content scenarios.