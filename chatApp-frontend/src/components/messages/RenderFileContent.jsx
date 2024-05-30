import React, { useState, useEffect } from 'react';
import { routesApi } from '../../routes/RoutePath';
import FileFormatRead from './FileFormatRead';

const RenderFileContent = (filepath) => {
    const fetchPath = routesApi.app.getFilesFromServer; //"https://chat-mern-app-1lgm.onrender.com/api"// "http://localhost:5000/api" //
    if (!filepath?.type) return null;

    const { path, type } = filepath;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (type.startsWith('image')) {
            const img = new Image();
            img.src = `${fetchPath}/${path}`;
            img.onload = () => setLoading(false);
            img.onerror = () => setLoading(false);
        } else {
            setLoading(false);
        }
    }, [path, type, fetchPath]);

    const renderLoading = () => (
        <div className="flex justify-center items-center w-full h-60">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    const renderContent = () => {
        const fileType = type.split('/')[0];
        switch (fileType) {
            case 'image':
                return <img src={`${fetchPath}${path}`} alt="file" className="w-full max-h-60 object-contain" />;
            case 'video':
                return <video src={`${fetchPath}${path}`} controls className="w-full h-auto max-h-60 object-contain" />;
            case 'audio':
                return <audio src={`${fetchPath}${path}`} controls className="min-h-12 w-56 md:w-60 lg:w-72 object-fit" />;
            case 'application':
                return (
                    <a src={`${fetchPath}${path}`} target="_blank" rel="noopener noreferrer truncate flex w-full" className="text-black">
                        <p className='flex justify-center items-center gap-2'>
                            <span>{FileFormatRead(type)}</span> <span>Download Excel File</span>
                        </p>
                    </a>
                );
            case 'text':
                return (
                    <a href={`${fetchPath}${path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Download Text File
                    </a>
                );
            default:
                return (
                    <a href={`${fetchPath}${path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Download File
                    </a>
                );
        }
    };

    return loading ? renderLoading() : renderContent();
};

export default RenderFileContent;
