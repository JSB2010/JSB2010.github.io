"use client";

interface ProjectDetailProps {
  projectId: string;
  projectName: string;
  children: React.ReactNode;
}

export function ProjectDetail({
  projectId,
  projectName,
  children
}: Readonly<ProjectDetailProps>) {
  return (
    <div className="space-y-8">
      {/* Main content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
