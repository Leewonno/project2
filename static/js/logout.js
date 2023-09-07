const token = window.localStorage.getItem('token')
const signin = document.querySelector('#signin');

if (token!=null) {
    signin.textContent = 'LOGOUT';
    signin.href = '#';
    signin.setAttribute('onclick', 'logout()');
} else {
    signin.textContent = 'LOGIN'
};

function logout() {
    window.localStorage.removeItem('token');
    document.location.href = '/';
}