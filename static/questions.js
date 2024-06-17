//writing the user email 
let email = document.cookie.split('=')[1].split('_')[0]
email = decodeURIComponent(email)
document.getElementById('userEmail').textContent = `${email}`

//writing the user id
function userId() {
    let id = document.cookie.split("_")[1]
    console.log(id);
    return id
}
document.getElementById('userId').innerHTML = `Your ID = ${userId()}`

//adding event listener to show the form when clicking the button
document.getElementById('showBttn').addEventListener("click", function () {
    document.querySelector(".form_container").style.display = "flex";
    setTimeout(function () {
        const user_id = userId();
        Show(user_id);
    }, 100);
});

function Show(id) {
    fetch("/api/users")
        .then(response => response.json())
        .then(data => {
            const users = data.users;
            console.log(users);
            const obj = users.find(user => user.id === parseInt(id))
            console.log(obj);
            document.querySelector(".user_id").value = obj.id;
            document.querySelector(".First_name").value = obj.first_name;
            document.querySelector(".Last_name").value = obj.last_name;
            document.querySelector(".Email").value = obj.email;
            document.querySelector(".Date_of_birth").value = obj.date_of_birth.split('T')[0];
            document.querySelector(".Address").value = obj.address;
        })
}

function edit() {
    const new_user = {
        id: document.querySelector('.user_id').value,
        first_name: document.querySelector('.First_name').value,
        last_name: document.querySelector('.Last_name').value,
        email: document.querySelector('.Email').value,
        date_of_birth: document.querySelector('.Date_of_birth').value,
        address: document.querySelector('.Address').value,
        password: document.querySelector('.password').value
    }
    console.log(new_user);
    if (new_user.id == '') {
        delete new_user.id
    }
    if (new_user.first_name == '') {
        delete new_user.first_name
    }
    if (new_user.first_name == '') {
        delete new_user.first_name
    }
    if (new_user.email == '') {
        delete new_user.email
    }
    if (new_user.date_of_birth == '') {
        delete new_user.date_of_birth
    }
    if (new_user.address == '') {
        delete new_user.address
    }
    if (new_user.password == '') {
        delete new_user.password
    }

    const send_details = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_user)
    }
    fetch(`/api/users/${new_user.id}`, send_details)
        .then(response => response.json())
        .then(document.querySelector(".form_container").style.display = " none")
}

document.addEventListener('DOMContentLoaded', getQuestions);

function getQuestions() {
    const container = document.getElementById('container');
    let currentQuestionIndex = 0; // Track the index of the current question
    let questions;

    // Fetch questions from the server
    fetch("/api/questions")
        .then(response => response.json())
        .then(data => {
            questions = data
            console.log(questions);
            const currentQuestion = questions[currentQuestionIndex]
            console.log(currentQuestion);
            renderQuestion(currentQuestion); // Render the first question
        })

    function renderQuestion(question) {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${question.question_title} ?`;
        container.innerHTML = ""; // Clear previous content
        container.appendChild(paragraph);
        createButton(question.first_answer, question.id)
        createButton(question.second_answer, question.id)
        createButton(question.third_answer, question.id)
        createButton(question.fourth_answer, question.id)
    }

    function createButton(answer, questionId) {
        const newButton = document.createElement('button');
        newButton.textContent = answer;
        newButton.className = "bttn";
        newButton.id = "answer";
        newButton.addEventListener('click', () => submitAnswer(answer, questionId));
        container.appendChild(newButton);
    }

    async function submitAnswer(answer, questionId) {
        console.log(answer, questionId);
        const response = await fetch('/api/poll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selected_answer: answer, question_id: questionId })
        });
        const data = await response.json();
        //console.log(data);
        if (data && data.error && data.error.includes("duplicate key")) {
            swal({
                title: "O ops!",
                text: "Already answered this question.",
                button: "Continue !",
            });
        }
        else {
            swal({
                title: "G ood job!",
                text: "Successfully answered.",
                icon: "success",
                button: "Yay !",
            });
        }
        currentQuestionIndex++; // Move to the next question
        if (currentQuestionIndex < questions.length) {
            renderQuestion(questions[currentQuestionIndex]);
        } else {
            swal({
                title: "D one!",
                text: `No more questions.\n Thank you for your participation.`,
                button: "Return !",
            });
        }
    }
}
//adding show form question function to the button
document.getElementById('showQuestionForm').addEventListener('click', function () {
    document.querySelector(".question_container").style.display = "flex"
})

function add() {
    const new_Question = {
        id: document.querySelector('.question_id').value,
        question_title: document.querySelector('.question_title').value,
        first_answer: document.querySelector('.first_answer').value,
        second_answer: document.querySelector('.second_answer').value,
        third_answer: document.querySelector('.third_answer').value,
        fourth_answer: document.querySelector('.fourth_answer').value,
    }
    console.log(new_Question);
    if (new_Question.id == '') {
        delete new_Question.id
    }
    if (new_Question.question_title == '') {
        delete new_Question.question_title
    }
    if (new_Question.first_answer == '') {
        delete new_Question.first_answer
    }
    if (new_Question.second_answer == '') {
        delete new_Question.second_answer
    }
    if (new_Question.third_answer == '') {
        delete new_Question.third_answer
    }
    if (new_Question.fourth_answer == '') {
        delete new_Question.fourth_answer
    }

    const send_details = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_Question)
    }
    fetch(`/api/questions`, send_details)
        .then(response => response.json())
        .then(document.querySelector(".question_container").style.display = "none")
}

document.getElementById('deleteButton').addEventListener('click', function () {
    let id = userId();
    swal({
        title: "A re you sure?",
        text: "Once deleted,\n you will not be able to recover this user!",
        icon: "warning",
        buttons: ["Cancel", true],
    })
        .then((willDelete) => {
            if (willDelete) {
                fetch(`/api/users/${id}`, { method: 'DELETE' })
                    .then(() => {
                        swal("Poof! The user has been deleted!", {
                            icon: "success",
                        }).then(() => {
                            window.location.href = './logout.html';
                        });
                    })
                    .catch(error => {
                        swal("Oops! Something went wrong while deleting the user!", {
                            icon: "error",
                        });
                    });
            } else {
                swal({
                    title: "T he user is safe!",
                });
            }
        });
});