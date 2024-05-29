import {routesApi } from '../../routes/RoutePath';

const RenderFileContent = (filepath) => {
    const fetchPath = routesApi.app.getFilesFromServer //"https://chat-mern-app-1lgm.onrender.com/api"// "http://localhost:5000/api" //

    if (!filepath.type) return null;

    const { path, type } = filepath;


    switch (type) {
        
        case 'image/png':
        case 'image/jpeg':
        case 'image/svg+xml':
            return <img src={`${fetchPath}/${path}`} alt="file" className="w-full max-h-60 object-contain" />;
        case 'video/mp4':
            return <video src={`${fetchPath}/${path}`} controls className="w-full h-auto max-h-60 object-contain" />;
        case 'audio/mpeg':
            return <audio src={`${fetchPath}/${path}`} controls className=" min-h-12 w-56 md:w-60 lg:w-72 object-fit" />;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return (
                <a href={path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download Excel File
                </a>
            );
        case 'text/plain':
            return (
                <a href={path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download Text File
                </a>
            );
        default:
            return (
                <a href={path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    Download File
                </a>
            );
    }
};

export default RenderFileContent
