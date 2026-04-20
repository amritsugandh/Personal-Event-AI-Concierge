export const createGoogleCalendarUrl = (event) => {
  const formatTime = (dateStr) => {
    try {
        const d = new Date(dateStr);
        return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    } catch(e) {
        return "";
    }
  };

  const startTime = formatTime(event.timeRaw);
  
  const endD = new Date(event.timeRaw);
  endD.setHours(endD.getHours() + 1);
  const endTime = endD.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const title = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.room + ', Tech Conference Center');
  const detailsText = `Smart Matched personal event via Personal Event Concierge.\n\nType: ${event.type}\nFocus: ${(event.techStack || event.focus || []).join(', ')}`;
  const details = encodeURIComponent(detailsText);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
};
