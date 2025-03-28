export interface Course {
  id: string;
  name: string;
  grade: string;
  creditUnit: number;
}

export interface Semester {
  id: string;
  courses: Course[];
  gpa: number;
}

export interface CGPAHistory {
  semesters: Semester[];
  cgpa: number;
}

export const gradePoints: Record<string, number> = {
  'A': 4.00,
  'AB': 3.50,
  'B': 3.25,
  'BC': 3.10,
  'C': 2.75,
  'CD': 2.50,
  'D': 2.25,
  'E': 2.00,
  'F': 0.00
};

export const getCGPAClassification = (cgpa: number): string => {
  if (cgpa >= 3.50) return 'Distinction';
  if (cgpa >= 3.00) return 'Upper Credit';
  if (cgpa >= 2.50) return 'Lower Credit';
  if (cgpa >= 2.00) return 'Pass';
  return 'Fail';
};

export const getGradeFromScore = (score: number): string => {
  if (score >= 75) return 'A';
  if (score >= 70) return 'AB';
  if (score >= 65) return 'B';
  if (score >= 60) return 'BC';
  if (score >= 55) return 'C';
  if (score >= 50) return 'CD';
  if (score >= 45) return 'D';
  if (score >= 40) return 'E';
  return 'F';
};