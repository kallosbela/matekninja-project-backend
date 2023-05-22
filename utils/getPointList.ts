import { SolutionType } from "../models/SolutionSchema";

type PointListType = {
  [key: string]: number;
};

const getPointList = async (solutions: SolutionType[], start: number, end: number) => {

  const pointList: PointListType = {};

  solutions.forEach((solution) => {
    const date = (new Date(solution.date!)).toISOString().split("T")[0];
    if (!pointList.hasOwnProperty(date)) {
      pointList[date] = 0;
    }
    pointList[date] += solution.points!;
  });

  const startDate = new Date(start);
  const endDate = new Date(end);

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateKey = currentDate.toISOString().split("T")[0];
    if (!pointList.hasOwnProperty(dateKey)) {
      pointList[dateKey] = 0;
    }
  }
  const pointListArray = Object.entries(pointList).map((entry) => {
    return {
      date: entry[0],
      point: entry[1],
    };
  });
  return pointListArray;
}

export default getPointList;
