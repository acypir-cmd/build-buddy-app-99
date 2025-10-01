import { AppLayout } from "@/components/layouts/AppLayout";
import { TopHeader } from "@/components/layouts/TopHeader";
import { BottomNavigation } from "@/components/layouts/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, Award, Clock } from "lucide-react";

export default function StudentDashboard() {
  // Mock data - will be replaced with real data in Phase 6
  const mockData = {
    subjects: [
      { name: "Mathematics", grade: "A", progress: 85, color: "text-chart-1" },
      { name: "Science", grade: "B+", progress: 78, color: "text-chart-2" },
      { name: "English", grade: "A-", progress: 82, color: "text-chart-3" },
      { name: "History", grade: "B", progress: 75, color: "text-chart-4" },
    ],
    recentUpdates: [
      { subject: "Mathematics", update: "Quiz grade: 92%", time: "2 hours ago" },
      { subject: "Science", update: "Lab report submitted", time: "1 day ago" },
      { subject: "English", update: "Essay feedback available", time: "2 days ago" },
    ],
  };

  return (
    <AppLayout>
      <TopHeader title="My Dashboard" />
      
      <main className="container px-4 py-6 pb-24 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{mockData.subjects.length}</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">80%</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress Cards */}
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">My Progress</h2>
          <div className="space-y-3">
            {mockData.subjects.map((subject) => (
              <Card key={subject.name} className="card-shadow hover:shadow-lg transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Award className={`h-5 w-5 ${subject.color}`} />
                      <div>
                        <h3 className="font-heading font-semibold">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">Grade: {subject.grade}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-heading font-bold text-primary">
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-smooth"
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">Recent Updates</h2>
          <Card className="card-shadow">
            <CardContent className="p-0">
              {mockData.recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className={`p-4 flex items-start gap-3 ${
                    index !== mockData.recentUpdates.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{update.subject}</p>
                    <p className="text-sm text-muted-foreground">{update.update}</p>
                    <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation role="student" />
    </AppLayout>
  );
}
