import { TaskList } from "../models/TaskListSchema";
import { Task } from "../models/TaskSchema";

export const create = async () => {

  const tasks = await Task.find({});
  const taskIdList = tasks.map((task) => task._id);

  const tasklist = {
    name: "Középszintű érettségi",
    tasks: taskIdList,
    sequence: "sequence",
    startTime: new Date(),
    deadline: new Date("2023-05-20"),
    team: "Barcelona",
    teacher: "KB",
  };

  const newTaskList = await TaskList.create(tasklist);
  console.log(newTaskList);
};

