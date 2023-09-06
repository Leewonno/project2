const token = window.localStorage.getItem('token')
const signin = document.querySelector('#signin');

if (token!=null) {
    signin.textContent = 'logout';
    signin.href = '#';
    signin.setAttribute('onclick', 'logout()');
} else {
    signin.textContent = 'login'
};

function logout() {
    window.localStorage.removeItem('token');
    document.location.href = '/';
}