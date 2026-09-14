import React from 'react';
import { Award, Building2, Calendar, MapPin } from 'lucide-react';
import { Course } from '../../types';

interface CoursesSectionProps {
  courses: Course[];
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses }) => {
  const sortedCourses = [...courses].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <section id="pelatihan" className="py-14 md:py-20 border-t border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-3 border border-blue-100">
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikasi & Pelatihan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
            Course & Training
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl">
            Program peningkatan kapasitas keahlian, sertifikasi profesional, dan lokakarya terakreditasi.
          </p>
        </div>

        {/* List of Courses (as specified in PRD 4.5 as a separate section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-2">
                  {course.course_name}
                </h3>

                <div className="space-y-1.5 mb-4 text-xs sm:text-sm text-zinc-600">
                  <div className="flex items-center gap-2 font-medium text-zinc-800">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{course.organizer}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {course.year}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {course.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          ))}

          {sortedCourses.length === 0 && (
            <p className="text-sm text-zinc-500 italic col-span-full">Belum ada riwayat pelatihan yang ditambahkan.</p>
          )}
        </div>
      </div>
    </section>
  );
};
