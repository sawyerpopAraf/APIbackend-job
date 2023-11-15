//Application usage and instalation 


Run npm install. This is a Todo application focused on backend development, so there is no front-end code yet. The API is connected to a MySQL database via Sequelize. To test the app, use Postman, and after logging in, remember to include the JWT token in your Authorization header and choose 'Bearer Token'.

I have used Jest, supertest, and nodemon as dev-dependencies during the development of this app. However, I had to uninstall nodemon due to a conflict with Swagger (the reason for this conflict is currently unclear).

After the table is created, create four types of statuses:

Not Started
Started
Completed
Deleted
(Note: These statuses are case-sensitive.)
NB: A todo will not be deleted from the database; instead, its status will be changed to 'Deleted'.

# Environment Variables
HOST = "localhost"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "P@ssw0rd"
DATABASE_NAME = "myTodo"
DIALECT = "mysql"
PORT = "3000"
TOKEN_SECRET="some random words" 

# Additional Libraries/Packages


# NodeJS Version Used
v18.16.0






