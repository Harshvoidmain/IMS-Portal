import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function WorkshopsPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="workshops" 
      title="Workshops & Seminars Organized" 
      subtitle="Manage workshops and seminars organized by the department" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "type", label: "Type", type: "select", options: ["Workshop", "Seminar"], required: true },
        { name: "coordinator", label: "Coordinator", type: "text", required: true },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "category", label: "Category of Activity", type: "select", options: ["Research Methodology", "Intellectual Property Rights (IPR)", "Soft Skills", "Entrepreneurship", "Language and Communication Skills", "Life Skills", "ICT/Computing Skills", "Promotion of Gender Equity", "Value Education", "Ethics", "Environmental Consciousness Activity", "Others"], required: true },
        { name: "categoryOther", label: "If others, please specify", type: "text", conditional: { dependsOn: "category", value: "Others" } },
        { name: "participants", label: "Number of Participants", type: "number", required: true },
        { name: "startDate", label: "Starting Date", type: "date", required: true },
        { name: "endDate", label: "Ending Date", type: "date", required: true },
        { name: "report", label: "Upload Activity Report (PDF)", type: "file", required: true }
      ]} 
    />
  );
}
