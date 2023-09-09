exports.formatDateTime = (dateString) => {
  const dateObjectUTC = new Date(dateString);

  dateObjectUTC.setHours(dateObjectUTC.getHours());
  
  const year = dateObjectUTC.getFullYear();
  const month = String(dateObjectUTC.getMonth() + 1).padStart(2, '0');
  const day = String(dateObjectUTC.getDate()).padStart(2, '0');
  const hours = String(dateObjectUTC.getHours()).padStart(2, '0');
  const minutes = String(dateObjectUTC.getMinutes()).padStart(2, '0');
  const seconds = String(dateObjectUTC.getSeconds()).padStart(2, '0');
  
  const formattedDateTime = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  
  return formattedDateTime;
}

