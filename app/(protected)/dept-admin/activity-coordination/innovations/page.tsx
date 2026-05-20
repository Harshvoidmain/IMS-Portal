import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function InnovationsPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="innovations" 
      title="Innovative Technique Summary" 
      subtitle="Document innovative teaching techniques and methodologies adopted" 
      fields={[
        { name: "academicYear", label: "Academic Year", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "term", label: "FH/SH 20-", type: "text", required: true },
        { name: "summary", label: "Summary of activities", type: "text", required: true },
        { name: "report", label: "Innovative Summary (T-23) PDF", type: "file", required: true }
      ]} 
    />
  );
}
