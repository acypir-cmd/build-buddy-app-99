import { AppLayout } from "@/components/layouts/AppLayout";
import { TopHeader } from "@/components/layouts/TopHeader";
import { BottomNavigation } from "@/components/layouts/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";

export default function HeadTeacherDashboard() {
  // Mock data - will be replaced with real data in Phase 6
  const mockData = {
    stats: {
      totalStudents: 450,
      totalClasses: 18,
      avgPerformance: 79,
      topPerforming: 12,
    },
    classPerformance: [
      { name: "Grade 10A", avg: 85, trend: "up" },
      { name: "Grade 10B", avg: 78, trend: "up" },
      { name: "Grade 11A", avg: 82, trend: "down" },
      { name: "Grade 11B", avg: 76, trend: "up" },
      { name: "Grade 12A", avg: 88, trend: "up" },
    ],
    teacherOverview: [
      { name: "Ms. Johnson", classes: 3, students: 75, avgRating: 4.8 },
      { name: "Mr. Smith", classes: 2, students: 50, avgRating: 4.6 },
      { name: "Dr. Williams", classes: 2, students: 40, avgRating: 4.9 },
    ],
  };

  return (
    <AppLayout>
      <TopHeader title="School Overview" />
      
      <main className="container px-4 py-6 pb-24 space-y-6">
        {/* School-wide Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{mockData.stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{mockData.stats.totalClasses}</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{mockData.stats.avgPerformance}%</p>
                  <p className="text-xs text-muted-foreground">Avg Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-chart-5/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-chart-5" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{mockData.stats.topPerforming}</p>
                  <p className="text-xs text-muted-foreground">Top Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance */}
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">Class Performance</h2>
          <Card className="card-shadow">
            <CardContent className="p-0">
              {mockData.classPerformance.map((cls, index) => (
                <div
                  key={cls.name}
                  className={`p-4 flex items-center justify-between ${
                    index !== mockData.classPerformance.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div>
                    <p className="font-heading font-semibold">{cls.name}</p>
                    <p className="text-sm text-muted-foreground">Average: {cls.avg}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp 
                      className={`h-5 w-5 ${
                        cls.trend === "up" ? "text-success" : "text-destructive"
                      } ${cls.trend === "down" ? "rotate-180" : ""}`}
                    />
                    <span className={`text-sm font-medium ${
                      cls.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {cls.trend === "up" ? "+5%" : "-3%"}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Teacher Overview */}
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">Teacher Overview</h2>
          <div className="space-y-3">
            {mockData.teacherOverview.map((teacher) => (
              <Card key={teacher.name} className="card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-semibold">{teacher.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {teacher.classes} classes • {teacher.students} students
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-chart-3" />
                        <span className="font-heading font-bold">{teacher.avgRating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation role="headteacher" />
    </AppLayout>
  );
}
