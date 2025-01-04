# Simple School Management System

## Usage
1. Clone the repository
2. Set up your DB to work with the backend. A script is provided to pull and start the needed docker image in `./scripts/`. Just change the dir to `scripts` and either run the ps1 file if using powershell or the sh file if using linux.
3. Change the directory to the backend folder, `npm install` to install dependencies, then `npm run start:dev` or `npm run start` to start the server.
4. After the server is started, open a new terminal, and change the directory to the `frontend-page-router/` folder.
5. `npm install` to install dependencies. Start the front end by `npm run dev`.

## Functionalities
- View all classes that are available in the system.
- View all students that are available in the system.
- Create a new class (admin, principal).
- Create a new student (admin, teacher).
- View a specific student/class by clicking on their name in the student/class list.
- Search students by providing a string.
- Filter students by class name.
- Update a student (admin, teacher).
- Delete a student (admin, teacher).
- Update a class (admin, principal).
- Delete a class (admin, principal).
