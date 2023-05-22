import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import loginRoutes from './routes/login'; 
import userRoutes from './routes/user';
import taskListRoutes from './routes/tasklists';
import tasksRoutes from './routes/tasks';
import solutionRoutes from './routes/solution';
import statisticsRoutes from './routes/statistics';

const app:Express = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes)
app.use("/api/user", userRoutes)
app.use("/api/tasklists", taskListRoutes)
app.use("/api/tasks", tasksRoutes)
app.use("/api/solution", solutionRoutes)
app.use("/api/statistics", statisticsRoutes)

export default app;
