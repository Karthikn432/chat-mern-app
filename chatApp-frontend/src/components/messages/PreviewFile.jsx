import React, { useEffect, useState } from 'react'
import { routesApi } from '../../routes/RoutePath'
import { IoCloseCircle, IoDownload } from 'react-icons/io5'


import { Document, Page, pdfjs } from 'react-pdf';
import * as XLSX from 'xlsx';
import { readFile } from 'docxtemplater';


const PreviewFile = ({ fileData, setIsImageClicked }) => {

    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        if (fileData) {
            fetchFileContent();
        }
    }, [fileData]);


    const onClose = () => {
        setIsImageClicked(false)
    }
    const fetchPath = routesApi.app.getFilesFromServer;
    console.log({ fileData });

    const fetchFileContent = async () => {
        const response = await fetch(`${routesApi.app.getFilesFromServer}${fileData?.path}`);
        const blob = await response.blob();
        const fileType = fileData?.type.split('/')[0];

        if (fileType === 'text') {
            const text = await blob.text();
            setFileContent(text);
        } else if (fileData?.type === 'application/pdf') {
            setFileContent(URL.createObjectURL(blob));
        } else if (fileData?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const arrayBuffer = await blob.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            setFileContent(sheet);
        } else if (fileData?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const arrayBuffer = await blob.arrayBuffer();
            const doc = readFile(arrayBuffer);
            setFileContent(doc);
        }
    };



    const downloadFile = () => {
        // Fetch the file
        fetch(`${routesApi.app.getFilesFromServer}${fileData?.path}`)
            .then(response => response.blob()) // Get the response as a Blob
            .then(blob => {
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob); // Create a blob URL for the file
                link.download = 'image'; // Set the downloaded file name
                document.body.appendChild(link);
                link.click();
                // Clean up the URL object after the download
                URL.revokeObjectURL(link.href);
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Error downloading the file:', error);
            });
    };


    const renderMediaContent = () => {
        const fileType = fileData?.type.split('/')[0]; // Extract the file type (e.g., 'image', 'video')

        if (fileType === 'image') {
            return <img src={`${routesApi.app.getFilesFromServer}${fileData?.path}`} alt="Popup Image" className="object-contain w-full h-full" />;
        } else if (fileType === 'video') {
            return <video controls className="object-contain w-full h-full">
                <source src={`${routesApi.app.getFilesFromServer}${fileData?.path}`} type="video/mp4" />
            </video>;
        }  else if (fileType === 'text') {
            return <pre className="text-black whitespace-pre-wrap overflow-auto h-screen">{fileContent}</pre>;
        } else if (fileData?.type === 'application/pdf') {
            return (
                <Document file={fileContent}>
                    <Page pageNumber={1} />
                </Document>
            );
        } else if (fileData?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return (
                <div className="text-white">
                    {/* {fileContent?.map((row, rowIndex) => (
                        <div key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <span key={cellIndex} className="inline-block w-24 border border-gray-400 p-1">
                                    {cell}
                                </span>
                            ))}
                        </div>
                    ))} */}
                </div>
            );
        } else if (fileData?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return <div className="text-white  ">{fileContent}</div>;
        } else {
            return (
                    <p className="text-center text-white">File: {fileData?.name}</p>
            );
        }

    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50">
            <div className="bg-black  lg:p-16 rounded-lg ">

                <div className=' bg-black opacity-80 h-screen w-screen relative'>
                    <div className='absolute right-20 top-5 flex gap-10'>
                        <button onClick={downloadFile} className=" text-white px-3 py-2 bg-gray-500 font-semibold rounded-md hover:bg-white hover:text-gray-600">
                            <IoDownload className="w-6 h-6" />
                        </button>

                        <button onClick={onClose} className=" text-white px-5 py-1 font-semibold  rounded-md border hover:border-red-600 bg-gray-600 hover:bg-red-600">
                            {/* <IoCloseCircle w-10 h-10/> */} Close
                        </button>

                    </div>
                    <div className='p-20 w-full h-full bg-blue-100 text-black'>
                        {renderMediaContent()}
                    </div>
                    {/* <img src={`${fetchPath}${fileData?.path}`} alt="Popup Image" className="object-contain w-full h-full" /> */}
                </div>
            </div>
        </div>
    )
}

export default PreviewFile