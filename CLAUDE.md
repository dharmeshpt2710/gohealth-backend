# CLAUDE.md — GoHealth Backend (Single Source of Truth)

> **Purpose of this file:** This is the authoritative context file for the GoHealth backend.
> Claude MUST read this file FIRST and use it as the complete project reference.
> DO NOT re-scan the entire repository on every conversation — this file contains the full
> project context. Only read specific files when you need to edit them or verify current state.

---

## Project Overview

**GoHealth** is a healthcare appointment booking platform backend built as a Capstone project.
It allows patients to register, find doctors, book appointments based on doctor availability,
and leave testimonials/ratings.

- **Runtime:** Node.js
- **Framework:** Express.js v4
- **Database:** MongoDB via Mongoose v6
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **File Uploads:** Multer (disk storage)
- **Validation:** express-validator
- **Entry Point:** `server.js`
- **Config:** `config.js` (reads from `.env` via dotenv)
- **Start Command:** `npm start` → `nodemon -r dotenv/config server.js`

### Environment Variables (`.env`)

```
PORT=<number>
SECRET_KEY=<jwt-secret>
DB_URI=<mongodb-connection-string>
```

---

## Project Structure

```
gohealth-backend/
├── server.js              # Express app setup, middleware, route mounting, DB connection
├── config.js              # Reads .env → exports { port, secret, dbUri }
├── package.json           # Dependencies and scripts
├── .gitignore             # Ignores node_modules, .env, dist, logs, etc.
├── README.md
│
├── models/                # Mongoose schemas and models
│   ├── users.js           # User model (patients + admins)
│   ├── doctors.js         # Doctor model
│   ├── appointments.js    # Appointment model
│   ├── availibilities.js  # Availability model (NOTE: filename has typo, keep as-is for now)
│   └── testimonials.js    # Testimonial model
│
├── routes/                # Express route handlers (currently contain business logic too)
│   ├── users.js           # /api/users — signup, login, profile, password change
│   ├── doctors.js         # /api/doctors — signup, login, status update
│   ├── appointments.js    # /api/appointments — CRUD, booking, closing
│   ├── availabilities.js  # /api/availabilities — doctor time slot management
│   └── testimonials.js    # /api/testimonial — patient reviews
│
├── controllers/           # (TO BE CREATED) Business logic separated from routes
├── middleware/             # (TO BE CREATED) Shared auth, error handling, validation
└── uploads/               # (TO BE CREATED) Multer file storage
    ├── images/
    └── files/
```

---

## Data Models (Current State)

### User (`models/users.js` → collection: `users`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | no | |
| email | String | yes | No unique index (BUG) |
| password | String | yes | bcrypt hashed |
| location | String | no | |
| number | String | no | Phone number |
| userType | String | no | `"patient"` or `"admin"` |
| appointments | Array | no | `[{ appointmentId: ObjectId ref Appointment }]` |

### Doctor (`models/doctors.js` → collection: `doctors`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | yes | |
| location | String | no | |
| qualification | String | yes | |
| yearsOfExperience | String | yes | Should be Number (BUG) |
| specialty | String | yes | |
| email | String | yes | No unique index (BUG) |
| password | String | yes | bcrypt hashed |
| registrationStatus | Boolean | no | Admin approval flag |
| appointments | Array | no | `[{ patientId: ObjectId ref User, appointmentId: ObjectId ref Appointment }]` |

### Appointment (`models/appointments.js` → collection: `appointments`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| appointmentName | String | yes | |
| appointmentEmail | String | yes | |
| doctorId | ObjectId | yes | ref: Doctor |
| patientId | ObjectId | yes | ref: User |
| appointmentStartTime | String | yes | |
| appointmentEndTime | String | yes | |
| appointmentDate | String | yes | |
| appointmentNote | String | no | |
| appointmentStatus | Boolean | no | true=active, false=closed |

### Availability (`models/availibilities.js` → collection: `availabilities`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| doctorId | ObjectId | yes | ref: Doctor |
| appointmentDate | String | yes | |
| timeSlots | Array | no | `[{ startTime: String, endTime: String }]` |

### Testimonial (`models/testimonials.js` → collection: `testimonials`)
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| patient | ObjectId | yes | ref: User |
| doctor | ObjectId | yes | ref: Doctor |
| ratings | Number | yes | |
| comment | String | yes | |

---

## API Endpoints (Current State)

### Users — `/api/users`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | None | List all users |
| GET | `/:id` | None | Get user by ID |
| POST | `/login` | None | Login (email + password) → sets JWT cookie |
| POST | `/signup` | None | Register new user |
| PUT | `/:userId` | None | Update user name/email |
| PUT | `/change-password/:userId` | None | Change password (old + new) |

### Doctors — `/api/doctors`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | None | List all doctors |
| GET | `/:id` | None | Get doctor by ID |
| POST | `/login` | None | Doctor login → sets JWT cookie |
| POST | `/signup` | None | Register new doctor |
| PUT | `/updateStatus` | None | Admin approves/rejects doctor (body: doctorId, registrationStatus) |
| GET | `/edit` | Cookie JWT | Get current doctor profile (DEAD ROUTE — uses `req.doctor` which is never set) |

### Appointments — `/api/appointments`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | None | List all appointments |
| GET | `/doctors/:doctorId` | None | Get appointments by doctor (populated) |
| GET | `/patients/:patientId` | None | Get appointments by patient (populated) |
| POST | `/bookedTimeSlots` | None | Get booked slots for doctor+date |
| POST | `/` | None | Book new appointment |
| PUT | `/` | None | Close appointment (body: appointmentId) |

### Availabilities — `/api/availabilities`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/availableSlots` | None | List all availabilities |
| GET | `/getDoctorAvailability/:doctorId` | None | Get doctor's slots for a date (query: appointmentDate) |
| POST | `/set-availabilities` | None | Create availability slots |
| PUT | `/update-availabilities/:id` | None | Update availability |
| DELETE | `/delete-availabilities/:id` | None | Delete availability |

### Testimonials — `/api/testimonial`
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | None | List all testimonials (populated doctor + patient) |
| POST | `/` | None | Create new testimonial |

---

## Known Technical Debt & Bugs

These are documented issues. Reference this list before making changes — do not re-discover them.

1. **Passwords in API responses** — No field exclusion; hashed passwords leak on every GET.
2. **Password hash in JWT payload** — `routes/users.js:63`, `routes/doctors.js:91`.
3. **No auth on protected routes** — `userIsAuthorized` middleware exists but is unused.
4. **Implicit globals** — `routes/users.js:112` and `routes/doctors.js:141` missing `const`.
5. **Cookie maxAge (100s) vs JWT expiry (2h) mismatch**.
6. **Deprecated Mongoose callbacks** — `routes/appointments.js:148`, `routes/doctors.js:166`.
7. **No unique index on email** — Duplicate accounts possible.
8. **Weak email validation** — Only checks last 3 chars === "com".
9. **Model filename typo** — `availibilities.js` (keep for backwards compat until intentional rename).
10. **No centralized error handling middleware**.
11. **No tests**.
12. **Swagger deps installed but not configured**.
13. **No `uploads/` directories for multer**.
14. **No timestamps on any model**.
15. **`yearsOfExperience` is String, should be Number**.
16. **Inconsistent response envelope formats across endpoints**.

---

## Coding Standards (MUST FOLLOW)

### General Principles
- Write clean, readable, maintainable code. Prioritize clarity over cleverness.
- Follow DRY (Don't Repeat Yourself) — extract shared logic into middleware or utility functions.
- Use `const` by default; use `let` only when reassignment is needed. NEVER use `var`.
- Always use strict equality (`===` / `!==`), never loose equality.
- Every async route handler MUST have try/catch with proper error responses.
- Use async/await consistently. Do NOT mix callbacks and promises.

### Naming Conventions
- **Files:** lowercase kebab-case for multi-word files (e.g., `auth-middleware.js`). Single-word files stay lowercase (e.g., `users.js`).
- **Variables & Functions:** camelCase (e.g., `appointmentDate`, `getUserById`).
- **Models:** PascalCase singular (e.g., `User`, `Doctor`, `Appointment`).
- **Collections:** Mongoose default pluralization handles this.
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `SALT_ROUNDS`).
- **Route paths:** lowercase kebab-case (e.g., `/set-availabilities`, `/change-password`).

### Project Architecture (Target: MVC Pattern)

```
models/         → Mongoose schemas only. No business logic in models.
controllers/    → Business logic. One controller file per resource.
routes/         → Route definitions + validation only. Delegate to controllers.
middleware/     → Shared middleware (auth, error handler, file upload config).
utils/          → Helper functions (email validation, response formatters, etc.).
config.js       → Environment config.
server.js       → App initialization, middleware setup, route mounting.
```

**When creating new features, follow this separation:**
- Route file: defines the HTTP method, path, validation, and calls the controller.
- Controller file: contains the business logic, calls the model, returns response.
- Model file: defines the schema and exports the Mongoose model. Nothing else.

### Error Handling Pattern
```js
// In controllers — always use try/catch
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// Centralized error handler in middleware/error-handler.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
```

### Standard Response Format
All API responses MUST follow this envelope:
```js
// Success
{ success: true, data: <payload>, message: "optional message" }

// Error
{ success: false, message: "Error description" }

// Paginated (when applicable)
{ success: true, data: [...], pagination: { page, limit, total } }
```

### Authentication & Security Rules
- NEVER include password fields in API responses — use `.select("-password")` on queries.
- NEVER put sensitive data (passwords, secrets) in JWT payloads.
- JWT payload should contain: `{ id, email, userType }` — nothing more.
- All state-changing endpoints (POST/PUT/DELETE) MUST require authentication.
- Auth middleware should extract the token, verify it, and attach `req.user` to the request.
- Use HTTP-only cookies for token storage (already implemented).
- Validate and sanitize all user inputs at the route level using express-validator.

### Database Rules
- Always add `{ timestamps: true }` to schemas for automatic `createdAt`/`updatedAt`.
- Add `unique: true` to fields that must be unique (email).
- Use proper types (`Number` for numeric data, `Date` for dates — not String).
- Use `.select("-password")` when querying users/doctors for API responses.
- Use `.populate()` only when the related data is needed by the consumer.
- Use async/await with Mongoose. Do NOT use the deprecated callback API.

### File & Folder Rules
- One model per file, one controller per file, one route file per resource.
- Keep route files thin — validation and routing only.
- Shared middleware goes in `middleware/` — never duplicate middleware across route files.
- Configuration stays in `config.js` — do not read `process.env` anywhere else.

### Git & Commit Conventions
- Branch naming: `feature/GH-<issue>-<short-description>`, `bugfix/GH-<issue>-<desc>`, `hotfix/...`
- Commit messages: imperative mood, concise (e.g., "Add auth middleware", "Fix password leak in user response")
- Do not commit `.env`, `node_modules/`, or `uploads/` contents.

---

## How to Work With This Codebase (Instructions for Claude)

### Token Optimization Rules
1. **Read this file first.** It contains the full project context.
2. **Do NOT glob or grep the entire repo** to understand project structure — it is documented above.
3. **Only read a file when you need to edit it** or verify its current state before making changes.
4. **Do NOT re-discover known bugs** — they are listed in the Technical Debt section above.
5. **When adding a new feature:** check the API Endpoints table and Data Models section first, then read only the specific files you need to modify.
6. **When fixing a bug:** reference the Technical Debt list, then read only the affected file(s).
7. **After making structural changes** (new files, new endpoints, schema changes): update this CLAUDE.md file to keep it in sync.

### Pre-Change Checklist
Before writing any code, verify:
- [ ] Does this follow the MVC separation? (route → controller → model)
- [ ] Is auth middleware applied to protected endpoints?
- [ ] Are passwords excluded from responses?
- [ ] Is input validation in place?
- [ ] Is async/await used with try/catch?
- [ ] Does the response follow the standard envelope format?
- [ ] Are `const`/`let` used (no `var`, no implicit globals)?

### When Updating This File
Keep this file current. Update the relevant section when you:
- Add/remove/modify an API endpoint → update the API Endpoints table.
- Add/modify a model field → update the Data Models section.
- Create new files or directories → update the Project Structure tree.
- Fix a known bug → remove it from Technical Debt or mark it resolved.
- Add a new dependency → note it in Project Overview if significant.
