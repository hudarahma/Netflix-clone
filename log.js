
let url = "http://localhost:3000/login";


getUser = (user) => {
    fetch( url, {
        method: 'post',
        body: JSON.stringify(user)
    }
    ).then((response)=> {
        return response.json();
    }).then((data)=> {
        console.log(data);
    })
   
}

const checkInfo = () => {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (email && password) {
        getUser(email);
    } else {
        console.log('please enter email and password');
    }

}

