import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function CertificatesPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="certificates" 
      title="Certificate Programs" 
      subtitle="Record and review certificate programs offered by the institution" 
      fields={[
        { name: "coordinator", label: "Course Coordinator", type: "text", required: true },
        { name: "programName", label: "Name of Add on/Certificate Programs Offered", type: "text", required: true },
        { name: "courseCode", label: "Course Code (if any)", type: "text" },
        { name: "yearOfOffering", label: "Year of Offering", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "timesOffered", label: "No of Times Offered During the Year", type: "number", required: true },
        { name: "startDate", label: "Start Date", type: "date", required: true },
        { name: "endDate", label: "End Date", type: "date", required: true },
        { name: "duration", label: "Duration (in hours)", type: "number", required: true },
        { name: "enrolled", label: "Number of Students Enrolled", type: "number", required: true },
        { name: "completed", label: "Number of Students Completing the Course", type: "number", required: true },
        { name: "report", label: "Upload Report", type: "file", required: true }
      ]} 
    />
  );
}
