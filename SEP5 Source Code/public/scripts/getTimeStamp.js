const currentDate = new Date();

// Get the current date and time components
const currentYear = currentDate.getFullYear();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const currentDay = currentDate.getDate().toString().padStart(2, '0');
const currentHours = currentDate.getHours().toString().padStart(2, '0');
const currentMinutes = currentDate.getMinutes().toString().padStart(2, '0');
const currentSeconds = currentDate.getSeconds().toString().padStart(2, '0');

// Format the date and time as a string (YYYY-MM-DD HH:mm:ss)
const currentDateFormated = `${currentYear}-${currentMonth}-${currentDay} ${currentHours}:${currentMinutes}:${currentSeconds}`;

export default currentDateFormated;