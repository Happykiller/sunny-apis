Great. I will perform a deep analysis of the GitHub project `https://github.com/Happykiller/sunny-apis` and produce a comprehensive, professional-grade `README.md` documentation file in English. It will include all standard sections (Project Overview, Features, Technologies, Installation, Usage, API Reference with curl examples, Contribution, License, etc.) and aim to be exhaustive for future internal use or export to other ChatGPT projects.
I'll let you know when the full documentation is ready.


# Sunny APIs

## Project Overview

**Sunny APIs** is a comprehensive backend framework built on NestJS that provides a suite of ready-to-use modules for common application needs. It offers out-of-the-box support for **authentication**, **authorization**, **user management**, **passwordless login (Passkeys/WebAuthn)**, and system utilities. The project is designed to accelerate development of secure API backends by encapsulating boilerplate functionality (like JWT auth, role-based access control, etc.) into reusable NestJS modules. These modules can be easily plugged into your NestJS application to provide robust features with minimal configuration.

Sunny APIs is structured as a collection of NestJS modules (Auth, AuthGuard, User, Passkey, System, Test, etc.) that can be imported and configured in your app. It integrates with both REST controllers and GraphQL resolvers, making it suitable for a variety of API styles. The framework emphasizes configurability and clean architecture – it uses an inversion-of-control container (Inversify) to decouple business logic and enable easy swapping of implementations (for example, using different database backends or fake data sources for testing).

In summary, Sunny APIs aims to provide a **professional-grade starting point** for backend services, covering essential features like user sign-up/login, authentication guards, role management, and more, so developers can focus on domain-specific logic rather than reinventing the basics.

## Key Features

* **User Authentication (JWT)** – Complete setup for user login and authentication using JSON Web Tokens. Includes services to validate user credentials and issue JWTs, plus middleware/guards to protect routes and GraphQL resolvers. Supports configurable token secrets and expirations.
* **Passwordless Login (WebAuthn Passkeys)** – Built-in support for WebAuthn (FIDO2) passkeys for two-factor or passwordless authentication. Modules handle registering security keys (e.g. biometric authenticators or hardware keys) and logging in with them. Under the hood it uses the `@passwordless-id/webauthn` library to generate and verify challenges, storing credential public data securely in the database.
* **Authorization & Role-Based Access Control** – Define user roles and protect API endpoints by role. Sunny APIs provides a flexible **Auth Guard** factory to create route guards for both HTTP REST endpoints and GraphQL resolvers. You can specify roles (e.g. *ADMIN*, *USER*, or *ALL* for any authenticated user) required for each route, and the guard will enforce JWT validation and role checks.
* **User Management** – A User module that manages user accounts, profile data, and relationships to authentication credentials. It provides services and API endpoints for common user operations (retrieve user info, update profile, change password, etc.). User data models (e.g. `UserDbModel`) and DTOs are included for consistency across different database backends.
* **Multi-Database Support** – The framework is designed to be storage-agnostic. It includes implementations for different database systems and can mix-and-match as needed:

  * **MySQL/SQL** – Support for MySQL (or other SQL databases) through provided SQL service classes (with raw queries or using drivers).
  * **MongoDB** – First-class support for MongoDB with provided services for common operations.
  * **In-Memory (Fake DB)** – A fake in-memory implementation for development or testing, allowing the app to run without any external database. This is useful for unit tests or mock environments.
    The database layer uses a **mixin** pattern: Sunny APIs defines abstract service interfaces and base behaviors, and these are combined with project-specific implementations. This allows easy switching of the data source (e.g., use fake DB in test, and real DB in production) with minimal code changes.
* **System Module (Application Metadata)** – A System module that can provide system information such as application version, environment, health status, etc. For example, it can expose an endpoint to fetch the current version of the API (the version is supplied via config at startup). This is useful for health checks or displaying API version info.
* **Testing & Development Utilities** – Includes a Test module intended for non-production use that helps with automated testing and development scenarios. For instance, in test mode you can use the in-memory database, and the Test module may provide endpoints to reset or seed data, or perform internal diagnostics. (The Test module is optional and can be omitted in production deployments.)
* **GraphQL Integration** – Fully compatible with NestJS GraphQL (Apollo). You can use Sunny APIs modules in a GraphQL API context. It provides decorators and guards to protect GraphQL resolvers, and can populate the GraphQL context with authenticated user info. For example, the `makeAuthGuard('graphql', [...])` guard can be applied to GraphQL resolvers to require authentication, and a `@CurrentSession()` decorator is available to inject the current user session into your resolver methods.
* **Extensible and Modular** – All features are encapsulated in NestJS modules. You only import what you need. Each module (`AuthModule`, `UserModule`, `PasskeyModule`, etc.) can be configured via `.forRoot()` static methods, making it easy to enable/disable or customize features. The design leverages dependency injection such that you can override components (for example, provide your own user service logic or use-case implementation via the Inversify container).
* **Security Best Practices** – Sunny APIs encourages secure defaults: passwords are intended to be stored hashed (crypto utilities are included for this purpose), JWTs are used with proper secret keys, CORS can be enabled easily, and WebAuthn provides a phishing-resistant login option. Role checks ensure only authorized access to sensitive routes. (Developers should still review and harden the configuration, e.g. choose strong secrets and HTTPS in production.)

## Technologies Used

Sunny APIs is built with a modern Node.js tech stack and leverages several popular libraries and standards:

* **Node.js & TypeScript** – Developed in TypeScript for type safety and clarity. Requires Node.js (recommend v16+).
* **NestJS** – Sunny APIs is essentially a collection of NestJS modules and uses many NestJS features:

  * NestJS Core and Common modules (for dependency injection, lifecycle, etc.)
  * NestJS GraphQL (Apollo) for GraphQL server support.
  * NestJS JWT & Passport for authentication strategies.
  * NestJS Guards, Interceptors, etc., for request handling (Sunny APIs provides custom guards via Nest’s `CanActivate` interface).
  * (Optionally) NestJS Schedule and Throttler modules if you use features like rate limiting or cron jobs (Sunny APIs includes these as dependencies for convenience).
* **Passport.js** – Used via `passport-jwt` strategy to handle JWT validation. The Auth module uses Passport under the hood to parse and validate Bearer tokens, although from a developer’s perspective this is mostly transparent – you interact with Nest’s guards.
* **JSON Web Tokens (JWT)** – Standard for stateless authentication. Used for issuing access tokens on login and authenticating subsequent requests. The `jsonwebtoken` library is used for signing and verifying tokens.
* **WebAuthn (FIDO2)** – Implemented using the `@passwordless-id/webauthn` package. This provides utilities to generate registration challenges and verify authentication assertions for passkeys. Sunny APIs wraps this to offer high-level endpoints for passkey registration and login.
* **Databases** – The library is database-agnostic, but it’s tested with:

  * **MySQL** (via `mysql2` driver) – Used in example projects for relational data.
  * **MongoDB** (via the official MongoDB Node driver) – Used in example projects for document data.
  * It does not enforce a specific ORM; instead, simple query execution and manual mapping are used (or you can integrate an ORM yourself on the side).
* **Inversify** – An inversion-of-control container for TypeScript/JavaScript. Sunny APIs uses an Inversify container instance to manage services and use-case classes. This is somewhat unique because NestJS has its own DI, but using Inversify allows Sunny APIs to remain decoupled from Nest’s container and integrate more seamlessly with external or domain-specific classes. You will pass an `inversify` instance into Sunny APIs modules so they can look up or register certain services.
* **Utility Libraries**:

  * **body-parser** for JSON parsing (automatically set up when using NestFactory).
  * **dotenv** for configuration via environment variables.
  * **crypto-js** for cryptographic functions (used for hashing, e.g. for password hashing or generating random challenges if needed).
  * **class-validator & class-transformer** for validating and transforming request DTOs (if Sunny APIs defines any DTO classes for inputs, these libraries apply decorators for runtime validation).
  * **Winston** for logging (NestJS can integrate with Winston; projects using Sunny APIs often use Winston for consistent logging, though Sunny APIs itself may not mandate it).
  * **Jest** for testing (if you run Sunny APIs’ tests or your app’s tests; the framework is designed to be test-friendly, e.g. via the fake DB module, and the example projects include a Jest setup).

**Note:** The specific version of Sunny APIs at the time of this writing is **v0.5.0**, which is compatible with NestJS 11.x and Apollo GraphQL 13.x. Ensure your project uses a matching NestJS version to avoid peer dependency issues.

## Installation

You can consume Sunny APIs as an NPM package (scoped under the `@happykiller` namespace) or use it directly from source.

**Prerequisites:** You should have a NestJS project already set up (initialized with `@nestjs/cli` or manually) and Node.js installed. Also, ensure your project has a package manager (npm or yarn) configured.

### Via NPM

The easiest way to get started is to install the package from NPM:

```bash
npm install @happykiller/sunny-apis --save
```

This will add Sunny APIs to your project’s dependencies. After installation, you can import the modules you need from `@happykiller/sunny-apis`.

<details>
<summary>**NPM Package Info**</summary>

* Package name: **`@happykiller/sunny-apis`**
* Current version: **0.5.0**
* License: MIT (see [License](#license) section).

The package is published under the `@happykiller` scope, so be sure to include the scope in the install command.

</details>

### From Source

Alternatively, if you want to develop or debug Sunny APIs itself, you can clone the GitHub repository:

```bash
git clone https://github.com/Happykiller/sunny-apis.git
```

Then install its dependencies and build it:

```bash
cd sunny-apis
npm install
npm run build
```

This will compile the TypeScript source to JavaScript (in the `dist/` directory). You can then link it into your project, for example:

```bash
# In the sunny-apis project directory
npm link

# In your own project directory
npm link @happykiller/sunny-apis
```

This will use your local copy of Sunny APIs in your project. (The example projects include scripts like `npm link @happykiller/sunny-apis` for this purpose.)

**Note:** When using from source, ensure the build output is up-to-date (re-run `npm run build` after making changes). Also, the repository might include a `package.json` for Sunny APIs itself to adjust if needed.

## Configuration Notes

Sunny APIs is designed to be configurable to fit your application’s needs. Configuration is typically provided to Sunny APIs modules via a configuration object and environment variables. Here are the key configuration aspects:

* **Application Config (`appConfig`):** This is a general configuration object for your app, which you pass into Sunny APIs. It often contains environment settings and other global config. For example, the `AuthGuardModule.forRoot()` expects an `appConfig` object, and the `SystemModule.forRoot()` expects an object with application version. Typically, `appConfig` might include:

  * `env` – An environment info object, e.g. `{ mode: 'dev' | 'prod' | 'test', port: 3000, ... }`. Sunny APIs might use `env.mode` to decide whether to enable test data, or which DB to use (e.g. `'mock'` mode might use in-memory DB).
  * `jwt` – JWT configuration, see below.
  * Other sections as needed (for example, you might include `db` settings, or pass the entire `.env` config).
* **JWT Config (`jwtConfig`):** The Auth module requires JWT settings. This usually includes:

  * `secret` – A secret key string for signing JWT tokens. **Ensure this is set to a strong random value in production**, typically via an environment variable (e.g. `JWT_SECRET`). Without a secret, token signing/verification will not work.
  * `expiresIn` – Token expiration time (e.g. `'1h'` for 1 hour, or `'60s'`).
  * Optionally, `issuer`, `audience`, or other JWT options as needed.
* **Database Connections:** Sunny APIs will use whatever database connections you provide. For example, if using MySQL, you should create a MySQL connection pool (using `mysql2` or TypeORM or any method) and pass it to the relevant service. If using MongoDB, create a MongoDB client or connection. There are a couple of ways these connections are supplied:

  * **Via Inversify Container:** A common pattern (used in the example projects) is to register your DB connection or repository in an Inversify container and then pass that container to Sunny APIs. For instance, you might bind a symbol like `DatabaseConnection` or directly bind a service class that Sunny APIs calls. The Sunny APIs modules can retrieve these from the container as needed.
  * **Via Config:** Alternatively, you can include connection instances in the config object. For example, you might do `appConfig.db = { pool: mysqlPool, mongoClient: client }` and Sunny APIs could use those. The library’s design is flexible; you just need to ensure that when a Sunny APIs service tries to query the database, it has access to a working connection. (See *Development & Deployment* for more on setting up the container.)
* **WebAuthn (Passkey) Config:** Using passkeys may require specifying your application’s relying party details:

  * **Relying Party ID and Name:** By default, the library might use the server’s domain as the RP ID. You can explicitly set it if needed (e.g., `RP_ID=myapp.com` and `RP_NAME="My App"` in environment). These would tell the WebAuthn library what domain to associate keys with.
  * **Origins:** If the server is accessed via multiple origins (e.g., dev localhost and production domain), you may need to configure accepted origins for WebAuthn.
  * **Credential Limits:** Optionally, config could specify timeouts or authenticator attachment preferences. (Sunny APIs likely uses library defaults unless overridden.)
* **Other Environment Variables:** Sunny APIs itself doesn’t mandate many env vars, but the example usage suggests:

  * Standard NestJS env setup (NODE\_ENV to set environment mode).
  * Database connection strings or credentials (if connecting to a database).
  * Ports, hostnames, etc.
  * Any third-party API keys if relevant (Sunny APIs doesn’t include external integrations by default, but if you extend it, you might include in config).
* **CORS and Body Parser:** In your NestJS bootstrap (main.ts), you should enable CORS and body parsing as needed. Sunny APIs does not automatically do this for you, but it’s shown in examples that you should configure it:

  ```typescript
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(bodyParser.json({ limit: '50KB' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50KB' }));
  ```

  Adjust as appropriate (CORS origins, body size limits, etc. for file uploads).
* **Auth Guard Factory Setup:** One important configuration step: call `configureAuthGuardFactory()` **before** your application starts listening. This function (provided by Sunny APIs) needs to be called once to inject the necessary dependencies into the Auth Guard logic. For example, in your `main.ts`:

  ```typescript
  import { configureAuthGuardFactory } from '@happykiller/sunny-apis';

  // ... inside bootstrap function, after creating the Nest app:
  configureAuthGuardFactory({
    inversify,
    appConfig: config,
  });
  ```

  This ensures the internal Auth Guard knows about your Inversify container and config (needed to, for instance, fetch user info during authentication). Do this before `app.listen()`.
* **Module Initialization:** When importing Sunny APIs modules in your AppModule, pass in the required config. For example:

  ```typescript
  AuthModule.forRoot({
    jwtConfig: config.jwt,
    appConfig: config,
    inversify,
  }),
  PasskeyModule.forRoot({
    inversify,
    // you might also pass appConfig or other options if required
  }),
  SystemModule.forRoot({
    version: config.version,
    inversify,
  }),
  // etc.
  ```

  Ensure you include all required fields as shown in the code above (the exact keys depend on the module, see examples in next section).

**Configuration Example:**

Suppose you use a `.env` file for secrets and DB strings. An example `.env` might include:

```
NODE_ENV=prod
JWT_SECRET=superSecretKey123!    # secret for JWT
JWT_EXPIRES=1h                   # token expiry
DB_HOST=localhost
DB_PORT=3306
DB_USER=sunny
DB_PASS=pa$$w0rd
DB_NAME=sunnyapp
RP_NAME="Sunny Application"
RP_ID=myapp.example.com
```

Your application config assembly (in a config service or just a plain object) might do:

```typescript
const config = {
  env: {
    mode: process.env.NODE_ENV,
    port: parseInt(process.env.PORT) || 3000
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES || '1h'
  },
  db: {
    host: process.env.DB_HOST,
    ... // and so on for database, if needed
  },
  webauthn: {
    rpName: process.env.RP_NAME,
    rpId: process.env.RP_ID
  }
};
```

And then use `config` when initializing Sunny APIs modules. This approach keeps sensitive info out of code and in environment variables.

## How to Use Sunny APIs in Your Project

Integrating Sunny APIs into a NestJS project involves a few steps: installing the package (as covered above), setting up an Inversify container (optional but recommended for full functionality), importing the modules in your `AppModule`, and then using the provided decorators/guards in your controllers or resolvers. Below is a step-by-step guide with examples.

### 1. Set Up Inversify Container (Dependency Injection)

Sunny APIs expects an Inversify container instance to be passed in. This container will hold instances of your services or use-cases that Sunny APIs might call. It also allows Sunny APIs to register its own services if needed.

**Why Inversify?** It allows decoupling from Nest’s own DI and makes it easier to test or use outside Nest context. For instance, you might have domain services (e.g., `UserUsecase`, `AccountUsecase`) bound in Inversify. Sunny APIs modules can call `inversify.get<UserUsecase>('UserUsecase')` to perform certain actions (this is conceptual – exact keys depend on your setup).

**Basic Setup:**

Install Inversify (`npm install inversify reflect-metadata`) if not already. Then, create a container and bind your classes:

```typescript
import 'reflect-metadata';
import { Container } from 'inversify';
import { UserUsecase } from './usecases/user.usecase';
import { DatabaseService } from './services/database.service';
// ... other imports

const inversify = new Container();

// Bind usecase and service classes to the container
inversify.bind<UserUsecase>('UserUsecase').to(UserUsecase).inSingletonScope();
inversify.bind<DatabaseService>('DatabaseService').to(DatabaseService).inSingletonScope();

// You can bind values too, e.g. DB connection pool or config
inversify.bind('MysqlPool').toConstantValue(mySqlPoolInstance);
```

This container instance (`inversify`) will be passed to Sunny APIs. Sunny APIs modules might require certain bindings to exist:

* For example, the AuthModule might expect to retrieve a user service or user usecase to validate credentials.
* The PasskeyModule might use a user repository or the same user service to link passkeys to users.
* The UserModule might call a `UserUsecase` for operations like retrieving or updating user info.

**Note:** The exact bindings required by Sunny APIs are documented (see module-specific notes below). If a required binding is missing, you may get runtime errors when calling certain operations. For default setups:

* A binding for something like `'UserUsecase'` or `'UserService'` that can fetch users by credentials is often needed (used during login to verify password).
* A binding for `'DatabaseService'` or similar might be used by test or system modules to perform low-level operations.
* However, many operations use the database layer internally defined in Sunny APIs, so you might not need to bind those explicitly.

Once your container is ready, **provide it to Nest** so that it can be injected. One approach is to provide it as a constant value in your AppModule:

```typescript
import { Module } from '@nestjs/common';
import { AuthModule, AuthGuardModule, UserModule, PasskeyModule, SystemModule, TestModule } from '@happykiller/sunny-apis';
import { inversify } from './inversify.config';  // container created as above
import { ConfigModule } from '@nestjs/config';   // if using Nest Config

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // just an example if using Nest Config
    // Sunny APIs modules
    AuthGuardModule.forRoot({
      appConfig: config,         // your config object
      inversify: inversify
    }),
    AuthModule.forRoot({
      jwtConfig: config.jwt,
      appConfig: config,
      inversify: inversify
    }),
    UserModule.forRoot({
      inversify: inversify
      // (could pass more if UserModule accepts additional options)
    }),
    PasskeyModule.forRoot({
      inversify: inversify
      // (pass config if needed for passkeys)
    }),
    SystemModule.forRoot({
      version: config.env.version || config.version,  // supply version string
      inversify: inversify
    }),
    TestModule, // no config needed in our case (include only in non-prod env)
    // ...your own feature modules
  ],
  controllers: [/* your controllers if any */],
  providers: [
    { provide: 'Inversify', useValue: inversify }  // make it injectable in Nest
  ]
})
export class AppModule {}
```

In the above:

* We import the Sunny APIs modules needed and call `.forRoot` on those that require initialization.
* We pass the `inversify` container and relevant parts of our config.
* We register the container in the Nest providers (so that inside any Nest-managed class we can `@Inject('Inversify')` to get it, if needed – Sunny APIs does this internally for some of its components).

Now, when Nest boots, Sunny APIs modules will be initialized. For example, `AuthModule.forRoot()` might set up the JWT strategy with your secret, and `AuthGuardModule.forRoot()` will configure the global guard behavior.

### 2. Initialize Auth Guard Factory in `main.ts`

As mentioned in **Configuration**, one crucial step after creating your Nest application is to call `configureAuthGuardFactory()`. This ensures the authentication guard (used for protecting routes) is properly configured with your container and config.

In your `src/main.ts`:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up global pipes/filters if any (optional)
  // e.g., app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configure the AuthGuard factory for Sunny APIs
  configureAuthGuardFactory({
    inversify: inversify,      // your container instance
    appConfig: config          // your config object
  });
  
  app.enableCors();
  app.use(bodyParser.json({ limit: '50KB' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50KB' }));
  
  await app.listen(config.env.port || 3000);
}
bootstrap();
```

This should be done **before** any requests are handled (so right after creating the app, before `listen()`). It effectively primes Sunny APIs’ internal guard with the data it needs. If you skip this, the auth guards (`makeAuthGuard`) may not know how to fetch your user data and will likely throw an error or fail to authenticate requests.

### 3. Use Provided Guards, Decorators, and Services

Once Sunny APIs is integrated, you can use its functionalities in your controllers or resolvers. Here are some examples:

**Protecting a REST Endpoint (Controller) with Auth Guard:**

```typescript
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { makeAuthGuard, USER_ROLE } from '@happykiller/sunny-apis';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  // Protect this route so that only admins can access
  @Get('stats')
  @UseGuards(makeAuthGuard('http', [USER_ROLE.ADMIN]))
  getStatistics(@Req() req: Request) {
    // If we reach here, the user is authenticated and has ADMIN role.
    // You can retrieve user info from req (for HTTP, Sunny APIs attaches the decoded user token to the request).
    const user = req['user']; // typically where Nest attaches it, if using Passport strategy
    return this.adminService.getStats();
  }
}
```

In the above:

* `makeAuthGuard('http', [USER_ROLE.ADMIN])` produces a guard that will check the JWT in the HTTP request and ensure the user’s role is ADMIN. If the user is not authenticated or not an admin, a 401/403 response is returned automatically. The `USER_ROLE` constants are provided by Sunny APIs to avoid magic strings/numbers for roles.
* If the guard passes, you can access `req.user` (for HTTP context) – this will be the decoded JWT payload (Sunny APIs attaches it similarly to Passport’s `AuthGuard` behavior). This typically contains the user’s id, role, and any other info you put into the token.
* For convenience, Sunny APIs might also provide a `CurrentSession` decorator for REST (similar to the one for GraphQL) to directly inject the user session info.

**Protecting a GraphQL Resolver with Auth Guard:**

```typescript
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { makeAuthGuard, USER_ROLE, CurrentSession, UserSession } from '@happykiller/sunny-apis';

@Resolver()
export class UsersResolver {

  constructor(private readonly userService: UserService) {}

  // Only authenticated users (any role) can query their profile
  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ALL]))
  @Query(() => UserProfileType)
  me(@CurrentSession() session: UserSession) {
    const userId = session.id;
    return this.userService.findById(userId);
  }

  // Only admins can query all users
  @UseGuards(makeAuthGuard('graphql', [USER_ROLE.ADMIN]))
  @Query(() => [UserProfileType])
  allUsers() {
    return this.userService.findAll();
  }
}
```

Explanation:

* We use `makeAuthGuard('graphql', [USER_ROLE.ALL])` to require that the user is logged in (role “ALL” typically means any authenticated user) for the `me` query. Sunny APIs will automatically extract the JWT from the GraphQL context (it expects the `Authorization` header to be forwarded, which in our AppModule GraphQL config we did by copying headers in context).
* The `@CurrentSession()` decorator (from Sunny APIs) is used to inject the current user’s session into the resolver. The `UserSession` is a type that Sunny APIs defines, typically containing at least the user’s `id` and `role`, possibly other fields like `email` if included in token. Using this avoids having to manually parse `context` in every resolver. In our example, we get `session` and then use the user id from it.
* For the `allUsers` query, we only allow admins by specifying `[USER_ROLE.ADMIN]`. If a non-admin calls this, the guard will deny access.

**Using Sunny APIs Services:**

Sunny APIs also provides certain services and methods you can use directly if needed. For instance:

* The **AuthModule** likely provides an `AuthService` that has methods like `login(credentials)` or `validateUser(username, password)` and `generateToken(user)`. You can inject `AuthService` from Sunny APIs if you need to call these (though typically, the library’s controllers handle login for you).
* The **UserModule** may provide a `UserService` with methods like `findById`, `createUser`, `updateUser`, etc. This might be accessible via the Inversify container or via Nest injection (Sunny APIs might register it as a provider).
* The **PasskeyModule** likely provides a `PasskeyService` to initiate and verify WebAuthn flows. For example, it might have `generateRegistrationOptions(user)` and `verifyRegistrationResult(user, result)` methods. In many cases, you won’t call these directly if you use the built-in controllers, but you could for custom flows.
* **Utilities:** There are utility functions like `applyMixins` (used internally to compose DB services), and constants like `ERRORS` or common DTO classes for request/response data. If needed, you can import these from the package.

In practice, many apps using Sunny APIs won’t need to directly call its services; they will rely on the provided endpoints. But the option exists if you need to extend or customize behavior (e.g., wrap the AuthService to implement a custom login flow).

## API Reference

Sunny APIs exposes multiple API endpoints (primarily RESTful endpoints, plus some GraphQL operations) through its various modules. Below is a comprehensive reference for each category of functionality, along with example `curl` commands to demonstrate usage.

**Note:** The exact URL paths assume you are using the default controllers provided by Sunny APIs. By default, the controllers are likely prefixed logically (for example, AuthController under `/auth`, UserController under `/users`, etc.). These are the assumed routes; if you have customized the controllers or disabled some modules, adjust accordingly. Also, ensure your server host/port is correct in the examples (here we assume `localhost:3000`).

### Authentication Endpoints (Password-based)

These endpoints handle traditional username/password authentication and token issuance.

* **Login** – Authenticate a user with credentials and obtain a JWT token.

  **URL:** `POST /auth/login`
  **Description:** Verifies the user's email/username and password. If valid, returns an access token (JWT) along with basic user info. The token should be included in subsequent requests for protected resources (e.g., via the `Authorization: Bearer <token>` header).
  **Request Body:** JSON object with user credentials. For example:

  ```json
  {
    "email": "user@example.com",
    "password": "PlaintextOrHashedPassword"
  }
  ```

  (*Note:* replace `"email"` with `"username"` or appropriate field if your app uses usernames. Sunny APIs supports either, depending on how the user data is set up. By default, a `mail` or `code` field can be used for login – see configuration if you want to switch login identifier.)

  **Response:** On success, HTTP 200 with JSON:

  ```json
  {
    "token": "<JWT_TOKEN_STRING>",
    "user": {
       "id": 42,
       "email": "user@example.com",
       "name": "John Doe",
       "role": "USER"
       // ... any other user fields minus sensitive info like password
    }
  }
  ```

  The exact fields may vary – at minimum you get the JWT (`token`). The `user` object may contain the user’s profile info. The JWT is typically a signed token containing the user’s ID, role, and maybe a few other claims (it’s not advisable to include sensitive data in the token).

  **Errors:**

  * 401 Unauthorized if credentials are invalid. Response may include `{ "message": "Invalid credentials" }` (or a similar generic error).
  * 400 Bad Request if the input format is wrong.

  **Example CURL:**

  ```bash
  curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "user@example.com", "password": "myPassword"}'
  ```

  (If login is successful, you will receive the token in response.)

* **Register** – Create a new user account.

  **URL:** `POST /auth/register` (or possibly `POST /users`, depending on implementation)
  **Description:** Registers a new user in the system. This endpoint may be open (for self-signup) or secured (admin-only, to manually create users) depending on your configuration. It will typically:

  * Validate that the email/username is not already in use.
  * Hash the password (Sunny APIs uses hashing for passwords; ensure you have configured the hashing mechanism, e.g., using crypto-js or bcrypt).
  * Save the new user to the database.
  * (Optionally) send verification email or other post-signup action – note, Sunny APIs does not include email verification out-of-the-box; you’d implement that separately if needed.

  **Request Body:** JSON object with user details. For example:

  ```json
  {
    "email": "newuser@example.com",
    "password": "somePassword",
    "name_first": "New",
    "name_last": "User"
  }
  ```

  The exact fields depend on your user model. By default, Sunny APIs user model includes fields like first name, last name, email, etc., and possibly a username code. Include the required ones (at least email & password).

  **Response:** On success, HTTP 201 Created. It may return the created user object (sans password). Or it might simply return a success message. In some configurations, it could also directly return a JWT (logging the user in immediately after registration).

  **Errors:**

  * 400 if required fields are missing or invalid.
  * 409 Conflict if the email/username is already taken.
  * 500 for unexpected server errors.

  **Example CURL:**

  ```bash
  curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"newuser@example.com","password":"P@ssw0rd","name_first":"New","name_last":"User"}'
  ```

  *(Adjust field names as appropriate. If registration is restricted, ensure you have an admin token or that the endpoint is accessible.)*

* **Refresh Token** – *(If implemented)* Refresh an expired or expiring JWT.

  **URL:** `POST /auth/refresh`
  **Description:** Issues a new JWT given a valid refresh token. Sunny APIs 0.5.0 does not explicitly mention refresh tokens, so this may not be available by default. If you implemented refresh logic, you would call this with a refresh token (usually stored in httpOnly cookies or provided in the body) to get a new access token.

  **Request Body:** If using cookies, maybe none (just send cookie). If using body, something like `{ "refreshToken": "<token>" }`.

  **Response:** HTTP 200 with new JWT (and possibly a new refresh token).

  **Errors:** 401 if refresh token is invalid or expired.

  **Example CURL:** *(Assuming refresh token in body)*

  ```bash
  curl -X POST http://localhost:3000/auth/refresh \
    -H "Content-Type: application/json" \
    -d '{"refreshToken": "<your_refresh_token>"}'
  ```

  *If Sunny APIs does not implement refresh by default, you can ignore this endpoint or implement your own refresh mechanism if needed.*

* **Logout** – *(Not always needed on server)*

  **URL:** e.g. `POST /auth/logout`
  **Description:** Invalidates the user’s session/token. In JWT stateless auth, logout is typically handled client-side (just delete the token). If using refresh tokens or server session, you might implement a logout to invalidate the refresh token in the database. If Sunny APIs uses purely stateless JWT, it might not have a logout endpoint. If it does, it could simply be a placeholder that the client calls to remove cookies.

  **Example:** Not applicable unless you manage sessions. For completeness:

  ```bash
  curl -X POST http://localhost:3000/auth/logout -H "Authorization: Bearer <token>"
  ```

  would effectively tell the server to invalidate that token (if server tracks it). If stateless, the server can just respond 200 and the client will delete its stored token.

### User Management Endpoints

These endpoints allow management of user accounts and profiles. They are typically part of the **UserModule**, and might be under an `/users` or `/user` route prefix.

* **Get Current User Profile** – Retrieve the profile of the currently authenticated user.

  **URL:** `GET /users/me`
  **Auth:** Requires a valid JWT (user must be logged in).
  **Description:** Returns the profile information of the user making the request, identified by the JWT. This is useful for displaying account info or preferences. It calls the underlying user service to fetch the data from DB.

  **Response:** HTTP 200 with user JSON, for example:

  ```json
  {
    "id": 42,
    "code": "user42",         // a username or code
    "mail": "user@example.com",
    "name_first": "John",
    "name_last": "Doe",
    "description": "Bio or about me",
    "role": "USER",
    "active": true,
    "creation": "2024-01-10T12:00:00Z",
    "modification": "2025-05-01T08:30:00Z"
  }
  ```

  (These fields correspond to the user model columns. For instance, `code` might be a unique username, `mail` is email, etc. Password is **not** included for security reasons.)

  **Errors:** 401 if no valid token provided.

  **Example CURL:**

  ```bash
  curl -X GET http://localhost:3000/users/me \
    -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
  ```

* **Get User by ID** – Retrieve another user’s profile (admin only).

  **URL:** `GET /users/{id}`
  **Auth:** Requires JWT, and likely requires admin role (only admins should fetch arbitrary users by ID).
  **Description:** Fetches the user profile for the user with the given ID. Useful for admin panels or services that need user info by ID.

  **Response:** HTTP 200 with user JSON (same format as above) if user exists and the caller has permission. If the user is not found, it might return 404. If the caller is not authorized, 403.

  **Example CURL (as admin):**

  ```bash
  curl -X GET http://localhost:3000/users/15 \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
  ```

* **List Users** – Get a list of all users (admin only).

  **URL:** `GET /users`
  **Auth:** Admin role likely required.
  **Description:** Returns a list of users in the system. May support query parameters for pagination or filtering (e.g., `?active=true` to list only active users, etc.), depending on implementation.

  **Response:** HTTP 200 with JSON array of user profiles. Possibly in the format:

  ```json
  [
    { "id": 1, "mail": "alice@example.com", "name_first": "Alice", "role": "ADMIN", ... },
    { "id": 2, "mail": "bob@example.com", "name_first": "Bob", "role": "USER", ... },
    // ...
  ]
  ```

  Large lists might be paginated with additional fields like `totalCount` or `nextPage` etc., if implemented.

  **Example CURL:**

  ```bash
  curl -X GET http://localhost:3000/users -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
  ```

* **Create User** – Create a new user (admin-triggered).

  **URL:** `POST /users`
  **Auth:** Admin required (to create accounts for others).
  **Description:** Similar to **Register** above, but intended for administrators to create accounts. Input and output are similar to the register endpoint, but this one is restricted to admins.

  **Request Body:** JSON with user details (see Register). Admin could also set the role in this request (if allowed by API).

  **Response:** HTTP 201 with the created user object (or some success message).

  **Example CURL:**

  ```bash
  curl -X POST http://localhost:3000/users \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"email":"someone@example.com","password":"TempPass123","role":"USER","name_first":"Some","name_last":"One"}'
  ```

* **Update User** – Update user details.

  **URL:** `PUT /users/{id}` (or `PATCH /users/{id}`)
  **Auth:**

  * The user themselves can likely update some of their info (e.g., change their name, password) – allowed for same user ID.
  * Admins can update any user’s info (e.g., to activate/deactivate accounts, change roles).
    **Description:** Updates the user’s data with provided fields. Usually, not all fields are editable by everyone:
  * Users might be allowed to update profile fields (name, email) and password.
  * Only admins might update roles or activation status.
    The API should validate and ignore/forbid changes to restricted fields if the caller isn’t allowed.

  **Request Body:** JSON with fields to update. E.g.

  ```json
  { 
    "name_first": "Johnny",
    "description": "Updated bio",
    "password": "NewPassword123"  // if changing password
  }
  ```

  (If using PATCH, you’d send only fields to change; with PUT maybe full user object or partial if supported.)

  **Response:** HTTP 200 with updated user object (or 204 No Content). Password changes typically don’t return the password (obviously).

  **Example CURL (user changing their name):**

  ```bash
  curl -X PUT http://localhost:3000/users/42 \
    -H "Authorization: Bearer <USER_JWT_TOKEN_FOR_ID_42>" \
    -H "Content-Type: application/json" \
    -d '{"name_first": "Johnny"}'
  ```

* **Deactivate/Delete User** – Disable a user account.

  **URL:** `DELETE /users/{id}`
  **Auth:** Admin (or user themselves if account deletion is allowed).
  **Description:** Marks a user as inactive (soft delete) or deletes the record. Sunny APIs uses an `active` flag in the database, so this endpoint likely sets `active=false` for the user instead of fully removing the row (to preserve data integrity). An inactive user cannot log in or be used in auth.

  **Response:** Could be 200 with a message, or 204 on success. After this, any auth token for that user should be considered invalid (Sunny APIs would presumably check `active` status on login or guard).

  **Example CURL:**

  ```bash
  curl -X DELETE http://localhost:3000/users/42 \
    -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
  ```

  If user 42 was the one making the call and self-deletion is allowed, they could use their own token, but usually account self-deletion would be a separate flow (and likely require re-auth or confirmation).

### Passkey (WebAuthn) Endpoints

These endpoints are provided by the **PasskeyModule** and allow users to register and use passkeys (security keys or platform authenticators) for logging in. There are typically a pair of endpoints for registration and a pair for login (because WebAuthn is a two-step process: **generate challenge** → **verify response**).

**Prerequisites:** The user’s browser must support WebAuthn (most modern browsers do), and the front-end must handle calling the WebAuthn APIs (`navigator.credentials.create()` for registration and `navigator.credentials.get()` for authentication). The endpoints below interact with that process.

* **Begin Passkey Registration** – Get challenge and options for registering a new passkey.

  **URL:** `GET /auth/passkey/register/options`
  **Auth:** **Required** – the user must already be logged in via password (or existing method) to add a passkey to their account. You should include the JWT token in this request. (This ensures the passkey will be linked to the correct user.)

  **Description:** This endpoint generates a **registration challenge** and options that the front-end needs to call the WebAuthn API for creating a new credential. Sunny APIs will use the WebAuthn library to create this challenge. It will typically include:

  * A random challenge (base64 or hex string).
  * RP (Relying Party) ID and name (your app’s domain and name).
  * The user’s info (an ID and name or display name to show on authenticator).
  * Parameters like allowed authenticator types, etc.
    Sunny APIs may also save the challenge on the server side (perhaps temporarily in memory or in a database) so it can verify the response later.

  **Response:** HTTP 200 with a JSON containing the options for credential creation. For example:

  ```json
  {
    "challenge": "CmVhLmIy...K2p5MQ",   // base64 challenge
    "rp": { "name": "Sunny Application", "id": "myapp.example.com" },
    "user": { "id": "42", "name": "user@example.com", "displayName": "John Doe" },
    "pubKeyCredParams": [ { "alg": -7, "type": "public-key" }, ... ],
    "attestation": "preferred",
    "timeout": 60000,
    "excludeCredentials": [ ... ]   // maybe existing credentials to avoid duplicates
  }
  ```

  This is directly consumable by the WebAuthn API on the client side. Your front-end would do something like:

  ```js
  const options = await fetch('/auth/passkey/register/options', { headers: {Authorization: `Bearer ${token}`} }).then(r=>r.json());
  options.challenge = base64ToArrayBuffer(options.challenge);
  options.user.id = new TextEncoder().encode(options.user.id);
  const credential = await navigator.credentials.create({ publicKey: options });
  ```

  *(The above front-end code is illustrative: converting challenge to ArrayBuffer, etc., are required because the WebAuthn API expects binary data. Sunny APIs likely provides base64, and you handle conversion on front-end.)*

  **Errors:** 401 if user not authenticated. Possibly 500 if challenge generation fails.

  **Example CURL:** (This is mainly for debugging; typically a browser calls this)

  ```bash
  curl -X GET http://localhost:3000/auth/passkey/register/options \
    -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
  ```

  You should see the challenge options JSON.

* **Complete Passkey Registration** – Verify the authenticator’s response and register the passkey.

  **URL:** `POST /auth/passkey/register`
  **Auth:** Required (same user flow as above).
  **Description:** This endpoint is called after the user successfully uses their authenticator to create a credential. The client will receive a `credential` object from `navigator.credentials.create()`, which contains an **attestation** (the public key and other metadata, signed by the device). The client must send this attestation to the server for verification.

  Sunny APIs will take the attestation, verify it using the challenge (that was generated earlier) and the WebAuthn library, and if valid, store the credential in the database. Specifically, it will save the credential’s public key, an identifier (credential ID), and possibly user-friendly label for the device.

  **Request Body:** JSON with the credential response from the browser. It typically looks like:

  ```json
  {
    "id": "NgGh...BA",  // credential ID (base64)
    "rawId": "NgGh...BA", // rawID in base64 (same as id usually but as ArrayBuffer originally)
    "response": {
        "attestationObject": "o2NmbX...VE",  // base64 attestation object
        "clientDataJSON": "eyJ0eXAi...IgfQ=="  // base64 client data JSON
    },
    "type": "public-key",
    "clientExtensionResults": {}
  }
  ```

  Additionally, you might include a `label` field for the device name, if your API expects it separate. Sunny APIs' DB model for passkeys has a `label`, so you can let the user provide a nickname for their key (e.g., "My YubiKey" or "Chrome on MacBook"). If so, structure could be:

  ```json
  {
    "credential": { ... above fields ... },
    "label": "My Security Key"
  }
  ```

  **Response:** On success, HTTP 201 Created (or 200 OK). The response might contain the newly registered passkey info, for example:

  ```json
  {
    "message": "Passkey registered successfully",
    "passkey": {
       "id": 10,
       "user_id": 42,
       "user_code": "user42",
       "label": "My Security Key",
       "hostname": "myapp.example.com",
       "created_at": "2025-05-18T15:30:00Z"
    }
  }
  ```

  The `passkey` object could be the record from the DB (which would include the credential ID and public key internally, though those might not be exposed in plaintext). You may not need to use this response on the client, except to confirm success.

  **Errors:** 400 if the payload is malformed or verification fails (e.g., wrong challenge, or attacker replay, etc.). In that case you might get `{ "message": "Passkey registration failed" }`. 401 if not authenticated.

  **Example CURL:**
  (It’s difficult to do via curl because the data is binary and base64; usually the front-end JS will call this.) For illustration:

  ```bash
  curl -X POST http://localhost:3000/auth/passkey/register \
    -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
          "id": "NgGh...BA",
          "rawId": "NgGh...BA",
          "response": { "attestationObject": "...", "clientDataJSON": "..." },
          "type": "public-key",
          "label": "My Security Key"
        }'
  ```

  The base64 strings are typically very long; this example is truncated.

* **Begin Passkey Login (Assertion)** – Get a challenge to login with a passkey.

  **URL:** `GET /auth/passkey/login/options?userId={id_or_code}`
  **Auth:** Not required (this is for logging in, user might not have a token yet).
  **Description:** This endpoint starts the login process using a passkey. The client should supply an identifier for the user trying to log in – either a user ID or username/email. (Providing this helps the server fetch that user’s registered passkeys.) The endpoint will:

  * Look up the user by the provided identifier.
  * Retrieve that user’s registered passkeys (public credential IDs) from the database (Sunny APIs provides `getPasskeyByUserId` for this).
  * Generate a login challenge and create an **assertion options** object that includes the challenge and the allowed credentials (the credential IDs of the user’s passkeys).

  **Request Query:** You might provide `userId=42` or `username=user42` or `email=user@example.com` as a way to identify the user. The exact query param depends on implementation – it could simply be `?user=user@example.com` or `?code=user42`. Ensure it’s something that the server can map to a single user.

  **Response:** HTTP 200 with assertion options, for example:

  ```json
  {
    "challenge": "ABCD...1234",  // base64 challenge
    "rpId": "myapp.example.com",
    "allowCredentials": [
      { "id": "NgGh...BA", "type": "public-key" },
      { "id": "AHJk...77==", "type": "public-key" }
    ],
    "timeout": 60000,
    "userVerification": "preferred"
  }
  ```

  The front-end will use this to call `navigator.credentials.get({ publicKey: options })`. For example:

  ```js
  const options = await fetch('/auth/passkey/login/options?user=user42').then(r=>r.json());
  options.challenge = base64ToArrayBuffer(options.challenge);
  options.allowCredentials = options.allowCredentials.map(cred => ({ ...cred, id: base64ToArrayBuffer(cred.id) }));
  const assertion = await navigator.credentials.get({ publicKey: options });
  ```

  If the user has multiple credentials (e.g., multiple devices), all are listed in `allowCredentials`. The authenticator (e.g., security key) will likely prompt the user and then produce an assertion.

  **Errors:** 404 if user not found for given identifier. 400 if no identifier provided. 500 on server error.

  **Example CURL:**

  ```bash
  curl -X GET "http://localhost:3000/auth/passkey/login/options?user=user@example.com"
  ```

  (No auth header needed. The query param here is `user` and value is the email; adjust based on actual implementation.)

* **Complete Passkey Login** – Verify the authenticator’s assertion and log the user in.

  **URL:** `POST /auth/passkey/login`
  **Auth:** No existing token required (this will log you in and issue a token).
  **Description:** This endpoint is called with the result from the authenticator after calling `navigator.credentials.get()`. It verifies the signature using the stored public key for the credential and the challenge. On success, it will create a JWT token for the user (just like a normal login) and return it, effectively logging the user in.

  **Request Body:** JSON with the assertion response from the client, e.g.:

  ```json
  {
    "id": "NgGh...BA",  // credential ID used
    "rawId": "NgGh...BA",
    "response": {
      "authenticatorData": "SZYN...Q==",  // base64 authenticator data
      "clientDataJSON": "eyJjaGFsb...IgfQ==",
      "signature": "MEUCIF...AQI=",
      "userHandle": "42"
    },
    "type": "public-key"
  }
  ```

  The fields:

  * `authenticatorData`: Data from device (contains info like whether user was present, signature counter, etc.).
  * `clientDataJSON`: Contains the challenge and origin, to be verified.
  * `signature`: The signature of authenticatorData and clientData by the device’s private key.
  * `userHandle`: This is an opaque handle that identifies the user on the device; Sunny APIs might or might not use it (often it's the user ID as a string or binary).

  The server (Sunny APIs) will:

  * Find the stored credential by ID (using `getPasskey` by credential\_id).
  * Retrieve the public key and expected parameters from the stored credential (`registration` data).
  * Verify that the signature is valid for the challenge (the challenge originally issued in login options, which should match what's in clientDataJSON) and the public key.
  * If valid, identify the user associated with that credential.
  * Issue a JWT token for that user (like in normal login).
  * Possibly update some metadata (like a usage counter for the credential, if implemented, to prevent replay).

  **Response:** HTTP 200 with a result similar to login:

  ```json
  {
    "token": "<JWT_TOKEN_STRING>",
    "user": {
       "id": 42,
       "email": "user@example.com",
       "name": "John Doe",
       "role": "USER"
       // ...
    }
  }
  ```

  Now the user is authenticated. The client should store the token (or set it as needed, e.g., in a cookie or local storage) for subsequent requests.

  **Errors:** 401 if verification fails (invalid signature or challenge). 400 if payload missing fields. 404 if credential not recognized (which could mean credential was removed or not found).

  **Example CURL:** (Again, normally the browser JS sends this after obtaining assertion)

  ```bash
  curl -X POST http://localhost:3000/auth/passkey/login \
    -H "Content-Type: application/json" \
    -d '{
          "id": "NgGh...BA",
          "rawId": "NgGh...BA",
          "response": {
             "authenticatorData": "...",
             "clientDataJSON": "...",
             "signature": "...",
             "userHandle": "42"
          },
          "type": "public-key"
        }'
  ```

* **Remove Passkey** – Remove a registered passkey from the user’s account.

  **URL:** `DELETE /auth/passkey/{id}`
  **Auth:** Requires authentication (the user must be logged in, and either removing their own key or an admin removing someone’s key).
  **Description:** Deregisters a passkey. This sets the credential’s record to inactive (soft delete) so it can no longer be used to log in. Users may want to remove lost devices or old keys. Admins might use it to remove a user’s compromised key.

  **Response:** 200 with a message, e.g., `{ "message": "Passkey removed" }`. After removal, attempts to use that credential will fail at the login verification step (as the server won’t find an active credential).

  **Example CURL:**

  ```bash
  curl -X DELETE http://localhost:3000/auth/passkey/10 \
    -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
  ```

  (Here 10 is the passkey record ID. Alternatively, maybe the endpoint might accept credential ID string – but using the numeric ID is easier.)

**Important:** Passkey endpoints involve quite complex data. Typically, you will use the official WebAuthn JS APIs on the client side and these endpoints on the server side. Ensure you serve your application over **HTTPS**, as WebAuthn only works on secure contexts (localhost is allowed for development). Also, coordinate the front-end and back-end such that the user experience is smooth (prompts for security key, fallback to password if needed, etc.).

### System Endpoints

The **SystemModule** provides endpoints for system information and health checks. These are useful for monitoring or for the app UI to get version info.

* **Get API Version/Info** – Retrieve application version or status.

  **URL:** `GET /system/info` (or `/system/version`)
  **Auth:** Usually public (no auth needed) – it's common to allow version info without auth for health checks. However, you can secure it if you prefer.
  **Description:** Returns basic information about the running application, such as version number (as provided in config), environment mode, uptime, etc. This can be used to verify the API is up and to display the version in client apps.

  **Response:** HTTP 200 with JSON, e.g.:

  ```json
  {
    "name": "Sunny APIs Example",
    "version": "1.0.0",
    "env": "production",
    "uptime": 3600,
    "timestamp": "2025-05-18T15:45:00Z"
  }
  ```

  * `name` might be the app name (if configured).
  * `version` is the version string you passed in `SystemModule.forRoot({ version })`.
  * `env` could be current environment.
  * `uptime` maybe in seconds.
  * `timestamp` current server time.

  The exact fields depend on implementation. At minimum expect the `version`. If the SystemModule is minimal, it might only return `{ "version": "0.5.0" }`.

  **Example CURL:**

  ```bash
  curl -X GET http://localhost:3000/system/info
  ```

  or

  ```bash
  curl -X GET http://localhost:3000/system/version
  ```

  (Use whatever endpoint your app actually exposes. Check your routes – Sunny APIs might use `/system` prefix.)

* **Health Check** – A simple health check endpoint.

  **URL:** `GET /system/health` (not sure if explicitly present; if not, `/system/info` can serve this purpose)
  **Description:** Could return something like `{ "status": "ok" }` or include database connectivity checks. If not built-in, you can easily add your own using the SystemModule’s patterns.

  **Example:**

  ```bash
  curl -X GET http://localhost:3000/system/health
  ```

  might yield `{"status":"ok","db":"ok"}` etc., if implemented.

### Test/Development Endpoints

If you have included the **TestModule** (and are running in a non-production environment), you might have some special endpoints to assist in testing. These are not typically enabled in production.

Possible endpoints in TestModule (note: these are hypothetical since the exact API isn’t explicitly documented; they are inferred from having a Test module and fake DB capabilities):

* **Reset Database (Test Only)** – e.g. `POST /test/reset`
  Wipes all data or re-initializes the in-memory database to a clean state. Useful in integration tests between scenarios.

* **Seed Test Data** – e.g. `POST /test/seed`
  Populates the database with predefined test data (users, etc.). Possibly the TestModule uses this to create a default admin user or sample records. The BddServiceInit classes suggest that on startup, Sunny APIs may insert initial data (like an admin user) if none exist. This could be triggered via TestModule or just automatically in dev mode.

* **Toggle Mode** – e.g. `POST /test/use-fake-db` or `/test/use-real-db`
  Could switch the data source at runtime (though typically this might be set at startup rather than dynamically).

* **Ping** – e.g. `GET /test/ping`
  Returns a simple "pong" to test that the authenticated requests work in test mode.

These endpoints (if they exist) should be used only in development/testing. In production, either disable TestModule or secure these endpoints (e.g., behind admin guard or completely turned off).

**Example CURL:**

```bash
# Reset and seed data for test
curl -X POST http://localhost:3000/test/reset
curl -X POST http://localhost:3000/test/seed
```

(These would typically not require auth if they’re for automated tests, but Sunny APIs might still protect them to avoid misuse. Check your config – maybe TestModule is only imported under NODE\_ENV=test.)

---

**Note:** All the above endpoints are customizable. Since Sunny APIs is part of your project, you can extend or override any controllers as needed. The defaults are provided for convenience.

When using these endpoints, always remember:

* Include the `Authorization: Bearer <token>` header for any that require authentication.
* Use HTTPS in production to protect tokens and credentials.
* Handle errors gracefully on the client side (e.g., prompt for login again if a token is expired).

## Authentication & Authorization Details

Sunny APIs implements authentication and authorization in a robust yet flexible manner. This section covers how it works under the hood and how to configure or extend it.

### JWT Authentication Flow

1. **Login:** When a user logs in (via `/auth/login`), Sunny APIs validates the credentials:

   * It will retrieve the user by email/username from the database. (This is done through a user service or usecase that likely calls the database via `GetUserDbDto` and returns a `UserDbModel`.)
   * It then checks the password. If you have hashed passwords, the service will hash the provided password using the same hash algorithm and compare to the stored hash. (Sunny APIs includes `crypto-js` which can hash with SHA or other algorithms. For stronger security, consider integrating bcrypt or Argon2; you can override the password check method to do so.)
   * If credentials are valid, the Auth module uses Nest’s JWT service to sign a token. Typically, the payload of the JWT includes at least `sub` (subject, the user ID) and `role` (the user’s role), and possibly username or email. Keep the payload small for performance and security.
   * The JWT is returned to the client.
2. **Subsequent Requests:** The client includes the JWT in the `Authorization` header: `Bearer <token>`.

   * For HTTP requests, Sunny APIs registers a global guard (`AuthGuardModule`) that intercepts requests. This guard will parse the JWT (via Passport’s JWT strategy or a custom verify function) and, if valid, attach the user info to the request (e.g., `req.user`). It will then allow the request to proceed into your controller.
   * For GraphQL, since WebSockets or HTTP transport may be used, the guard works a bit differently. In Apollo, you pass the `Authorization` header through the context (as we configured in GraphQLModule setup). The Sunny APIs guard for GraphQL reads the token from `context.req` (for queries/mutations) or from connection parameters (for subscriptions). It then validates it similarly and populates a `UserSession` object that the `@CurrentSession` decorator can provide in your resolver.
   * If the token is missing or invalid, the guard will throw an Unauthorized exception, preventing access.
3. **Token Validation:** The JWT is validated using the secret and options you provided in config. If the token’s signature is wrong or it’s expired, validation fails.

   * Ensure the `secret` in your config is correct and consistent between issuing and validating. (Sunny APIs likely calls `JwtModule.register({ secret, ... })` under the hood in AuthModule.forRoot.)
   * If using RS256 or other algorithms, configure accordingly (likely Sunny APIs defaults to HS256 symmetric).
4. **User Retrieval on each request:** After validating the token, you might wonder if the guard hits the database to fetch full user info. Depending on implementation:

   * **Passport JWT strategy approach:** Typically just trusts the token and doesn’t refetch the user (the token itself is the proof). It might embed necessary info (like role) in the token, so it doesn’t query DB on each request.
   * **Custom guard approach:** Could choose to load the user from DB for freshness. Sunny APIs likely does not automatically fetch the user on every request for performance reasons. It trusts the token claims. However, in scenarios like role change or account deactivation, you might need to incorporate checks. For instance, if an admin is downgraded, their old token still says ADMIN. You’d need a strategy (like token invalidation list or short token expiry) to handle that.
   * Sunny APIs provides the user’s session via `UserSession` which is built from token content. It likely contains `id` and `role` at least. If you need more info, you can query the DB in your handler or extend the guard to attach more.
5. **Logout:** As mentioned, JWT is stateless. Sunny APIs does not track sessions server-side by default. Logging out is done by the client discarding the token. If you suspect token compromise or want to force logout, you’d need to implement a token blacklist or change a server-side secret to invalidate all tokens (not usually necessary except for major incidents).

### Role-Based Authorization

Sunny APIs defines a set of user roles and provides the `USER_ROLE` constants for them. The roles are likely defined as an enumeration, e.g.:

```typescript
export const USER_ROLE = {
  ALL: 0,
  USER: 1,
  ADMIN: 2,
  // ... etc.
};
```

*(The exact numeric values are hypothetical here for illustration.)*

* **ALL** – typically means any authenticated user, regardless of specific role. We saw it used to allow all logged-in users to access certain queries.
* **USER** – a normal user role.
* **ADMIN** – an administrative user with elevated privileges.
* There might be other roles defined (possibly `SYSTEM` or `TEST` roles for internal use, etc.). If you need additional roles, you can extend the USER\_ROLE object and assign those roles to users appropriately in the DB (e.g., a numeric code or string in the user’s `role` field).

Sunny APIs’ guard will interpret the array of roles you pass in. The logic likely is:

* If `USER_ROLE.ALL` is in the allowed list, then any authenticated user passes (it might effectively skip role check and just check user is not anonymous).
* Otherwise, it will check if `user.role` (from token or session) is in the allowed list. If roles are numeric and hierarchical, it might check `user.role >= requiredRoleCode`. But given usage, it’s probably simpler: compare role identifiers.
* If the user’s role is not authorized, the guard throws a Forbidden (403) exception.

**Assigning Roles:**

* Roles are assigned per user, stored in the database (`user.role` field). When registering a user via API, the role might default to "USER" (1). Admins can change roles via an admin interface or direct DB update.
* Ensure that at least one admin user exists in your system to manage others. The `BddServiceInitMongo` suggests that on initialization, Sunny APIs might create a default admin if none exists. Check your config if there is a default admin credential to be used on first run (sometimes projects use env like `ADMIN_EMAIL` and `ADMIN_PASSWORD` for this).
* When using the TestModule or in test environment, you may automatically get a user with all roles for convenience.

**Using Guards:**

* We already showed how to use `makeAuthGuard('http', [USER_ROLE.ADMIN])` on a controller or `makeAuthGuard('graphql', [USER_ROLE.ALL])` on a resolver. You can also apply guards globally, but since Sunny APIs provides a global guard via AuthGuardModule (most likely), you may not need to. The global guard likely just checks authentication, while role specifics are at the route level.
* If you want to protect all routes by default (requiring login), you could use `makeAuthGuard('http', [USER_ROLE.ALL])` as a global guard. But then you’d need a way to exempt certain public routes (like login, register, health). Sunny APIs probably already handles this by not requiring auth on those specific controllers, or by providing a mechanism to mark routes as public. If you need an explicit way to mark a route as public (no auth), you might implement a custom decorator or simply not use `UseGuards` on that route (the global guard might have logic to skip if a route is in a whitelist).
* The GraphQL integration as configured in the example forwards the `Authorization` header to context, and uses `USER_ROLE` in guards for resolvers as needed. So both GraphQL and REST are covered.

**Authorization Example:**

Suppose you have an endpoint to delete a user: `DELETE /users/:id`. You want only admins or the user themselves to do it. How to enforce that?

* With Sunny APIs guard, you can only specify roles, not a condition like "user matches ID or role is admin". For such complex logic, you have a couple of options:

  * Write a custom guard for that specific route.
  * Use the Sunny APIs guard to ensure the user is authenticated (and maybe has at least USER role), then inside the controller check `if (request.user.id === targetId || request.user.role === ADMIN)`.
  * Alternatively, if you frequently need "self or admin", you might consider all users can hit the endpoint (so guard with ALL) but the service method will throw if not allowed.
* Another approach is to treat "self delete" as a separate route (e.g., `/users/me` with ALL) and `/users/:id` with ADMIN for admin deleting others.
* Plan your route strategy with security in mind, and use Sunny’s tools plus custom logic where needed.

### Integration with Inversify and Custom Logic

Because Sunny APIs expects an Inversify container, it opens up possibilities for customization:

* You can override how user validation works. For example, if you wanted to use an external OAuth service instead of internal password check, you could implement a custom AuthService, bind it in the container, and Sunny’s AuthModule could call that instead. (Sunny APIs likely has a default implementation, but by using the container, you can swap it.)
* The guard factory (`configureAuthGuardFactory`) likely stores references to your container and config in a closure or a service. When a request comes in, the guard may use the container to fetch needed services. E.g., it might do `container.get('UserUsecase')` to retrieve user from DB if doing active validation.
* The user session object that Sunny passes around might be constructed via a container call. Possibly `UserSession` is an interface that your code provides an implementation for (like how to build session from token). But most likely, Sunny APIs defines `UserSession` structure and just populates it from token claims.

If you need to extend Sunny APIs:

* **Adding new modules/features:** You can build your Nest modules alongside it. Sunny APIs doesn’t restrict you – it’s complementary.
* **Extending existing modules:** If Sunny’s UserModule doesn’t do something you need (say, user password reset), you can implement that in your own UserController or as part of your project, reusing Sunny’s services where possible. For instance, you might call Sunny’s `UserService` to find a user, then generate a reset token and send email – these parts are outside Sunny’s scope but easy to add on.
* **Replacing components:** Because the code is yours to modify if needed, you could fork or directly modify parts of Sunny APIs – but a cleaner way is to override via the container. For example, if you want to use a different strategy for JWT (maybe attach additional claims or log each login), you could override the AuthService’s `login` method by binding a subclass in Inversify.

### Security Considerations

* **JWT Secret Management:** Keep your JWT secret secret! Do not commit it to repository. Use environment variables or a secret manager. Rotate the secret if you suspect compromise (note: rotating will invalidate all existing tokens).
* **Password Storage:** Ensure that user passwords are stored as hashes. Sunny APIs likely uses `crypto-js` to hash, but consider using a strong hashing function (bcrypt/Argon2). You might incorporate `bcryptjs` or similar and use it in the registration flow. The provided code did not show hashing explicitly (it directly compared password in the DB query, implying the DB might already store hashed password, and it was checking by retrieving the hash and comparing in application or DB). Double-check and implement hashing if not present.
* **Account Lockout / Brute Force:** Sunny APIs includes Nest Throttler module, which you can configure to rate-limit login attempts (e.g., 5 attempts per minute per IP) to prevent brute force. Make sure to configure that (via Nest Throttler’s options).
* **CORS and CSRF:** With JWT APIs, ensure CORS is configured to only allow your frontend origin in production. If you store JWT in cookies, consider CSRF protection. If stored in memory, it’s less an issue.
* **WebAuthn Security:** Passkeys are phishing-resistant and stored securely on devices. The server should enforce TLS. The challenges are one-time use; Sunny APIs should be verifying that the challenge in the response matches the one it sent (ensuring it’s not replayed). Also, consider enforcing user verification (e.g., biometric or PIN on device) by setting `userVerification: "required"` in options if you want high security (if `preferred`, user might skip device auth if their device allows).
* **Active Flag:** The `active` field on users and passkeys allows soft disabling. If you set a user’s `active=false`, ensure the auth logic checks this. You may need to adjust the login to reject inactive users (e.g., by modifying the GetUser query to include `AND active=1` – currently the snippet we saw did not filter by active, which might be a bug or simplification). It’s wise to enforce that in your user retrieval: only authenticate if user is active. Similarly, the guard or subsequent calls could check a `session.active` if included.
* **Sessions and Data in Token:** By default, include minimal info in JWT (id and role). If you include things like permissions or other data, know that changing those server-side won’t reflect until a new token is issued. Plan accordingly (maybe short token life and use refresh tokens if dynamic permission changes are needed).

## Development and Deployment Instructions

If you are working on the Sunny APIs project itself or deploying it as part of your system, here are some guidelines.

### Setting up a Development Environment

1. **Clone the Repository:** If you plan to modify Sunny APIs, clone it from GitHub. (Otherwise, if you just use the package, skip to the next section.)

   ```bash
   git clone https://github.com/Happykiller/sunny-apis.git
   cd sunny-apis
   npm install
   ```
2. **Project Structure:** Familiarize yourself with the source. The code is likely organized into directories by feature:

   * `src/presentation/` – might contain controllers and GraphQL resolvers for Auth, User, etc.
   * `src/service/` – contains service classes, perhaps subdirectories for `db` (with subfolders for `mongo`, `fake`, etc.) and maybe other services like email if any.
   * `src/inversify/` – possibly contains definitions for the Inversify container or interfaces for dependency injection.
   * `src/config/` – might have configuration structures or constants.
   * Each module (AuthModule, UserModule, etc.) could be defined in its own file or folder.
   * There might be a root `index.ts` that exports all modules for consumption.
3. **Build & Test:** The project likely uses Jest for testing (devDependencies include jest). You can run tests with:

   ```bash
   npm run test
   ```

   Ensure all tests pass before making changes. Also try building:

   ```bash
   npm run build
   ```

   This compiles TypeScript to `dist/`. If you want to test the built version in an example app, you can use `npm link` as described earlier.
4. **Code Style:** Sunny APIs uses ESLint and Prettier for code formatting (devDependencies list those). It's good practice to run linter:

   ```bash
   npm run lint
   ```

   And format if needed:

   ```bash
   npm run format
   ```

   Maintain the coding style (such as 2-space indentation, semicolons, etc., as configured).
5. **Hot-Reload (Watch Mode):** If actively developing, you might use `npm run start:dev` in an example project to have it recompile on changes. If you want Sunny APIs itself to rebuild on changes, you could use `tsc -w` or Nodemon pointing to a test script.

### Releasing a New Version (Maintainers)

When the library is updated, you should:

* Bump the version in `package.json`.
* Update the **CHANGELOG** or release notes with changes.
* Run tests to ensure nothing broke.
* Publish to NPM (if you have permissions):

  ```bash
  npm publish --access public
  ```

  (The `--access public` is needed if it's a scoped package being made public.)
* Tag the release in Git (optional but recommended).
* Communicate the changes (if internal, maybe via docs or an announcement to the team).

### Deploying in Production

Since Sunny APIs is a library, deploying it means deploying the application that uses it. However, there are some production considerations:

* **Environment Config:** Set `NODE_ENV=production` and configure `config.env.mode = 'prod'`. This should ensure that TestModule is not loaded (you can guard it: e.g., only import TestModule if mode is 'dev' or 'test') and that potentially verbose logging or swagger is disabled.
* **Database Connections:** Use real database connections in prod. If you used a fake DB in dev, be sure to switch to MySQL or Mongo in prod. Double-check that the correct `BddService` implementations are being used. For example, if `config.env.mode` is how it switches, ensure mode is properly set.
* **Migration and Seeding:** Before running the API in production, set up the database schema required (tables/collections for users, passkeys, etc.). You might need to run migrations (if any) or manually create tables:

  * e.g., Create `user` table with columns as expected (id, code, password, name\_first, name\_last, mail, role, active, etc.).
  * Create `passkeys` table if using MySQL as per snippet: (id, user\_id, user\_code, label, hostname, challenge, registration, registration\_parsed, active).
  * If using Mongo, define collections similarly.
    The Sunny APIs project might include some SQL scripts or at least the queries give hints of schema:

    * `user` table columns as seen in query.
    * `passkeys` table columns as in insert.
  * Ensure indexes on important fields (user.code maybe unique, passkeys.user\_id for quick lookup, etc.).
* **Admin User:** Make sure you have an admin user in the database. If not, create one manually (with a hashed password). This will allow you to log in and manage the system. Alternatively, if Sunny APIs auto-creates an admin when empty, use that (the credentials might be default like [admin@admin.com](mailto:admin@admin.com) / admin, though check docs or code).
* **Monitoring:** Use the system endpoints (e.g., `/system/info`) for health checks in your orchestration (Kubernetes liveness probes, etc.). They should be lightweight. If needed, implement a more thorough health check that pings the database.
* **Scaling:** The library itself doesn’t store session state, so it should be horizontally scalable (just ensure each instance has the same JWT secret and connects to the same database). WebAuthn challenges might be stored in memory per instance – that could be an issue in a multi-instance environment if the challenge generation and verification are not tied to the same server. If that’s the case, you may need a shared cache or ensure sticky sessions for the registration process, or store the challenge in the database tied to the user. Investigate the registration flow if scaling, to avoid a scenario where one instance issues a challenge and another tries to verify it without knowing it. A simple solution: store the challenge in the `passkeys` table temporarily or in a Redis cache.
* **Logging:** Configure logging for your production environment. Sunny APIs itself might use Nest’s logger or Winston. Ensure sensitive info (like passwords) aren’t logged. Use appropriate log levels (info for start/stop, error for issues). Monitor logs for suspicious activity (repeated failed logins, etc.).
* **Security Hardening:** Consider enabling 2FA (Sunny’s passkey is one method). If needed, you can also integrate TOTP (not built-in, but can be added). Ensure all endpoints that modify data are protected by roles. Use HTTPS. Possibly use Helmet (Nest can integrate helmet for HTTP headers).

### Contributing to Sunny APIs

We welcome contributions to improve Sunny APIs! If you have enhancements or bug fixes, please follow these guidelines:

* **Issue Tracker:** Use the GitHub Issues to report bugs or request features. Provide as much detail as possible, including reproduction steps for bugs or use cases for new features.
* **Branching:** For contributions, fork the repository and create a branch named descriptively (e.g., `feature/passkey-logout` or `bugfix/fix-user-hash`).
* **Coding Style:** Adhere to the existing style. Run `npm run lint` and `npm run format` before committing. Ensure no lint errors and that code is prettified.
* **Testing:** If you add a new feature or fix a bug, write corresponding unit tests. Check the `__tests__` directory (or wherever tests are) for examples. Run `npm test` to ensure all tests pass.
* **Documentation:** If your change affects the public API or usage, update the README (and any other docs) accordingly. Documentation changes are as important as code changes for users to understand the new behavior.
* **Pull Request:** Submit a PR to the `main` (or appropriate development) branch of Happykiller/sunny-apis. In your PR description, reference the issue number if applicable, and summarize the changes. The maintainers will review your code. Please be responsive to feedback and ready to make adjustments.
* **Commit Messages:** Use clear commit messages. If possible, follow Conventional Commits format (e.g., `feat: add support for multiple roles per user` or `fix: resolve crash when passkey challenge is missing`).
* **License Compliance:** By contributing, you agree that your contributions will be under the same MIT license. Do not include code you cannot license under MIT (no copying from incompatible licensed projects).

If you’re using Sunny APIs in your organization and have specialized needs, consider contributing those back so everyone can benefit! We appreciate community input to make the project better.

## AI Usage Guide

A short reference aimed at AI assistants is provided in [docs/ai.md](docs/ai.md). It lists the key GraphQL operations and typical workflows so automation tools can interact with Sunny APIs effectively.

## License

Sunny APIs is open-source software licensed under the **MIT License**. See the `LICENSE` file in the repository for the full text.

In summary, the MIT License permits you to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software, subject to including the license notice in your copies. It’s a very permissive license, suitable for both personal and commercial use.

```
Sunny APIs - Copyright (c) 2025 Fabrice Rosito

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction...
```

*(Full license text available in the repository.)*

---

**Disclaimer:** This README is meant to provide exhaustive documentation for Sunny APIs. For internal use, you may also maintain additional documents like an architecture decision record or a troubleshooting guide. Always refer to the latest code for the most accurate details, as the project may evolve beyond what’s described here.

Happy coding with Sunny APIs! If you have questions or need support, feel free to reach out via the project’s issue tracker or (if internal) the team’s communication channels.
