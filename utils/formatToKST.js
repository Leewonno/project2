exports.formatDateTime = (dateString) => {
  // '2023-09-09T16:42:11.000Z' 형식의 문자열을 Date 객체로 파싱
  const dateObjectUTC = new Date(dateString);

  // UTC 시간에서 9시간을 뺍니다
  dateObjectUTC.setHours(dateObjectUTC.getHours());
  
  // 원하는 형식으로 날짜 및 시간 문자열 생성
  const year = dateObjectUTC.getFullYear();
  const month = String(dateObjectUTC.getMonth() + 1).padStart(2, '0');
  const day = String(dateObjectUTC.getDate()).padStart(2, '0');
  const hours = String(dateObjectUTC.getHours()).padStart(2, '0');
  const minutes = String(dateObjectUTC.getMinutes()).padStart(2, '0');
  const seconds = String(dateObjectUTC.getSeconds()).padStart(2, '0');
  
  const formattedDateTime = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
  
  return formattedDateTime;
}

