const jwtCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('token='));
console.log(jwtCookie)
// let jwtToken = null;

if (jwtCookie) {
  jwtToken = jwtCookie.split('=')[1];
}
const signin = document.querySelector('#signin');
const user = document.querySelector('.user');

if (jwtCookie!=null) {
    signin.textContent = 'LOGOUT';
    signin.href = '#';
    signin.setAttribute('onclick', 'logout()');
    user.insertAdjacentHTML('afterbegin', `<a href="/profile">프로필</a>`)
    user.insertAdjacentHTML('afterbegin', `<a href="/playlist">플레이리스트</a>`)
} else {
    signin.textContent = 'LOGIN'
};

function logout() {
    // 쿠키 삭제
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
    document.location.href = '/'; 
}