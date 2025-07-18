"use client"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Clock, PlusCircle, BookOpen, BarChart3, AlertCircle, GraduationCap } from "lucide-react"

export default function LecturerDashboard() {
  const stats = [
    {
      title: "Active Assessments",
      value: "8",
      description: "Currently running",
      icon: FileText,
      color: "text-fedpoffa-purple",
    },
    {
      title: "Pending Grading",
      value: "24",
      description: "Theory questions",
      icon: Clock,
      color: "text-fedpoffa-orange",
    },
    {
      title: "Total Students",
      value: "156",
      description: "Across all courses",
      icon: Users,
      color: "text-fedpoffa-green",
    },
    {
      title: "Courses Taught",
      value: "4",
      description: "This semester",
      icon: BookOpen,
      color: "text-fedpoffa-purple",
    },
  ]

  const recentAssessments = [
    {
      id: 1,
      title: "Petroleum Geology Mid-term",
      course: "PET 201",
      type: "Exam",
      students: 45,
      status: "active",
      endDate: "2024-01-20",
    },
    {
      id: 2,
      title: "Drilling Techniques Quiz",
      course: "PET 301",
      type: "Quiz",
      students: 38,
      status: "grading",
      endDate: "2024-01-18",
    },
    {
      id: 3,
      title: "Reservoir Analysis Assignment",
      course: "PET 302",
      type: "Assignment",
      students: 42,
      status: "completed",
      endDate: "2024-01-15",
    },
  ]

  const courses = [
    {
      code: "PET 201",
      name: "Petroleum Geology",
      students: 45,
      assessments: 3,
      department: "Petroleum Engineering",
    },
    {
      code: "PET 301",
      name: "Drilling Engineering",
      students: 38,
      assessments: 2,
      department: "Petroleum Engineering",
    },
    {
      code: "PET 302",
      name: "Reservoir Engineering",
      students: 42,
      assessments: 4,
      department: "Petroleum Engineering",
    },
    {
      code: "PET 401",
      name: "Production Engineering",
      students: 31,
      assessments: 2,
      department: "Petroleum Engineering",
    },
  ]

  const pendingGrading = [
    {
      assessment: "Drilling Techniques Quiz",
      course: "PET 301",
      submissions: 38,
      pending: 12,
      dueDate: "2024-01-22",
    },
    {
      assessment: "Petroleum Geology Essay",
      course: "PET 201",
      submissions: 45,
      pending: 8,
      dueDate: "2024-01-25",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-fedpoffa-purple to-fedpoffa-orange rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome to FEDPOFFA CBT Faculty Portal</h1>
          <p className="text-white/90">Federal Polytechnic of Oil and Gas, Bonny - Lecturer Dashboard</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-16 bg-fedpoffa-purple hover:bg-fedpoffa-purple/90">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Test
          </Button>
          <Button className="h-16 bg-fedpoffa-orange hover:bg-fedpoffa-orange/90">
            <FileText className="mr-2 h-5 w-5" />
            Create Assignment
          </Button>
          <Button className="h-16 bg-fedpoffa-green hover:bg-fedpoffa-green/90">
            <GraduationCap className="mr-2 h-5 w-5" />
            Create Exam
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Assessments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Assessments
              </CardTitle>
              <CardDescription>Your recently created assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                      <p className="text-sm text-gray-600">
                        {assessment.course} • {assessment.students} students
                      </p>
                      <p className="text-xs text-gray-500">Ends: {assessment.endDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          assessment.status === "active"
                            ? "default"
                            : assessment.status === "grading"
                              ? "destructive"
                              : "secondary"
                        }
                        className={
                          assessment.status === "active"
                            ? "bg-fedpoffa-green"
                            : assessment.status === "grading"
                              ? "bg-fedpoffa-orange"
                              : "bg-gray-500"
                        }
                      >
                        {assessment.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Assessments
              </Button>
            </CardContent>
          </Card>

          {/* Pending Grading */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-fedpoffa-orange" />
                Pending Grading
              </CardTitle>
              <CardDescription>Theory questions awaiting your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingGrading.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-fedpoffa-orange/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.assessment}</h4>
                      <Badge variant="destructive" className="bg-fedpoffa-orange">
                        {item.pending} pending
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.course} • {item.submissions} submissions
                    </p>
                    <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
                    <Button size="sm" className="mt-2 bg-fedpoffa-orange hover:bg-fedpoffa-orange/90">
                      Start Grading
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Pending
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Courses Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
            <CardDescription>Courses you are teaching this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{course.code}</h4>
                    <Badge variant="secondary">{course.students} students</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{course.name}</p>
                  <p className="text-xs text-gray-500 mb-3">{course.department}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{course.assessments} assessments</span>
                    <Button size="sm" variant="outline">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Analytics Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Student Performance Overview
            </CardTitle>
            <CardDescription>Quick insights into student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-fedpoffa-green/10 rounded-lg">
                <h4 className="font-medium text-fedpoffa-green">Average Score</h4>
                <p className="text-2xl font-bold text-gray-900">78.5%</p>
                <p className="text-xs text-gray-500">Across all assessments</p>
              </div>
              <div className="p-4 bg-fedpoffa-orange/10 rounded-lg">
                <h4 className="font-medium text-fedpoffa-orange">Completion Rate</h4>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
                <p className="text-xs text-gray-500">Students completing on time</p>
              </div>
              <div className="p-4 bg-fedpoffa-purple/10 rounded-lg">
                <h4 className="font-medium text-fedpoffa-purple">Top Performer</h4>
                <p className="text-lg font-bold text-gray-900">PET 201</p>
                <p className="text-xs text-gray-500">Highest average score</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
