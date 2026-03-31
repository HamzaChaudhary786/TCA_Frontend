import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IoClose, IoSchool, IoPencil, IoCheckmarkCircle, IoBook, IoText, IoGrid, IoStar, IoPeople } from "react-icons/io5";
import { useMutation } from '@tanstack/react-query';
import { useBlur } from "../../../context/BlurContext";
import { useAdmin } from "../../../context/AdminContext";
import { createClassroom } from '../../../api/Admin/classroomApi';
import { toast } from 'react-toastify';
import { useGetAllStudentsWithLevel } from '../../../api/Admin/AdminApi';
import { useGetAllSubjectsWithLevel } from '../../../api/Admin/SubjectsApi';

// ─── Skeleton Loader ────────────────────────────────────────────────────────
const SkeletonRow = ({ count = 4, className = "" }) => (
  <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-10 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"
        style={{ animationDelay: `${i * 80}ms` }}
      />
    ))}
  </div>
);

// ─── Select Dropdown ─────────────────────────────────────────────────────────
const Selectable = ({ label, options = [], setSelectedOption, selectedOption }) => (
  <div className="flex flex-col gap-1.5">
    <div className="relative">
      <select
        value={selectedOption ? JSON.stringify(selectedOption) : ""}
        onChange={(e) => {
          if (!e.target.value) return setSelectedOption(null);
          setSelectedOption(JSON.parse(e.target.value));
        }}
        className="w-full px-4 py-2.5 pr-10 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl
                   appearance-none cursor-pointer transition-all duration-200
                   hover:border-[#6A00FF] focus:outline-none focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/15"
      >
        <option value="">— Select —</option>
        {options.map((item) => (
          <option key={item.id} value={JSON.stringify(item)}>
            {item.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

// ─── Avatar ──────────────────────────────────────────────────────────────────
const Avatar = ({ name = "", src }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return src
    ? <img src={src} alt={name} className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200" />
    : (
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6A00FF] to-[#9B4DFF] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
        {initials}
      </div>
    );
};

// ─── Multi-Select Field ───────────────────────────────────────────────────────
const MultiSelectField = ({ options = [], placeholder, onSelect, isLoading }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [search, setSearch] = useState('');
  const allSelected = selectedOptions.length === options.length && options.length > 0;

  const filtered = options.filter(o =>
    o.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = useCallback((option) => {
    setSelectedOptions(prev => {
      const next = prev.includes(option)
        ? prev.filter(i => i !== option)
        : [...prev, option];
      onSelect(next);
      return next;
    });
  }, [onSelect]);

  const toggleAll = () => {
    const next = allSelected ? [] : options;
    setSelectedOptions(next);
    onSelect(next);
  };

  if (isLoading) return <SkeletonRow count={8} />;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${placeholder}...`}
            className="w-full pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-200
                       rounded-xl focus:outline-none focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/15 transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap ${allSelected
            ? 'bg-[#6A00FF] border-[#6A00FF] text-white'
            : 'border-gray-200 text-gray-500 hover:border-[#6A00FF] hover:text-[#6A00FF]'
            }`}
        >
          {allSelected ? '✓ All' : 'Select All'}
        </button>
      </div>

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map(opt => (
            <span
              key={opt.id}
              onClick={() => toggle(opt)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6A00FF]/8 border border-[#6A00FF]/20 text-xs text-[#6A00FF] cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all group"
            >
              <Avatar name={opt.name} src={opt.profilePic} />
              {opt.name}
              <IoClose className="w-3 h-3 opacity-40 group-hover:opacity-100" />
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-44 overflow-y-auto custom-scrollbar pr-1">
        {filtered.map(option => {
          const checked = selectedOptions.includes(option);
          return (
            <div
              key={option.id}
              onClick={() => toggle(option)}
              className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border text-sm
                ${checked
                  ? 'bg-[#6A00FF]/8 border-[#6A00FF]/30 text-[#6A00FF]'
                  : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-[#6A00FF]/30 hover:bg-[#6A00FF]/5'
                }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all ${checked ? 'bg-[#6A00FF] border-[#6A00FF]' : 'border-gray-300 bg-white'
                }`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>}
              </div>
              <Avatar name={option.name} src={option.profilePic} />
              <span className="truncate text-xs font-medium">{option.name}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 py-6 text-center text-gray-400 text-sm">No results found</div>
        )}
      </div>
    </div>
  );
};

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ icon, text, badge }) => (
  <div className="flex items-center justify-between mb-2.5">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
      <span>{icon}</span>{text}
    </label>
    {badge != null && badge > 0 && (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6A00FF]/10 text-[#6A00FF] border border-[#6A00FF]/20 font-semibold">
        {badge} selected
      </span>
    )}
  </div>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => <div className="h-px bg-gray-100 my-1" />;

// ─── Main Modal ───────────────────────────────────────────────────────────────
const ClassModal = ({ open, setopen, isEditTrue, refetch, editData }) => {
  const ref = useRef(null);
  const scrollRef = useRef(null); // ← NEW: ref to hold scroll position
  const [headTeacher, setHeadTeacher] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState({});
  const [classroomName, setClassroomName] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [teacherArr, setTeachersArr] = useState([]);

  const { adminUsersData, allLevels } = useAdmin();
  const { toggleBlur } = useBlur();

  const { studentWithLevel = [], isLoading: studentsLoading } = useGetAllStudentsWithLevel(selectedLevel?.id);
  const { subjectWithLevel = [], isLoading: subjectsLoading } = useGetAllSubjectsWithLevel(selectedLevel?.id);

  const handleClose = useCallback(() => {
    setopen(false);
    toggleBlur();
  }, [setopen, toggleBlur]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) handleClose(); };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, handleClose]);

  useEffect(() => {
    setSelectedTeachers([]);
    setSelectedStudents([]);
    setSelectedSubjects({});
    setTeachersArr([]);
    setHeadTeacher(null);
  }, [selectedLevel]);

  // ─── FIXED: merged both state updates into one updater to prevent double re-render / scroll jump
  const handleSubjectCheckboxChange = useCallback((teacherId, subject, isChecked) => {
    // Preserve scroll position before state update
    const scrollTop = scrollRef.current?.scrollTop ?? 0;

    setSelectedSubjects(prev => {
      const curr = prev[teacherId] || [];
      const updatedSubjects = isChecked
        ? [...curr, subject]
        : curr.filter(s => s.id !== subject.id);

      const newSubjectsState = { ...prev, [teacherId]: updatedSubjects };

      // Derive teacherArr inside the same updater — no stale closure, single render
      setTeachersArr(() =>
        Object.entries(newSubjectsState).flatMap(([tid, subjects]) =>
          subjects.map(subj => ({
            teacher: tid,
            subject: subj.id,
            type: headTeacher?.id === tid ? "head" : "teacher",
          }))
        )
      );

      return newSubjectsState;
    });

    // Restore scroll position after paint
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollTop;
    });
  }, [headTeacher]);

  const createClassroomMutation = useMutation({
    mutationKey: ["addclassroom"],
    mutationFn: (data) => createClassroom(data),
    onSuccess: async () => {
      await refetch();
      handleClose();
      toast.success("Classroom created successfully! 🎉");
    },
    onError: () => toast.error("Failed to create classroom. Please try again."),
  });

  const handleCreateClass = () => {
    const nameOk = /^[a-zA-Z0-9\s]+$/.test(classroomName.trim());
    if (!classroomName.trim()) return toast.error("Enter a classroom name.");
    if (!nameOk) return toast.error("Classroom name must not contain special characters.");
    if (!selectedLevel) return toast.error("Select a level.");
    if (selectedTeachers.length === 0) return toast.error("Select at least one teacher.");
    if (selectedStudents.length === 0) return toast.error("Select at least one student.");

    createClassroomMutation.mutate({
      name: classroomName.trim(),
      levelID: selectedLevel.id,
      students: selectedStudents.map(s => s.id),
      teachers: teacherArr,
      headTeacher: headTeacher?.id || "",
    });
  };

  if (!open) return null;

  const isPending = createClassroomMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        ref={ref}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl  bg-white border border-gray-100"
        style={{ boxShadow: '0 20px 60px rgba(106,0,255,0.10), 0 8px 24px rgba(0,0,0,0.10)' }}
      >
        {/* Purple top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#6A00FF] to-[#9B4DFF] flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6A00FF]/10 flex items-center justify-center">
              {isEditTrue
                ? <IoPencil className="w-4 h-4 text-[#6A00FF]" />
                : <IoSchool className="w-4 h-4 text-[#6A00FF]" />
              }
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 leading-tight">
                {isEditTrue ? "Edit Classroom" : "Create Classroom"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <Divider />

        {/* ─── Scrollable Body — overflowAnchor:none stops browser scroll-anchor jumping ─── */}
        <div
          ref={scrollRef}
          className="flex flex-col overflow-y-auto px-7 py-5 space-y-5 custom-scrollbar"
          style={{ overflowAnchor: 'none' }}
        >

          {/* Classroom Name */}
          <div className="flex-1">
            <SectionLabel icon={<IoText className="w-4 h-4 text-[#6A00FF]" />} text="Classroom Name" />
            <input
              value={classroomName}
              onChange={e => setClassroomName(e.target.value)}
              placeholder="e.g. Grade 10 Alpha"
              className="w-full px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 bg-white border border-gray-200
                         rounded-xl focus:outline-none focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/15 transition-all"
            />
          </div>

          <Divider />

          {/* Level */}
          <div>
            <SectionLabel icon={<IoGrid className="w-4 h-4 text-[#6A00FF]" />} text="Level" />
            <Selectable
              options={allLevels}
              setSelectedOption={setSelectedLevel}
              selectedOption={selectedLevel}
            />
          </div>

          {selectedLevel && (
            <>
              <Divider />

              {/* Head Teacher */}
              <div>
                <SectionLabel icon={<IoStar className="w-4 h-4 text-amber-500" />} text="Head Teacher" />
                <p className="text-[11px] text-gray-400 -mt-1.5 mb-2">Optional — assigns this teacher a head role</p>
                <Selectable
                  options={adminUsersData.allTeachers}
                  setSelectedOption={setHeadTeacher}
                  selectedOption={headTeacher}
                />
              </div>

              <Divider />

              {/* Teachers */}
              <div>
                <SectionLabel icon={<IoPeople className="w-4 h-4 text-[#6A00FF]" />} text="Teachers" badge={selectedTeachers.length} />
                <MultiSelectField
                  placeholder="teachers"
                  onSelect={setSelectedTeachers}
                  options={adminUsersData.allTeachers}
                />
              </div>

              {/* Subject assignment per teacher */}
              {selectedTeachers.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <SectionLabel icon={<IoBook className="w-4 h-4 text-[#6A00FF]" />} text="Assign Subjects to Teachers" />
                    <div className="space-y-3">
                      {selectedTeachers.map(teacher => (
                        <div key={teacher.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar name={teacher.name} src={teacher.profilePic} />
                            <span className="text-sm font-semibold text-gray-700">{teacher.name}</span>
                            {headTeacher?.id === teacher.id && (
                              <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-semibold">
                                HEAD
                              </span>
                            )}
                          </div>
                          {subjectsLoading ? (
                            <SkeletonRow count={4} />
                          ) : subjectWithLevel.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No subjects available for this level.</p>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {subjectWithLevel.map(subject => {
                                const checked = selectedSubjects[teacher.id]?.some(s => s.id === subject.id) ?? false;
                                return (
                                  <label
                                    key={subject.id}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border text-xs transition-all
                                      ${checked
                                        ? 'bg-[#6A00FF]/8 border-[#6A00FF]/30 text-[#6A00FF]'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#6A00FF]/30 hover:bg-[#6A00FF]/5'
                                      }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={e => handleSubjectCheckboxChange(teacher.id, subject, e.target.checked)}
                                      className="sr-only"
                                    />
                                    <div className={`w-3.5 h-3.5 rounded flex-shrink-0 flex items-center justify-center border transition-all ${checked ? 'bg-[#6A00FF] border-[#6A00FF]' : 'border-gray-300 bg-white'
                                      }`}>
                                      {checked && <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>}
                                    </div>
                                    <IoBook className="w-3 h-3 flex-shrink-0 text-current" />
                                    <span className="truncate">{subject.name}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Divider />

              {/* Students */}
              <div>
                <SectionLabel icon={<IoSchool className="w-4 h-4 text-[#6A00FF]" />} text="Students" badge={selectedStudents.length} />
                <MultiSelectField
                  placeholder="students"
                  onSelect={setSelectedStudents}
                  options={studentWithLevel ?? []}
                  isLoading={studentsLoading}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <Divider />
        <div className="px-7 py-4 flex-shrink-0 bg-gray-50/80 h-fit">
          <button
            onClick={handleCreateClass}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200
                       bg-gradient-to-r from-[#6A00FF] to-[#6A00FF]/80 hover:from-[#5800d4] hover:to-[#5800d4]/80
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg shadow-[#6A00FF]/25 hover:shadow-[#6A00FF]/35"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {isEditTrue ? "Updating…" : "Creating…"}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <IoCheckmarkCircle className="w-4 h-4" />
                {isEditTrue ? "Update Classroom" : "Create Classroom"}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
