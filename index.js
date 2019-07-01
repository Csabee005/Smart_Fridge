//Send data to the server:
function sendData() {
    var url = '/getPosts';
    var posts = document.getElementById('posts');
    posts.innerHTML = "";
    fetch(url)
        .then(res => res.json())
        .then(response => {
            console.log('Success:', JSON.stringify(response));
            response.forEach(element => {
                posts.innerHTML += "<h2>" + element.title + "</h2> <h5>" + element.description + " - " + moment(element.getDate).format('lll') + "</h5> <p>" + element.content + " </p>"
            });
        })
        .catch(error => console.error('Error:', error));
}