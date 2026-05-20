"use client";

import { useState, useEffect, useContext } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { AuthContext } from "@/lib/context/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileSpreadsheet, Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "number" | "date" | "select" | "file";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  conditional?: {
    dependsOn: string;
    value: string;
  };
}

interface ActivityModuleTemplateProps {
  collectionName: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

export function ActivityModuleTemplate({ collectionName, title, subtitle, fields }: ActivityModuleTemplateProps) {
  const { userDoc } = useContext(AuthContext);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File>>({});

  const deptId = userDoc?.departmentId || "";

  useEffect(() => {
    if (!deptId) return;
    const fetchRecords = async () => {
      try {
        const q = query(collection(db, collectionName), where("dept", "==", deptId));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
        toast.error("Failed to load records.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [deptId, collectionName]);

  const handleExport = () => {
    if (records.length === 0) {
      toast.error("No records to export.");
      return;
    }
    const headers = ["ID", ...fields.filter(f => f.type !== "file").map(f => f.label), "Status"];
    const csvContent = [
      headers.join(","),
      ...records.map(r => 
        [r.id, ...fields.filter(f => f.type !== "file").map(f => `"${r[f.name] || ""}"`), r.status || "Pending"].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${collectionName}_Records.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported successfully!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptId) return toast.error("Department not found in user profile.");
    setIsSubmitting(true);

    try {
      const finalData: Record<string, any> = { ...formData, dept: deptId, status: "Pending", createdAt: serverTimestamp() };

      // Upload files
      for (const key of Object.keys(files)) {
        const file = files[key];
        const storageRef = ref(storage, `activity_coordination/${collectionName}/${deptId}_${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        finalData[key] = url;
      }

      const docRef = await addDoc(collection(db, collectionName), finalData);
      setRecords(prev => [...prev, { id: docRef.id, ...finalData }]);
      toast.success("Record added successfully!");
      setIsDialogOpen(false);
      setFormData({});
      setFiles({});
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to add record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const stats = {
    total: records.length,
    approved: records.filter(r => r.status === "Approved").length,
    pending: records.filter(r => r.status === "Pending" || !r.status).length,
    sentBack: records.filter(r => r.status === "Sent Back").length,
  };

  const filteredRecords = records.filter(r => 
    Object.values(r).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Records" value={stats.total} icon={FileSpreadsheet} />
        <StatsCard title="Approved" value={stats.approved} icon={CheckCircle} className="text-green-600" />
        <StatsCard title="Pending" value={stats.pending} icon={Clock} className="text-amber-500" />
        <StatsCard title="Sent Back" value={stats.sentBack} icon={XCircle} className="text-red-500" />
      </div>

      <div className="bg-card p-4 rounded-t-xl border flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Data</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Data: {title}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Department</Label>
                    <Input value={deptId} disabled className="bg-muted" />
                  </div>
                  
                  {fields.map((field) => {
                    // Check conditional rendering
                    if (field.conditional && formData[field.conditional.dependsOn] !== field.conditional.value) {
                      return null;
                    }

                    return (
                      <div key={field.name} className={field.type === "file" ? "col-span-full" : ""}>
                        <Label>{field.label} {field.required && <span className="text-red-500">*</span>}</Label>
                        {field.type === "text" || field.type === "number" || field.type === "date" ? (
                          <Input
                            type={field.type}
                            required={field.required}
                            value={formData[field.name] || ""}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          />
                        ) : field.type === "select" ? (
                          <Select 
                            required={field.required}
                            value={formData[field.name] || ""}
                            onValueChange={(val) => handleFieldChange(field.name, val)}
                          >
                            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                              {field.options?.map(opt => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "file" ? (
                          <Input 
                            type="file" 
                            accept=".pdf,.doc,.docx"
                            required={field.required}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFiles(prev => ({ ...prev, [field.name]: e.target.files![0] }));
                              }
                            }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                  <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Data"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleExport} className="text-green-600 border-green-200 hover:bg-green-50">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder="Search records..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <div className="border rounded-b-xl overflow-x-auto bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-3">Sr</th>
              {fields.filter(f => f.type !== "file" && !f.conditional).slice(0, 5).map(f => (
                <th key={f.name} className="px-4 py-3 truncate">{f.label}</th>
              ))}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Report</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="text-center py-8">Loading...</td></tr>
            ) : filteredRecords.length === 0 ? (
              <tr><td colSpan={10} className="text-center py-8 text-muted-foreground">No records found.</td></tr>
            ) : (
              filteredRecords.map((record, idx) => (
                <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3">{idx + 1}</td>
                  {fields.filter(f => f.type !== "file" && !f.conditional).slice(0, 5).map(f => (
                    <td key={f.name} className="px-4 py-3 truncate max-w-[200px]">{record[f.name]}</td>
                  ))}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === "Approved" ? "bg-green-100 text-green-700" :
                      record.status === "Sent Back" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {record.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {fields.filter(f => f.type === "file").map(f => (
                      record[f.name] ? (
                        <a key={f.name} href={record[f.name]} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs block">
                          View {f.label}
                        </a>
                      ) : null
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
