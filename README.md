# 1. About Microservices

There are 2 Microservices for Issue Management System (My case study)

> 1. `issue`

- This is the core service and is responsible for all the data releated to an issue.
- It will create a new issue, retrieve all issues, issues based on filter, issue based on ID, Update and Delete specific issue.
- It has get, put, post and delete methods.

> 2. `issueHistory`

- This service is responsible for all the data releated to an issue's data/lifecycle changes.
- Whenever an issue is created, updated or deleted, `issue` service internally calls `issueHistory` service and feeds that data in it.
- This communitcation is sync using HTTP protocol via `node-fetch` for now.
- It has get, put, post methods
- issueHistory can be consumed externally via swagger/postman also.

- Configuration of issueHistory service is via `ISSUE_HISTORY_API`=http://localhost:3002/issueHistory in env files of `issue` Project.

# 2. Folder Structure

- For this exercise, I have gone with Multi Repository and created seperate folders of each microservice.

> ms_issue folder has complete code for `issue` service. It can be pushed to a seperate repository as a standalone project.

> ms_issuehistory folder has complete code for `issueHistory` service. It can be pushed to a seperate repository as a standalone project.

In each service folder

- All the code resides in `src` folder
- Inside src, `app.js` is the entry file
- since I have followed MVC approach this src folder contains dedicated folders for `models,routes and controllers`.
- All the navigation routes are placed in `src/routes` folder.
- All the logic is written in controllers placed within `src/controller` folder.
- All the model for db schema is written in models placed within `src/models` folder.

# 3. Running the server

- You can run server in either production mode or in developer environment
- Env files are picked according to the `NODE_ENV`
- Each Service uses `Mongo DB` and the domain of DB can be changed via `DB_URI` from respective env file.
- **For Production mode, Project is using `Mongo Atlas` and connects to respective data base.**
- Default PORT is 3000 but can be changed in env file `PORT`

---

#### `OPEN API` docs can be accessed on `http://localhost:PORT/api-docs` for respective service

---

1. Install node.js and git
2. Add them to path if not already in path.
3. cd to the project directory
4. Run npm install to get all the dependencies installed

> To start the server in production mode , run

```
npm run start-prod
```

> Similarly, to start server in developer environment, run

```
npm run start-dev
```

# 4. Testing

### Code coverage of `models,routes and controllers` for both the services is `100%`

---

- Project follows TDD approach
- Jest and Supertest have been used for testing the services.
- To run the test cases, use

```
npm run test
```

# 5. Docker

> 1. issue service is in Repository `shobhitsarin/ms_issue` and can be accessed via command. Its size is 292 mb

```
docker pull shobhitsarin/ms_issue
```

- To run the container once image is pulled, use below command.
- Here mapping 3001 of host to Docker's 3000 port exposed.
- ISSUE_HISTORY_API is being set `192.168.1.11:3002` Host's IP and 3002 port on which issueHistory is running. We can also change it to bridge network's internal subnet of container.

```
docker run -p 3001:3000 -e ISSUE_HISTORY_API=http://192.168.1.11:3002/issueHistory shobhitsarin/ms_issue
```

> 2. issue history service is in Repository `shobhitsarin/ms_issuehistory` and can be accessed via command. Its size is 289 mb

```
docker pull shobhitsarin/ms_issuehistory
```

- To run the container once image is pulled, use below command.
- Here mapping 3002 of host to Docker's 3000 port exposed.
- use this port in ISSUE_HISTORY_API of issue container

```
docker run -p 3002:3000 -e shobhitsarin/ms_issuehistory
```

# 6. FAQs

Q. How can we test the application ?

A.

- Run the application on different port on host machine, via docker or cloning the repository
- open swagger for issue service and issueHistory service
- using `issue` service swagger - create a new issue with details
- Note the ID returned in response
- use this ID to get the issue using get method of issue
- use this ID to update details using put method of issue, note the changed value
- use this ID in get method of `issuehistory` service swagger and validate the `created` and `updated` data for which changes were done.

# 7. Tools used

> ## Formatting

The project comes with prettier configs and extensions built in.

You can format the project manually by running the command `npm run format` and prettier will format the project for you.

You may want to install an extension for your IDE though. More details on the same is available at https://prettier.io

> ## Linting

You can customize rules if needed using the .eslintrc file placed in the root directory. If you are using VSCode, you can have the ESLint extension installed. While linting is run everytime you start the server, you can manually run it by `npm run lint`

> ## Generate API Documentation (OpenAPI/Swagger)

You can generate documentation site by providing details regarding all the endpoints and configure it in `src/config/swagger.js` file in the and once done, you can start the server and your documentation will get exposed in `/api-docs` URL.

> ## Logging

Logs can be added via logger function from `utils/logger.js`. Using winston logger for the logging. By default, console logging is enabled and file logging is disabled but this can be changed by using the config.
