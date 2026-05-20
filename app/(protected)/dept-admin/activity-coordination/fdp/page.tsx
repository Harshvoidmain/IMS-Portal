import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function FDPPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="fdp" 
      title="FDP / STTP Organized" 
      subtitle="Manage Faculty Development Programs and Short Term Training Programs" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "organizedFor", label: "Organized for", type: "select", options: ["Teaching", "Non-Teaching"], required: true },
        { name: "title", label: "Title of the Professional Development Program", type: "text", required: true },
        { name: "approvedBy", label: "Approved by / In Association with", type: "select", options: ["AICTE", "ISTE", "Others"], required: true },
        { name: "grantAmount", label: "If Sponsored, Enter Grant Amount", type: "number" },
        { name: "convener", label: "Convener of FDP/STTP", type: "text", required: true },
        { name: "startDate", label: "Starting Date", type: "date", required: true },
        { name: "endDate", label: "Ending Date", type: "date", required: true },
        { name: "duration", label: "Duration in days", type: "number", required: true },
        { name: "participants", label: "Number of Participants", type: "number", required: true },
        { name: "report", label: "Submit Report (PDF)", type: "file", required: true }
      ]} 
    />
  );
}
