import { useState } from "react";
import { usePuterStore } from "~/lib/puter";
import { getErrorMessage } from "~/lib/utils";
import {
  prepareTailoredResumeInstructions,
  TailoredResumeFormat,
} from "../../constants";
import {
  downloadTailoredDocx,
  downloadTailoredPdf,
} from "~/lib/resumeExport";

const TailoredResume = ({
  id,
  resumePath,
  jobTitle,
  jobDescription,
  savedResume,
}: {
  id: string;
  resumePath: string;
  jobTitle: string;
  jobDescription: string;
  savedResume?: TailoredResume;
}) => {
  const { ai, kv } = usePuterStore();
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(
    savedResume ?? null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusText("Tailoring your resume...");

    const response = await ai.feedback(
      resumePath,
      prepareTailoredResumeInstructions({
        jobTitle,
        jobDescription,
        TailoredResumeFormat,
      })
    );
    if (!response) {
      setIsGenerating(false);
      return setStatusText("Error: Failed to generate resume");
    }

    const responseText =
      typeof response.message.content === "string"
        ? response.message.content
        : response.message.content[0].text;

    let parsedResume: TailoredResume;
    try {
      const cleaned = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedResume = JSON.parse(cleaned);
    } catch (err) {
      console.error("RAW AI RESPONSE:", responseText);
      setIsGenerating(false);
      return setStatusText("Error: Invalid AI response ❌");
    }

    // Save alongside the analysis so it isn't regenerated on every visit
    const resume = await kv.get(`resume:${id}`);
    if (resume) {
      const data = JSON.parse(resume);
      data.tailoredResume = parsedResume;
      await kv.set(`resume:${id}`, JSON.stringify(data));
    }

    setTailoredResume(parsedResume);
    setStatusText("");
    setIsGenerating(false);
  };

  return (
    <div className="rounded-2xl shadow-md w-full bg-gradient-to-b from-light-blue-200 to-light-white p-8 flex flex-col gap-4">
      <p className="text-2xl font-semibold">Tailored Resume</p>
      <p className="text-lg text-gray-500">
        Get a version of your resume rewritten for{" "}
        {jobTitle ? <b>{jobTitle}</b> : "this job"}, using keywords from the
        job description. Nothing is made up, only your existing experience is
        reworded.
      </p>
      {!jobDescription && (
        <div className="flex flex-row gap-2 items-center">
          <img src="/icons/warning.svg" alt="warning" className="w-4 h-4" />
          <p className="text-sm text-gray-500">
            No job description was saved with this resume, so it will be
            tailored to the job title only.
          </p>
        </div>
      )}

      {tailoredResume ? (
        <div className="flex flex-row gap-4 max-sm:flex-col">
          <button
            className="primary-button"
            onClick={() => downloadTailoredPdf(tailoredResume)}
          >
            Download PDF
          </button>
          <button
            className="primary-button"
            onClick={() => downloadTailoredDocx(tailoredResume)}
          >
            Download DOCX
          </button>
        </div>
      ) : (
        <button
          className="primary-button disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() =>
            handleGenerate().catch((err) => {
              console.error("TAILOR ERROR:", err);
              setIsGenerating(false);
              setStatusText(`Error: ${getErrorMessage(err)}`);
            })
          }
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Tailored Resume"}
        </button>
      )}
      {statusText && <p className="text-lg text-gray-500">{statusText}</p>}
    </div>
  );
};

export default TailoredResume;
