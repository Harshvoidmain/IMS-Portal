import { ActivityModuleTemplate } from "@/components/dept-admin/ActivityModuleTemplate";

export default function OutreachPage() {
  return (
    <ActivityModuleTemplate 
      collectionName="outreach" 
      title="Outreach Activities" 
      subtitle="Track and submit outreach activities conducted for the community" 
      fields={[
        { name: "activityName", label: "Name of the Activity", type: "text", required: true },
        { name: "organizingUnit", label: "Organizing unit/agency/collaborating agency", type: "text" },
        { name: "coordinators", label: "Name of the Coordinators", type: "text", required: true },
        { name: "scheme", label: "Name of the scheme", type: "select", options: ["NSS", "UBA", "EBSB", "Green-Club", "Others"], required: true },
        { name: "schemeOther", label: "If other scheme, please specify", type: "text", conditional: { dependsOn: "scheme", value: "Others" } },
        { name: "datesConducted", label: "Date/Dates conducted", type: "text", required: true },
        { name: "year", label: "Year of the activity", type: "select", options: ["2022-23", "2023-24", "2024-25", "2025-26"], required: true },
        { name: "volunteers", label: "No. of students volunteered", type: "number", required: true },
        { name: "benefitted", label: "No. of people benefitted", type: "number", required: true },
        { name: "report", label: "Upload Report", type: "file", required: true }
      ]} 
    />
  );
}
