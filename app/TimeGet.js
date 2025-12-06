//This is the example of working code to send out

export const  getCurrentTime = () => {
    const now = new Date(); // Get the current date and time.
    
    // Format the time with leading zeros for hours, minutes, and seconds.
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format the current time as HH:MM:SS
    const currentTime = `${hours}:${minutes}:${seconds}`;
    
    return currentTime;
}

export default getCurrentTime