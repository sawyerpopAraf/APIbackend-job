# Application Installation and Usage Instructions
Run npm install. This is an Todo aplication with focus on backend, so there is no front-end code yet ,The API is connected to a MySQL database with Sequelize, you have to test the app using postman , after loggin , remember to include jwt token in your Authorizationm, choose Bearer Token . 

I have used Jest, supertest, and nodemon as dev-dependencies during the production of this app. However, I had to uninstall nodemon since it clashes with Swagger (I'm unsure why).

After the table is created, create four types of statuses:

Not Started
Started
Completed
Deleted
(Note: These are case-sensitive.)


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






