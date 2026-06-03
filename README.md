# Maintenance Log System - Frontend

This repository contains the frontend application for **Rapid Maintenance**, a full-stack maintenance prototype management system developed for industrial maintenance workflows.

The application provides an intuitive user interface for managing assets, recording maintenance activities, and administering employee information. It supports multiple user roles, including technicians, managers, and administrators, with access controlled through a role-based authorization system.

As a React single-page application (SPA), the frontend authenticates users using JWT and interacts with the backend REST API to deliver a secure and responsive user experience.

## Links

- [Deployed application](https://mlf.heltsort.dk/)
- [Routes overview](https://maintenancelog.heltsort.dk/routes)
- [Project overview video (4 min)](https://youtu.be/FXqS-REKt-w)
- [Portfolio](https://jespertandersen.github.io/Portfolio/)
- [Backend repository](https://github.com/JesperTAndersen/MaintenanceLog)

## Features

- **JWT login** and session handling (token stored in `localStorage`)
- **Role-based routing** (ProtectedRoute + role hierarchy)
- Asset directory with **status filtering** (active/inactive)
- Asset details with **maintenance log list** + filtering (status/task type)
- Create maintenance logs (TECHNICIAN+)
- Employee directory with **status + role filtering**
- Employee profile view/edit (MANAGER+ can edit)
- Admin actions with confirmation (activate/deactivate assets & employees)
- Log search by ID

## Roles & access

The UI mirrors the backend role model and prevents navigation to protected routes unless the current user has the required role.

- **AUTHENTICATED**: view assets, asset logs, employees, profiles, log search
- **TECHNICIAN+**: create maintenance logs
- **MANAGER+**: create assets, create employees, view logs by employee, edit employee profiles
- **ADMIN**: activate/deactivate assets and employees (soft delete)

## Routes

Key application routes (see `src/App.jsx`):

- `/login`
- `/assets`
- `/assets/:id/logs`
- `/assets/:id/createlog` (TECHNICIAN+)
- `/assets/create` (MANAGER+)
- `/employees`
- `/employees/create` (MANAGER+)
- `/employees/:id`
- `/employees/me`
- `/employees/:id/logs` (MANAGER+)
- `/logs`

## Tech stack

- React 19
- React Router 7
- Vite 8

## Authentication notes

- JWT is stored under the `localStorage` key `jwt`.
- If a request returns `401`, the app clears the token and redirects to `/login`.
- A short “session expired” message is passed via `sessionStorage` and shown on the login page.

## Project structure (high level)

- `src/pages/` — route-level pages
- `src/components/` — UI components (auth, header, assets, employees, logs, shared)
- `src/utils/` — API clients and formatting helpers
- `src/context/` — auth state and role checks