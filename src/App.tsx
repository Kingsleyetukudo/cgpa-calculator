import React, { useState, useEffect } from 'react';
import { Calculator, Trash2, PlusCircle, History, Plus } from 'lucide-react';
import { Course, Semester, CGPAHistory, gradePoints, getCGPAClassification } from './types';

function App() {
  const [semesters, setSemesters] = useState<Semester[]>([{
    id: '1',
    courses: [],
    gpa: 0
  }]);
  const [cgpa, setCGPA] = useState<number>(0);
  const [history, setHistory] = useState<CGPAHistory[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('cgpaHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const addSemester = () => {
    setSemesters(prevSemesters => [
      ...prevSemesters,
      {
        id: (prevSemesters.length + 1).toString(),
        courses: [],
        gpa: 0
      }
    ]);
  };

  const deleteSemester = (semesterId: string) => {
    if (semesters.length > 1) {
      setSemesters(prevSemesters =>
        prevSemesters.filter(semester => semester.id !== semesterId)
      );
    }
  };

  const addCourse = (semesterId: string) => {
    setSemesters(prevSemesters => {
      return prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: [...semester.courses, {
              id: Math.random().toString(),
              name: '',
              grade: 'A',
              creditUnit: 1
            }]
          };
        }
        return semester;
      });
    });
  };

  const updateCourse = (semesterId: string, courseId: string, field: keyof Course, value: string | number) => {
    setSemesters(prevSemesters => {
      return prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.map(course => {
              if (course.id === courseId) {
                return { ...course, [field]: value };
              }
              return course;
            })
          };
        }
        return semester;
      });
    });
  };

  const deleteCourse = (semesterId: string, courseId: string) => {
    setSemesters(prevSemesters => {
      return prevSemesters.map(semester => {
        if (semester.id === semesterId) {
          return {
            ...semester,
            courses: semester.courses.filter(course => course.id !== courseId)
          };
        }
        return semester;
      });
    });
  };

  const calculateGPA = (courses: Course[]): number => {
    if (courses.length === 0) return 0;

    const totalPoints = courses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] * course.creditUnit);
    }, 0);

    const totalUnits = courses.reduce((sum, course) => sum + course.creditUnit, 0);

    return Number((totalPoints / totalUnits).toFixed(2));
  };

  const calculateCGPA = () => {
    const validSemesters = semesters.filter(semester => semester.courses.length > 0);
    if (validSemesters.length === 0) return;

    const newSemesters = validSemesters.map(semester => ({
      ...semester,
      gpa: calculateGPA(semester.courses)
    }));

    const totalGPA = newSemesters.reduce((sum, semester) => sum + semester.gpa, 0);
    const newCGPA = Number((totalGPA / newSemesters.length).toFixed(2));

    setSemesters(newSemesters);
    setCGPA(newCGPA);

    const newHistory = [...history, { semesters: newSemesters, cgpa: newCGPA }];
    setHistory(newHistory);
    localStorage.setItem('cgpaHistory', JSON.stringify(newHistory));
  };

  const resetCalculator = () => {
    setSemesters([{
      id: '1',
      courses: [],
      gpa: 0
    }]);
    setCGPA(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="md:flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Calculator className="w-8 h-8 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">CGPA Calculator</h1>
            </div>
            <div className="flex gap-4 max-md:mt-8 max-md:justify-between">
              <button
                onClick={addSemester}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-1" />
                Add Semester
              </button>
              <button
                onClick={resetCalculator}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {semesters.map((semester, index) => (
            <div key={semester.id} className="mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Semester {index + 1}</h2>
                {semesters.length > 1 && (
                  <button
                    onClick={() => deleteSemester(semester.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {semester.courses.map(course => (
                <div key={course.id} className="flex gap-4 mb-4 flex-wrap">
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={course.name}
                    onChange={(e) => updateCourse(semester.id, course.id, 'name', e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                    className="w-24 p-2 border rounded"
                  >
                    {Object.keys(gradePoints).map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={course.creditUnit}
                    onChange={(e) => updateCourse(semester.id, course.id, 'creditUnit', parseInt(e.target.value))}
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    onClick={() => deleteCourse(semester.id, course.id)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addCourse(semester.id)}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <PlusCircle className="w-5 h-5 mr-1" />
                Add Course
              </button>

              {semester.gpa > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Semester GPA: {semester.gpa}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={calculateCGPA}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4"
          >
            Calculate CGPA
          </button>

          {cgpa > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="mb-1">CGPA: <span className="font-bold">{cgpa}</span></p>
              <p>Classification: <span className="font-bold">{getCGPAClassification(cgpa)}</span></p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <History className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">CGPA History</h2>
            </div>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={index} className="border-b pb-4">
                  <p className="font-semibold">Calculation {index + 1}</p>
                  <p>CGPA: {entry.cgpa}</p>
                  <p>Classification: {getCGPAClassification(entry.cgpa)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;