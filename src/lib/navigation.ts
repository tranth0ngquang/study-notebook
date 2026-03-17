import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  PlaySquare,
  ScanSearch,
  Search,
  Upload,
} from "lucide-react";

export const appNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/lectures", label: "Lectures", icon: PlaySquare },
  { href: "/materials", label: "Materials", icon: Upload },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/review", label: "Review", icon: ScanSearch },
  { href: "/search", label: "Search", icon: Search },
] as const;

export const dashboardOverviewCards = [
  {
    title: "Dashboard",
    description: "Personal study visibility across recent courses, lectures, and tasks.",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    description: "Course management, lecture organization, and review entry points.",
    icon: BookOpen,
  },
  {
    title: "Tasks",
    description: "Assignments and action items tracked across lecture workflows.",
    icon: ClipboardList,
  },
  {
    title: "Search",
    description: "Course-scoped search across lecture notes, concepts, and questions.",
    icon: Search,
  },
] as const;
