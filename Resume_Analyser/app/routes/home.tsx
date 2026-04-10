import type { Route } from "./+types/home";
import Navvbar from "~/components/Navvbar";
import { usePuterStore } from '~/lib/puter'
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumeind" },
    { name: "description", content: "Samrt feedback fro your dream job" },
  ];
}

export default function Home() {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoading && !auth.isAuthenticated){
        navigate('/auth?next=/');
    }
},[auth.isAuthenticated, isLoading, navigate])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">

    <Navvbar/>
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Application & Resume Ratings</h1>
        <h2>Review Your submission and check AI-Powered feedback</h2>
      </div>
    

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume}/>
          ))}
        </div>
      )}
    </section>
  </main>;
}