import Portfolio from "@/components/Portfolio";
import { getProjects } from "@/lib/projects";

export default function Home() {
  return <Portfolio projects={getProjects()} />;
}
