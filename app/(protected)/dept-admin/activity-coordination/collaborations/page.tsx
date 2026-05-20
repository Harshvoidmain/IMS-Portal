import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function CollaborationsPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="collaborations" 
      title="Collaborative Activities" 
      subtitle="Document collaborative activities conducted with other institutions" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "title", label: "Title of collaborative activity", type: "text", required: true },
        { name: "agencyName", label: "Name of collaborating Agency", type: "text", required: true },
        { name: "agencyContact", label: "Contact of collaborating Agency", type: "text", required: true },
        { name: "participants", label: "Name of Participants", type: "text", required: true },
        { name: "yearOfCollab", label: "Year of Collaboration", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "durationFrom", label: "Duration (From)", type: "date", required: true },
        { name: "durationTo", label: "Duration (To)", type: "date", required: true },
        { name: "nature", label: "Nature of Activity", type: "select", options: ["Student Project", "Research", "Internships", "Student Exchange", "Faculty Exchange", "Others"], required: true },
        { name: "natureOther", label: "If others, please specify", type: "text", conditional: { dependsOn: "nature", value: "Others" } },
        { name: "certificate", label: "Certificate/Document issued by external agencies", type: "file", required: true }
      ]} 
    />
  );
}
