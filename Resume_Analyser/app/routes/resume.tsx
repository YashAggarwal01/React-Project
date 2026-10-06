import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import Summary from '~/components/Summary';
import Details from '~/components/Details';
import ATS from '~/components/ATS';
import TailoredResume from '~/components/TailoredResume';
import { getErrorMessage } from '~/lib/utils';


export const meta = () => ([
    { title: 'Resumid | Auth' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

function Resume() {
    const { id } = useParams();
    const { auth, isLoading, fs, kv } = usePuterStore();

    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [resumeData, setResumeData] = useState<any>(null);
    const [loadError, setLoadError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
    if(!isLoading && !auth.isAuthenticated){
        navigate(`/auth?next=/resume/${id}`);
    }
    },[auth.isAuthenticated, isLoading, navigate])

    useEffect(() => {
        // Wait for Puter sign-in, otherwise kv/fs return nothing
        if (!auth.isAuthenticated) return;
        const loadResume = async () => {
            console.log('1. starting, id:', id);
            const resume = await kv.get(`resume:${id}`);
            console.log('2. resume from kv:', resume);
            if (!resume) return setLoadError('Resume not found.');
            const data = JSON.parse(resume);
            if (!data.feedback) return setLoadError('The analysis for this resume did not finish. Please upload it again.');
            console.log('3. data:', data);
            const resumeBlobRaw = await fs.read(data.resumepath);
            console.log('4. resumeBlob:', resumeBlobRaw);
            if (!resumeBlobRaw) return;
            const pdfBlob = resumeBlobRaw instanceof Blob
                ? resumeBlobRaw
                : new Blob([resumeBlobRaw], { type: 'application/pdf' });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);
            const imageBlob = await fs.read(data.imagepath);
            console.log('5. imageBlob:', imageBlob);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);
            setFeedback(data.feedback);
            setResumeData(data);
            console.log('6. done:', { resumeUrl, imageUrl, feedback: data.feedback });
        };
        loadResume().catch((err) => {
            console.error('LOAD ERROR:', err);
            setLoadError(`Error: ${getErrorMessage(err)}`);
        });
    }, [id, fs, kv, auth.isAuthenticated]);

    return (
        <main className='pt-0'>
            <nav className='resume-nav'>
                <Link to='/' className="back-button">
                    <img src="/icons/back.svg" alt='logo' className='w-2.5 h-2.5' />
                    <span className='text-gray-800 text-sm font-semibold'>Back To HomePage</span>
                </Link>
            </nav>
            <div className='flex flex-row w-full max-lg:flex-col-reverse'>
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">
                    {imageUrl && resumeUrl && (
                        <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit'>
                            <a href={resumeUrl} target='_blank' rel="noopener noreferrer" type="application/pdf">
                                <img
                                    src={imageUrl}
                                    className='w-full h-full object-contain rounded-2xl'
                                    title='resume'
                                />
                            </a>
                        </div>
                    )}
                </section>
                <section className='feedback-section'>
                    <h2 className='text-4xl text-black text-bold'>Resume Review</h2>
                    {feedback ? (
                        <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback}/>
                            {resumeData && (
                                <TailoredResume
                                    id={id!}
                                    resumePath={resumeData.resumepath}
                                    jobTitle={resumeData.jobTitle || ''}
                                    jobDescription={resumeData.jobDescription || ''}
                                    savedResume={resumeData.tailoredResume}
                                />
                            )}

                        </div>
                    ) : loadError ? (
                        <p className='text-red-600 text-lg'>{loadError}</p>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className='w-full'/>

                    )}

                </section>
            </div>
        </main>
    )
}

export default Resume