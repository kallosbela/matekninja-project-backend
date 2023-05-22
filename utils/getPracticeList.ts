import { SolutionType } from "../models/SolutionSchema";

type PracticeListType = {
  [key: string]: number;
};

const getPracticeList = async (solutions: SolutionType[], start: number, end: number) => {

  const practiceList: PracticeListType = {};

  solutions.forEach((solution) => {
    const date = (new Date(solution.date!)).toISOString().split("T")[0];
    if (!practiceList.hasOwnProperty(date)) {
      practiceList[date] = 0;
    }

    practiceList[date] += solution.duringTime!;
  });

  const startDate = new Date(start);
  const endDate = new Date(end);

  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dateKey = currentDate.toISOString().split("T")[0];
    if (!practiceList.hasOwnProperty(dateKey)) {
      practiceList[dateKey] = 0;
    }
  }

  const practiceListArray = Object.entries(practiceList).map((entry) => {
    return {
      date: entry[0],
      time: entry[1]/60,
    };
  });

  return practiceListArray;
}

export default getPracticeList;
