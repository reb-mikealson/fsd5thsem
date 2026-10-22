# CampusDesk — Student Record Dashboard

A React + Vite student record management demo with Admin and Student roles.

## Prerequisites
- Node.js 20.19+ or 22.12+ recommended (includes npm)
- Visual Studio Code
- Internet connection for the Google Fonts import (the app itself runs locally without it)

## Run in VS Code
1. Extract `student-record-dashboard.zip`.
2. Open the extracted `student-record-dashboard` folder in VS Code (`File → Open Folder`).
3. Open the integrated terminal (`Terminal → New Terminal`).
4. Check Node and npm:
   ```bash
   node -v
   npm -v
   ```
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```
7. Open the local URL Vite prints (usually `http://localhost:5173`).

## Demo credentials
- **Admin:** username `admin`, password `admin123`
- **Student:** username `student`, password `student123`

The login page shows these demo credentials and includes a “Use demo” button.

## Included features
- Landing page with Admin and Student role selection.
- Separate demo login pages.
- Admin overview with student, attendance and assignment stats.
- Add student form: name, class/programme, roll number, section and batch.
- Attendance: filter by section, batch and subject; mark P (green) or A (red).
- Assignment upload: accepts PDF, DOC and DOCX; filters by class, section, batch and subject.
- Student directory with search and delete confirmation; deletion toast says `STUDENT DELETED`.
- Student portal to look up attendance and assignments.
- Responsive layout for desktop and mobile.

## Synthetic data
The app starts with sample student records and sample assignment *metadata*. These are mock/demo records, not real student information. The sample assignments are placeholders; their original files are not included.

## Important limitations
This is a front-end prototype, not a secure production student information system:
- Student records, attendance marks and uploaded files live in React state and are lost on page refresh. There is no server or persistent database.
- Demo login credentials are hard-coded in the client and must not be used for real accounts.
- Student lookup is a convenience demo, not secure authentication or authorization.
- Assignment uploads are kept in browser memory for the current session only.
- For production use, add a backend/API, persistent database (e.g. PostgreSQL), real authentication, role-based authorization, upload validation/storage, and audit logging.

## Build check
```bash
npm run build
```
