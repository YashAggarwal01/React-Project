import Navvbar from '~/components/Navvbar'
import React,{useState} from 'react'
import type {FormEvent} from 'react'
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';
import { useNavigate } from 'react-router';
import { prepareInstructions } from '../../constants';

function upload() {
    const {auth,isLoading,fs,ai,kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing,setisProcessing] = useState(false);
    const [statusText,setStatusText] = useState(" ");
    const [file,setfile] = useState <File | null >(null)

    const handleAnalyze = async({companyName,jobTitle,jobDiscription,file}:{
        companyName: string,
        jobTitle:string,
        jobDiscription:string,
        file:File
    })=>{
        setisProcessing(true);
        setStatusText('Uploading the file...')
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');
        setStatusText('converting to image...')
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: failed to convert PDF to Image')
        setStatusText('Uploading Image...')
        const uploadImage = await fs.upload([imageFile.file]);
        if(!uploadImage) return setStatusText ('Error: Failed to upload image');
        setStatusText('Preparing Data...')
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumepath: uploadedFile.path,
            imagepath:uploadImage.path,
            companyName,jobTitle,jobDescription,
            feedback:'',

        }
        await kv.set(`resume:${uuid}`,JSON.stringify(data))
        setStatusText('Analysing...');
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle,jobDescription})
        )
        if(feedback) return setStatusText('Error: Failed to Analyse Resume');
    }



    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDiscription = formData.get('job-discription') as string;

        if(!file) return;
        handleAnalyze({companyName,jobTitle,jobDiscription,file})

    }

    const handleFileSelect = (file: File | null) => {
    setfile(file);
}

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navvbar/>
        <section className="main-section">
            <div className='page-heading py-16'>
                <h1>Smart Feedback for your Dream Job</h1>
                {isProcessing ? (
                    <>
                        <h2>{statusText}</h2>           
                        <img src='/images/resume-scan.gif' className='w-full'/>
                    </>
                ):(
                    <h2>Drop your resume for an ATS score and improvement Tips</h2>
                )}
                {!isProcessing && (
                    <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-4'>
                        <div className='form-div'>
                            <label htmlFor="company-name">Comapny Name</label>
                            <input type='text' name='company-name' placeholder='Company Name' id='company-name'/>
                        </div>
                        <div className='form-div'>
                            <label htmlFor="job-title">Comapny Name</label>
                            <textarea rows={5} name='job-title' placeholder='Job Title' id='job-title'/>
                        </div>
                        <div className='form-div'>
                            <label htmlFor="job-discription">Job Discription</label>
                            <input type='text' name='job-discription' placeholder='Discription' id='job-discription'/>
                        </div>
                        <div className='form-div'>
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>
                        <button className='primary-button' type='submit'>
                            Analyse Resume
                        </button>
                    </form>

                )}
            </div>
        </section>
    </main>
  )
}
export default upload
