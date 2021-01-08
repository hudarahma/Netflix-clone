let url = "http://localhost:3000";



let registerForm = document.getElementById('register-form');



let displaySuccess = document.getElementById('Registerd');
let notValid = document.getElementById('not-valid');
displaySuccess.style.display = 'none';
notValid.style.display = "none";




registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let newUser = {
        name: registerForm.newname.value,
        email: registerForm.newemail.value,
        password: registerForm.password.value
    }
    console.log('submited', e );
    

    fetch(url + '/register', {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
            'Content-Type' : 'application/json'

        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
            
        } else {
            // throw new Error('something went wrong');
            registerFailed();
        }
    }).then((data) => {
        if (data.status == 'registered'  ) {
            location.href = `/login.html?existingEmail=${newUser.email}&register=true`
            console.log(data);
            registerSuccess();
        } else {
            registerFailed();
        }
        
     }) .catch((err) => {
         location.href = `/login.html?existingEmail=${newUser.email}`
         console.log(err);
     })

})


const registerSuccess = () => {

    displaySuccess.style.display = 'block';
    notValid.style.display = "none";
    
}

const registerFailed = () => {

    displaySuccess.style.display = 'none';
    notValid.style.display = "block";
    
}

const emailInput = () => {

    let inputEmail =  document.getElementById('enterEmail').value;
    let newEmail = document.getElementById('new-email');
    newEmail.innerHTML = inputEmail;
}