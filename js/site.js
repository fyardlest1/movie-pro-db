function displayMessage() {
    let inputBox = document.getElementById('message');
    let message = inputBox.value;    
    
    Swal.fire(
        {
            icon: 'error',
            backdrop: false,
            title: 'App Name',
            text: 'message'
        }
    )
}