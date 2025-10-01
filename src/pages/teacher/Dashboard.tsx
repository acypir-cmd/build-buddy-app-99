import { AppLayout } from "@/components/layouts/AppLayout";
import { TopHeader } from "@/components/layouts/TopHeader";
import { BottomNavigation } from "@/components/layouts/BottomNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  // Mock data - will be replaced with real data in Phase 6
  const mockData = {
    classes: [
      { name: "Math 101", students: 28, avgProgress: 82, color: "bg-chart-1" },
      { name: "Math 102", students: 25, avgProgress: 78, color: "bg-chart-2" },
      { name: "Advanced Math", students: 15, avgProgress: 85, color: "bg-chart-3" },
    ],
    recentActivity: [
      { student: "John Doe", action: "Submitted assignment", class: "Math 101", time: "1 hour ago" },
      { student: "Jane Smith", action: "Completed quiz", class: "Math 102", time: "3 hours ago" },
      { student: "Bob Johnson", action: "Viewed feedback", class: "Advanced Math", time: "5 hours ago" },
    ],
  };

  const totalStudents = mockData.classes.reduce((sum, cls) => sum + cls.students, 0);
  const avgProgress = Math.round(
    mockData.classes.reduce((sum, cls) => sum + cls.avgProgress, 0) / mockData.classes.length
  );

  return (
    <AppLayout>
      <TopHeader title="Teacher Dashboard" />
      
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
                  <p className="text-2xl font-heading font-bold">{mockData.classes.length}</p>
                  <p className="text-xs text-muted-foreground">Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold">My Classes</h2>
            <Button size="sm" variant="outline">View All</Button>
          </div>
          <div className="space-y-3">
            {mockData.classes.map((cls) => (
              <Card key={cls.name} className="card-shadow hover:shadow-lg transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${cls.color} flex items-center justify-center`}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold">{cls.name}</h3>
                        <p className="text-sm text-muted-foreground">{cls.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-heading font-bold text-primary">{cls.avgProgress}%</p>
                      <p className="text-xs text-muted-foreground">Avg Progress</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-smooth"
                      style={{ width: `${cls.avgProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4">Recent Activity</h2>
          <Card className="card-shadow">
            <CardContent className="p-0">
              {mockData.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`p-4 flex items-start gap-3 ${
                    index !== mockData.recentActivity.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.action} • {activity.class}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="touch-friendly">Add Progress</Button>
          <Button variant="outline" className="touch-friendly">View Classes</Button>
        </div>
      </main>

      <BottomNavigation role="teacher" />
    </AppLayout>
  );
}
