export interface MeridianTask {
  id: string;
  title: string;
  timeMinutes: number;
  status: "locked" | "available" | "done";
  optional?: boolean;
  notes?: string;
}

export const DAY1_TASK_IDS = {
  hrForms: "day1-hr-forms",
  mpiOverview: "day1-mpi-overview",
  introduction: "day1-introduction",
  readingList: "day1-reading-list",
} as const;

export const createDay1Tasks = (): MeridianTask[] => [
  {
    id: DAY1_TASK_IDS.hrForms,
    title: "Complete HR forms in SynergyDrive",
    timeMinutes: 30,
    status: "locked",
    notes: "Locked until SynergyDrive login resolves.",
  },
  {
    id: DAY1_TASK_IDS.mpiOverview,
    title: "Read MPI Overview document",
    timeMinutes: 30,
    status: "locked",
    notes: "Includes the unusable quiz. No feedback is given.",
  },
  {
    id: DAY1_TASK_IDS.introduction,
    title: "Post introduction in #general",
    timeMinutes: 5,
    status: "available",
    optional: true,
    notes: "Optional on Day 1, but chased later if skipped.",
  },
  {
    id: DAY1_TASK_IDS.readingList,
    title: "Locate Paul's induction reading list",
    timeMinutes: 15,
    status: "locked",
    notes: "Dead ends add more time and stress, because of course they do.",
  },
];

