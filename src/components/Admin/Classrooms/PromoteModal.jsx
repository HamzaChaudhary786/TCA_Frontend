import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { useStudentPromotion } from '../../../api/Admin/promoteStudents';

const PromoteModal = ({ classrooms = [], classroomStudents = {}, setPromotePopupMenu }) => {
  const { allLevels = [] } = useAdmin();
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const [sourceClassroom, setSourceClassroom] = useState('');
  const [sourceLevel, setSourceLevel] = useState('');
  const [targetClassroom, setTargetClassroom] = useState('');
  const [targetLevel, setTargetLevel] = useState('');

  const { promoteStudents, isLoading } = useStudentPromotion();
  const students = classroomStudents?.students || [];

  const handleStudentToggle = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = students.map((s) => s.id);
    setSelectedStudentIds(selectAll ? [] : allIds);
    setSelectAll(!selectAll);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    const selectedStudents = students
      .filter((s) => selectedStudentIds.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        rollNo: s.rollNo,
      }));

    const promotionData = {
      sourceClassroom,
      sourceLevel,
      targetClassroom,
      targetLevel,
      promotorDescription: description,
      students: selectedStudents,
    };

    console.log(promotionData, "promoted students are");


    promoteStudents(promotionData);
    setPromotePopupMenu(false); // close modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8">
      <div className="relative w-full max-w-2xl max-h-screen overflow-y-auto bg-gradient-to-br from-white via-blue-50 to-white rounded-3xl shadow-2xl border border-gray-200 p-8 space-y-8">

        <button
          onClick={setPromotePopupMenu}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-4xl font-bold text-center text-blue-800 flex items-center justify-center gap-3">
          🎓 Promote Students 🚀
        </h2>

        {/* Source & Target Classroom & Level */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">📘 Source Classroom</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={sourceClassroom}
              onChange={(e) => setSourceClassroom(e.target.value)}
            >
              <option value="">-- Select --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">🎒 Source Level</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={sourceLevel}
              onChange={(e) => setSourceLevel(e.target.value)}
            >
              <option value="">-- Select --</option>
              {allLevels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">🎯 Target Classroom</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={targetClassroom}
              onChange={(e) => setTargetClassroom(e.target.value)}
            >
              <option value="">-- Select --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">🏆 Target Level</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
            >
              <option value="">-- Select --</option>
              {allLevels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">📝 Promotion Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows={3}
            placeholder="Reason for promotion..."
          />
        </div>

        {/* File Upload (optional) */}
        <div>
          <label className="block font-semibold mb-1">📎 Upload File (Optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Student List */}
        <div className="border rounded p-3 bg-gray-50 max-h-60 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">🧑‍🎓 Select Students</p>
            <label className="text-sm">
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              <span className="ml-2">Select All</span>
            </label>
          </div>

          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            students.map((student) => (
              <label
                key={student.id}
                className={`block p-2 rounded border mb-1 ${selectedStudentIds.includes(student.id) ? 'bg-blue-100 border-blue-400' : 'border-gray-200'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span>{student.name} ({student.rollNo})</span>
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                  />
                </div>
              </label>
            ))
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={
            !sourceClassroom || !sourceLevel || !targetClassroom || !targetLevel || selectedStudentIds.length === 0 || isLoading
          }
          className={`w-full py-3 mt-4 rounded-lg font-semibold ${selectedStudentIds.length > 0
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF]'
              : 'bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed'
            }`}
        >
          🚀 {isLoading ? 'Promoting...' : `Promote ${selectedStudentIds.length} Student(s)`}
        </button>

      </div>
    </div>
  );
};

export default PromoteModal;
