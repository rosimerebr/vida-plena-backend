# TODO

## Project Progress
- TypeORM configuration with SQLite completed.
- User entity created with the following fields: fullName, email, password, dateOfBirth, weight.
- User creation and update DTOs updated.
- User service and module integrated with TypeORM.
- Seed script created to populate the user table.
- Bible verses array standardized with double quotes in the backend.
- Endpoint /bible/random returns o versículo do dia (consistente).
- Endpoint /bible/daily criado para retornar o versículo do dia.
- Frontend integration fixed to display the daily spiritual message on the Home page.
- HabitLog entity created for habit tracking.
- POST /report endpoint implemented to register habits in the database.
- GET /report endpoint returns weekly grouped habit data for reports.
- CORS configuration updated to allow frontend connections from localhost:8100 and localhost:8101.
- Password hashing implemented using bcrypt for user security.
- User table cleaned and ready for new registrations.
- User registration endpoint tested and working properly.

## Next Suggested Task
- Implement authentication for habit registration and user-specific reports.
- Add input validation and error handling for user registration.
- Implement password reset functionality.
- Permitir randomização real opcional no endpoint /bible/random, caso desejado. 