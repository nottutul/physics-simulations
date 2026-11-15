export interface Simulation {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  href: string;
  status: "active" | "upcoming";
  badge: string;
}
