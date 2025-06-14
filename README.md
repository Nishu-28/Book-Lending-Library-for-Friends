# BookLendingLibrary

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

## Features

- **User Authentication**: Login and logout functionality
- **Book Management**: Add, edit, and delete books
- **Borrowing System**: Request to borrow books, accept/reject requests
- **Borrow History**: Track all borrowing activity
- **Request Management**: Manage incoming borrow requests

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd book-lending-library
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication** (Email/Password)
3. **Enable Firestore Database**
4. **Get your Firebase config** from Project Settings > General > Your apps
5. **Copy the environment template**:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   ```
6. **Update the environment file** with your Firebase configuration:
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Replace `YOUR_PROJECT_ID` with your Firebase project ID
   - Replace other placeholder values with your actual Firebase config

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Security Notes

- **Environment files** (`environment.ts`, `environment.prod.ts`) are excluded from Git to protect API keys
- **Firestore security rules** are configured to allow authenticated users to read/write books and borrow requests
- **Authentication is required** for all book management operations

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
#   M i n i - C R M - f o r - F r e e l a n c e r s 
 
 