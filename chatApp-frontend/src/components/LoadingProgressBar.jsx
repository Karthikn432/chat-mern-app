export const LoadingProgressBar = () => {
    return (
        <div className="relative bg-blue-500 rounded h-1.5 overflow-hidden">
            <div className="absolute inset-0 bg-gray-300 h-full rounded progress-bar"></div>
        </div>
    );
};