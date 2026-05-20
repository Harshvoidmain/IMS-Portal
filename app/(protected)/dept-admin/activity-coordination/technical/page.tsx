import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function TechnicalPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="technical" 
      title="Technical & Non-Technical Competitions" 
      subtitle="Submit results and details of technical and non-technical competitions" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "cellClub", label: "Cell/Club", type: "text", required: true },
        { name: "title", label: "Title of activity", type: "text", required: true },
        { name: "type", label: "Type of activity", type: "select", options: ["Poster Competition", "Project Competition", "Hackathon", "Sport Events/Competition", "Cultural Events/Competitions", "Others"], required: true },
        { name: "typeOther", label: "If others, please specify", type: "text", conditional: { dependsOn: "type", value: "Others" } },
        { name: "noOfParticipants", label: "Number of Participants", type: "number", required: true },
        { name: "nameOfParticipants", label: "Names of Participants", type: "text", required: true },
        { name: "startDate", label: "Starting Date", type: "date", required: true },
        { name: "endDate", label: "Ending Date", type: "date", required: true },
        { name: "report", label: "Upload Activity Report", type: "file", required: true }
      ]} 
    />
  );
}
