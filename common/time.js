export const getTimeOffsetByPassedMinutes = (dateTime, minutesToAdd) => {
    return new Date(dateTime.getTime() + minutesToAdd * 60000);
}