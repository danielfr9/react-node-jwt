# React and Node Typescript Starter Project

This starter is intended to serve as a beginner project for learning [React](https://reactjs.org/) and [Node](https://nodejs.org/en/).

Once you feel comfortable with how React and Node work, you should considering using something like [Next.js](https://nextjs.org/) for bigger projects.

## Node project contains the following libraries:

- Express
- CORS
- Prisma ORM
- Nodemon
- Dotenv

## React project contains the following libraries:

- TailwindCSS
- Axios

## Run the project

To run the projects, you will have to first install the dependencies

```

$ cd client
$ npm i             // install React dependencies
$ cd ..
$ cd server
$ npm i             // install Node dependencies
```

Run a migration to create your database tables with Prisma Migrate. [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)

```
$ cd server
$ npx prisma migrate dev --name init
```

After that, run each project individually

```
$ cd client
$ npm run dev

// In a different terminal
$ cd server
$ npm run dev
```

_This will run React in port 5713 and Node in port 4000._
