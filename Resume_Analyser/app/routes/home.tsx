import type { Route } from "./+types/home";
import Navvbar from "~/components/Navvbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumeind" },
    { name: "description", content: "Samrt feedback fro your dream job" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navvbar/>
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Application & Resume Ratings</h1>
        <h2>Review Your submission and check AI-Powered feedback</h2>
      </div>
    </section>


    {resumes.map((resume) => (
      <ResumeCard key={resume.id} resume={resume}/>
    ))}


  </main>;
}
