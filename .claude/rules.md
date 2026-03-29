# Global Rules

## Architecture
- Always use clean architecture
- Controllers must be thin
- Business logic must be in services
- Use repository pattern for DB access

## Backend (Laravel)
- Use FormRequest for validation
- Never write business logic in controllers
- Use DTO where needed

## API
- Use RESTful conventions
- Return consistent JSON responses
- Use proper HTTP status codes

## Database
- Normalize schema
- Use indexes properly
- Avoid N+1 queries

## Security
- Prevent SQL injection
- Validate all inputs
- Never trust user input

## Naming
- Use clear and consistent naming
- Avoid abbreviations

## DevOps
- Use Docker-friendly structure
- Avoid environment-specific hacks

## Testing
- Write unit tests for business logic
