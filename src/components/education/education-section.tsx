"use client";

import React from "react";
import { TextRevealCard } from "@/components/ui/aceternity/text-reveal-card";
import { AcademicYear, Class, Sport, ExtraCurricular } from "./academic-year";
import { FaNewspaper, FaUsers, FaRunning, FaGraduationCap, FaSchool } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

export function EducationSection() {
  // Freshman year data (2024-2025)
  const freshmanClasses: Class[] = [
    { name: "Algebra II Honors" },
    { name: "English 9" },
    { name: "Molecular and Evolutionary Biology" },
    { name: "Global History of the Modern World" },
    { name: "Spanish II Honors" },
    { name: "AP Computer Science Principles" }
  ];

  const freshmanSports: Sport[] = [
    { name: "Cross Country", icon: <FaRunning className="h-5 w-5" /> }
  ];

  const freshmanExtraCurriculars: ExtraCurricular[] = [
    {
      name: "Speech and Debate",
      description: "Lincoln Douglas Debate",
      icon: <FaUsers className="h-5 w-5" />
    },
    {
      name: "Endowment Club",
      description: "Member",
      icon: <FaUsers className="h-5 w-5" />
    },
    {
      name: "Economics Club",
      description: "Member",
      icon: <FaUsers className="h-5 w-5" />
    },
    {
      name: "The Advocate",
      description: "Writer for the school newspaper",
      icon: <FaNewspaper className="h-5 w-5" />
    }
  ];

  return (
    <div className="w-full">
      {/* No section title here since it's already in the parent component */}

      {/* Freshman Year */}
      <AcademicYear
        year="2024-2025"
        yearLabel="Freshman Year"
        classes={freshmanClasses}
        sports={freshmanSports}
        extraCurriculars={freshmanExtraCurriculars}
        defaultOpen={true}
      />

      {/* Additional years can be added here in the future */}
    </div>
  );
}
