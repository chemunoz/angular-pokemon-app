# AGENTS.md - Project Guidelines for AI Agents

## Project Overview

This is a full-stack Angular 17 + Node.js application with MongoDB database. It includes:
- **Frontend**: Angular 17 with Bootstrap styling
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB (via Mongoose)

## Project Structure

```
/angular-17-client/          # Angular 17 frontend
  src/app/
    components/              # Angular components
    models/                 # TypeScript interfaces
    services/               # Angular services (HTTP)
    app.module.ts           # Main Angular module
    app-routing.module.ts  # Routing configuration

/node-express-mongodb-server/ # Node.js backend
  app/
    config/                 # Database configuration
    controllers/            # Business logic
    models/                 # Mongoose models
    routes/                 # Express routes
  server.js                 # Express server entry point
```

## Build Commands

### Angular Frontend (angular-17-client)

```bash
# Install dependencies
npm install

# Start development server (port 8081)
npm start
# or: ng serve --port 8081

# Build for production
npm run build

# Run tests
npm test
# Single test file: ng test --include='**/pokemon-list.component.spec.ts'
# Single test: ng test --include='**/tutorial.service.spec.ts'
# Watch mode: ng test --watch

# Run with coverage
ng test --code-coverage
```

### Node.js Backend (node-express-mongodb-server)

```bash
# Install dependencies
npm install

# Start server
node server.js
# Server runs on port 8080

# Run in watch mode (requires nodemon)
npx nodemon server.js
```

## Code Style Guidelines

### TypeScript/Angular

#### Naming Conventions
- **Components**: `PascalCase` - e.g., `PokemonListComponent`, `TutorialDetailsComponent`
- **Services**: `PascalCase` with `Service` suffix - e.g., `PokemonService`, `TutorialService`
- **Models/Interfaces**: `PascalCase` - e.g., `Pokemon`, `Tutorial`
- **Files**: `kebab-case` - e.g., `pokemon-list.component.ts`, `pokemon.service.ts`
- **Variables/Methods**: `camelCase` - e.g., `pokemonList`, `getPokemon()`
- **Constants**: `UPPER_SNAKE_CASE` for configuration values
- **Boolean**: Prefix with `is`, `has`, `can`, `should` - e.g., `isLoading`, `hasError`

#### Import Order (Angular)
```typescript
// 1. Angular core imports
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 2. Angular common imports
import { FormsModule } from '@angular/forms';

// 3. Routing imports
import { RouterModule } from '@angular/router';

// 4. Third-party imports
import { Observable } from 'rxjs';

// 5. Project imports (absolute paths preferred)
import { Pokemon } from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
```

#### TypeScript Best Practices
- Always use explicit types for function parameters and return values
- Use `strict: true` in tsconfig.json (already enabled)
- Avoid `any` - use proper interfaces or `unknown`
- Use optional properties (`?`) when appropriate
- Enable strict templates in Angular (`strictTemplates: true`)

#### Component Structure
```typescript
@Component({
  selector: 'app-component-name',
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css']
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  // 1. Public properties (inputs/outputs)
  @Input() data: Type;
  @Output() event = new EventEmitter<Type>();

  // 2. Private properties
  private property: Type;

  // 3. Constructor (inject services)
  constructor(private service: Service) {}

  // 4. Lifecycle hooks
  ngOnInit(): void { }

  // 5. Public methods
  public method(): Type { }

  // 6. Private methods
  private helper(): void { }
}
```

### RxJS Patterns

- Always unsubscribe from observables (use `takeUntilDestroyed()` or `Subject`)
- Use proper error handling in subscriptions
- Use `async` pipe in templates when possible
- Debounce search inputs: `searchSubject.pipe(debounceTime(300), distinctUntilChanged())`

```typescript
// Correct subscription pattern
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### HTML Templates

- Use `async` pipe for observables: `*ngIf="data$ | async as data"`
- Use strict typing in templates
- Avoid complex logic in templates - move to component
- Use `(click)`, `(change)`, `(keyup)` for events

### CSS/Styling

- Use SCSS or plain CSS (component-scoped)
- Follow Bootstrap class naming conventions
- Avoid inline styles except for dynamic values
- Use CSS custom properties for theming

### Error Handling

```typescript
// Service error handling
this.http.get(url).subscribe({
  next: (data) => { /* success */ },
  error: (error) => {
    console.error('Error:', error);
    // Handle user-friendly error messages
  }
});

// Use proper HTTP status codes in backend
// 200: OK, 201: Created, 400: Bad Request, 404: Not Found, 500: Server Error
```

## Testing Guidelines

### Unit Tests (Jasmine/Karma)

```bash
# Run all tests
ng test

# Run single test file
ng test --include='**/pokemon-list.component.spec.ts'

# Run with watch
ng test --watch

# Run with coverage
ng test --code-coverage
```

### Test Structure
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let service: Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentName ],
      providers: [ Service ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    service = TestBed.inject(Service);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Database

### MongoDB Configuration
- Connection string in `node-express-mongodb-server/app/config/db.config.js`
- Default: `mongodb://admin:password@localhost:27017/bezkoder_db?authSource=admin`

### Docker for MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo
```

## API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tutorials` | Get all tutorials |
| GET | `/api/tutorials/:id` | Get tutorial by ID |
| POST | `/api/tutorials` | Create new tutorial |
| PUT | `/api/tutorials/:id` | Update tutorial |
| DELETE | `/api/tutorials/:id` | Delete tutorial |
| GET | `/api/tutorials?title=` | Search by title |

## External APIs

### PokeAPI
- Base URL: `https://pokeapi.co/api/v2`
- Endpoints: `/pokemon`, `/pokemon/{name}`, `/pokemon/{id}`
- No authentication required
- Rate limit: please cache locally when possible

## Notes

- This project was originally a tutorial CRUD app, expanded with Pokemon features
- Frontend runs on port 8081, backend on port 8080
- MongoDB must be running for backend to connect
- Use `ng lint` if ESLint is configured (not default in Angular 17)