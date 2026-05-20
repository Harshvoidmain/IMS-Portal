"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Presentation, 
  Users, 
  GraduationCap, 
  Award, 
  Network, 
  Trophy, 
  Mic, 
  Lightbulb 
} from "lucide-react";
import { useRouter } from "next/navigation";

const MODULES = [
  {
    id: "workshops",
    title: "WORKSHOP / SEMINAR ORGANISED",
    description: "View and manage workshops and seminars organised by the department.",
    icon: Presentation,
    href: "/dept-admin/activity-coordination/workshops",
  },
  {
    id: "outreach",
    title: "OUTREACH ACTIVITIES",
    description: "Track and submit outreach activities conducted for the community.",
    icon: Users,
    href: "/dept-admin/activity-coordination/outreach",
  },
  {
    id: "fdp",
    title: "FDP / STTP ORGANIZED",
    description: "Manage Faculty Development Programs and Short Term Training Programs.",
    icon: GraduationCap,
    href: "/dept-admin/activity-coordination/fdp",
  },
  {
    id: "certificates",
    title: "CERTIFICATE PROGRAMS",
    description: "Record and review certificate programs offered by the institution.",
    icon: Award,
    href: "/dept-admin/activity-coordination/certificates",
  },
  {
    id: "collaborations",
    title: "COLLABORATIVE ACTIVITIES",
    description: "Document collaborative activities conducted with other institutions.",
    icon: Network,
    href: "/dept-admin/activity-coordination/collaborations",
  },
  {
    id: "technical",
    title: "TECHNICAL / NON-TECHNICAL",
    description: "Submit results and details of technical and non-technical competitions.",
    icon: Trophy,
    href: "/dept-admin/activity-coordination/technical",
  },
  {
    id: "expert-lectures",
    title: "EXPERT LECTURE SUMMARY",
    description: "Provide summaries and details for expert lectures organized.",
    icon: Mic,
    href: "/dept-admin/activity-coordination/expert-lectures",
  },
  {
    id: "innovations",
    title: "INNOVATIVE TECHNIQUE SUMMARY",
    description: "Document innovative teaching techniques and methodologies adopted.",
    icon: Lightbulb,
    href: "/dept-admin/activity-coordination/innovations",
  },
];

export default function ActivityCoordinationDashboard() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Coordinator Portal"
        subtitle="Manage and track department activities and records"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MODULES.map((module) => (
          <Card 
            key={module.id} 
            className="flex flex-col hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
          >
            <CardHeader className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <module.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-sm font-bold leading-tight uppercase mb-2">
                {module.title}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-3">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="outline" 
                className="w-full justify-center transition-all"
                onClick={() => router.push(module.href)}
              >
                Go to Criteria
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
