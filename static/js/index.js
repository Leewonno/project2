const isLogin = () => {
  const id = document.cookie;
  console.log(id);
  if (!id) {
    console.log('x');
  } else {
    console.log('sdfa', id);
  }
};

isLogin();
