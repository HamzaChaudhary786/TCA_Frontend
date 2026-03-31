export const convertToISOWithTimezoneOffset = (startEventDate, startTime) => {
    const dateTimeString = `${startEventDate}T${startTime}:00.000Z`;
    return dateTimeString;
}
