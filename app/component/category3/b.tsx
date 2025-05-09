import { useState,useEffect } from "react";

interface BookChapter {
  title: string;
  publisherDetails: string;
  issnIsbn: string;
  coAuthors: number;
  isMainAuthor: string;
  score: number;
}

interface Category3BProps {
  initialData: BookChapter[];
  onFormDataChangeAction: (data: BookChapter[]) => void;
  loginType: "faculty" | "hod" | "committee";
  employeeId?: string;
  onCommitteeScoreChange?: (score: string) => void;
}

export default function Category3B({ initialData, onFormDataChangeAction,
  loginType, employeeId, onCommitteeScoreChange
 }: Category3BProps) {
  const [chapters, setChapters] = useState<BookChapter[]>(initialData);
  const [committeeTotalScore, setCommitteeTotalScore] = useState<string>("");
useEffect(() => {
     if (initialData?.length) {
      setChapters(initialData);
     }
   }, [initialData]);
 
   useEffect(() => {
     if (employeeId) {
       console.log(`Loading data for employee ID: ${employeeId}`);
     }
   }, [employeeId]); 
  const [warning, setWarning] = useState("");
  const calculateScore = (isMainAuthor: string) => {
    if (isMainAuthor === "First Author") return 20;
    if (isMainAuthor === "Co-author") return 15;
    return 0;
  };
  const MAX_SCORE = 100;
  const getTotalScore = () => chapters.reduce((total, c) => total + Number(c.score), 0);

  const mainAuthorOptions = [
    { label: "Select Role", value: "" },
    { label: "First Author", value: "First Author" },
    { label: "Co-author", value: "Co-author" },
  ];
  
  const handleInputChange = (
    index: number,
    field: keyof BookChapter,
    value: string | number | boolean
  ) => {
    if (loginType === "hod") return;
    const updated = [...chapters];
    const updatedChapter = { ...updated[index], [field]: value };
  
    if (field === "isMainAuthor") {
      const newScore = calculateScore(value as string);
      const hypotheticalTotal = getTotalScore() - updated[index].score + newScore;
  
      if (hypotheticalTotal > MAX_SCORE) {
        setWarning("Total score cannot exceed 100.");
        return;
      }
  
      updatedChapter.score = newScore;
      setWarning(""); // Clear warning if valid
    }
  
    updated[index] = updatedChapter;
    setChapters(updated);
    onFormDataChangeAction(updated);
  };
  
  
  const deleteRow = (index: number) => {
    if (loginType === "hod") return;
    const updated = chapters.filter((_, i) => i !== index);
    setChapters(updated);
    onFormDataChangeAction(updated);
  };
  const addRow = () => {
    if(loginType !== "hod" && getTotalScore() < 100) {
    const hypotheticalTotal = getTotalScore() + 20; // assuming max score per entry
  
    if (hypotheticalTotal > MAX_SCORE) {
      setWarning("Cannot add row. Maximum total score of 100 will be exceeded.");
      return;
    }
  
    setChapters([
      ...chapters,
      {
        title: "",
        publisherDetails: "",
        issnIsbn: "",
        coAuthors: 0,
        isMainAuthor: "",
        score: 0,
      },
    ]);
    setWarning("");
  }
  };
  const handleCommitteeTotalScoreChange = (value: string) => {
    if (Number(value) > 100) {
      alert("Committee total score cannot exceed 100.");
      return;
    }
    setCommitteeTotalScore(value);
    if (onCommitteeScoreChange) {
      onCommitteeScoreChange(value); // 👈 call the parent function
    }
  };
  
  const totalScore = getTotalScore();

  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-600 mt-6">
        B. Published Full Papers in Book Chapters in SCOPUS/WOS only
      </h3>
      <b className="text-gray-600">
         [First Author: 20, Co-author: 15 per book chapter]<br/>Maximum Score: 100
      </b>
      <table className="w-full border-collapse border border-gray-300 text-center mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sl. No.</th>
            <th className="border p-2">Title of the Book Chapter</th>
            <th className="border p-2">Details of Publisher</th>
            <th className="border p-2">ISSN/ISBN No.</th>
            <th className="border p-2">No. of Co-authors</th>
            <th className="border p-2">Are You Main Author?</th>
            <th className="border p-2">Self-Appraisal Score</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.title}
                  disabled={loginType === "hod" || loginType === "committee"}
                  onChange={(e) => handleInputChange(index, "title", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.publisherDetails}
                  disabled={loginType === "hod" || loginType === "committee"}
                  onChange={(e) => handleInputChange(index, "publisherDetails", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  value={row.issnIsbn}
                  disabled={loginType === "hod" || loginType === "committee"}
                  onChange={(e) => handleInputChange(index, "issnIsbn", e.target.value)}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  min={0}
                  value={row.coAuthors}
                  disabled={loginType === "hod" || loginType === "committee"}
                  onChange={(e) => handleInputChange(index, "coAuthors", Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                />
              </td>
              <td className="border p-2">
              <select
                  value={row.isMainAuthor}
                  disabled={loginType === "hod" || loginType === "committee"}
                  onChange={(e) =>
                    handleInputChange(index, "isMainAuthor", e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded"
                >
                  {mainAuthorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">{row.score}</td>
              <td className="border p-2">
              <button
                type="button"
                onClick={() => deleteRow(index)}
                disabled={loginType === "hod" || loginType === "committee"}
                className={`bg-red-500 text-white px-2 py-1 rounded ${
                  loginType === "hod" || loginType === "committee"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                  >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        disabled={loginType === "hod" || loginType === "committee"}
        className={`mt-2 px-3 py-2 rounded text-white ${
          loginType === "hod" || loginType === "committee"||totalScore >= 100 ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500"
        }`}
      >
        + Add Row
      </button>
      {warning && (
  <p className="text-sm text-red-600 font-semibold mt-1">{warning}</p>
)}

      <p className="text-base font-semibold mt-1 text-gray-700">Total Score: {totalScore} / 100</p>
      {loginType === "committee" && (
          <div className="mt-4">
            <label className="block mb-1 font-semibold text-yellow-600">
              Committee Total Score (out of 100):
            </label>
            <input
              type="number"
              value={committeeTotalScore}
              onChange={(e) => handleCommitteeTotalScoreChange(e.target.value)}
              className="w-32 px-2 py-1 border border-yellow-400 rounded"
            />
          </div>
        )}    
    </div>
  );
}
