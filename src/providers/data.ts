// import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
// import { API_URL } from "./constants";
// export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
//   apiURL: API_URL,
// });

import {
  BaseRecord,
  DataProvider,
  GetListParams,
  GetListResponse,
} from "@refinedev/core";

const MOCK_SUBJECTS = [
  {
    id: 1,
    course: "Computer Science",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Engineering",
    description:
      "A comprehensive introduction to the fundamentals of computer science, covering algorithms, data structures, and software engineering principles.",
  },
  {
    id: 2,
    course: "Physics",
    code: "PHY201",
    name: "Quantum Mechanics",
    department: "Science",
    description:
      "An advanced course exploring the principles of quantum mechanics, wave-particle duality, and the mathematical framework of quantum theory.",
  },
  {
    id: 3,
    course: "Mathematics",
    code: "MATH101",
    name: "Calculus I",
    department: "Mathematics",
    description:
      "An introductory course on differential and integral calculus, focusing on limits, continuity, and applications of derivatives and integrals.",
  },
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return {
        data: [] as TData[],
        total: 0,
      };
    }

    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length,
    };
  },
  getOne: async () => {
    throw new Error("this functin is not present in mock");
  },
  create: async () => {
    throw new Error("this functin is not present in mock");
  },
  update: async () => {
    throw new Error("this functin is not present in mock");
  },
  deleteOne: async () => {
    throw new Error("this functin is not present in mock");
  },

  getApiUrl: () => "",
};
