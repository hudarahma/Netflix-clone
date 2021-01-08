
let url = "http://localhost:3000";

let loginForm = document.getElementById('login-form');


const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const existingEmail = urlParams.get('existingEmail')
const registerd = urlParams.get('registerd')
if(existingEmail){
    loginForm.email.value = existingEmail
}

if (registerd) {
    document.querySelector('.registerd-alert').style.display = 'none'
}



loginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    let payload = {
        email: loginForm.email.value,
        password: loginForm.password.value
    }

    console.log('submited', e );
    fetch(url + "/login" , { 
        method: 'post',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response)=> {
        if (response.ok) {
            return response.json();
            
        } else {
            // throw new Error('something went wrong');
            notValidInfo(); 
            
        }
    })
    .then((response)=>{
        localStorage.setItem('token', response.token)
        location.href = "/";
    })
    .then((data) => {
       console.log(data);
       if(data.status == "Valid") {
            successInfo();
        } else {
            notValidInfo();
       }
    })
    
})

const successInfo = () => {
    
    let displaySuccess = document.getElementById('success-info');
    let notValid = document.getElementById('not-valid');

    displaySuccess.style.display = 'block';
    notValid.style.display = "none";
    
}

const notValidInfo = () => {
    
    let displaySuccess = document.getElementById('success-info');
    let notValid = document.getElementById('not-valid');

    displaySuccess.style.display = 'none';
    notValid.style.display = "block";
    
}


    



