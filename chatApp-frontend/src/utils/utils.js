export function extractTime(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  return `${hours}:${minutes}`
}

function padZero(number){
  return number.toString().padStart(2, "0")
}

// format the file  example:kb,mb,tb
export function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizeInFormattedUnits = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${sizeInFormattedUnits} ${sizes[i]}`;
}