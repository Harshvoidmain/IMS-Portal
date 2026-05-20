import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function ExpertLecturesPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="expert_lectures" 
      title="Expert Lecture Summary" 
      subtitle="Provide summaries and details for expert lectures organized" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "numberOfLectures", label: "Number of Expert Lectures", type: "number", required: true },
        { name: "report", label: "Expert Lecture Summary (T-25) PDF", type: "file", required: true }
      ]} 
    />
  );
}
