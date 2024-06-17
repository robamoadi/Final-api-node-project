let contentShown = false;
const container = document.getElementById("container");
const userCountainer = document.getElementById("userCountainer")
const questionContainer = document.getElementById("questionContainer")

//show all the questions statistic
function show() {
    if (contentShown) {
        container.innerHTML = "";
        contentShown = false;
        return;
    }
    fetch("/api/poll/get/all_questions")
        .then(response => response.json())
        .then(questions => {
            console.log(questions);
            questions.forEach(question => {
                const questionTitle = question.question_title;
                const options = [question.option_1, question.option_2, question.option_3, question.option_4];
                const counts = [question.option_1_count, question.option_2_count, question.option_3_count, question.option_4_count];

                //displaying the data in charts 
                const chartContainer = document.createElement("div");
                chartContainer.classList.add("chart-container");
                chartContainer.style.display = "inline-block";
                container.appendChild(chartContainer);

                const canvas = document.createElement("canvas");
                canvas.className = "myChart";
                chartContainer.appendChild(canvas);

                const ctx = canvas.getContext("2d");
                new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: options,
                        datasets: [{
                            backgroundColor: ["#d8b874",
                                "#edb747",
                                "#93550e",
                                "#554a28",
                                "#b48939"
                            ],
                            data: counts
                        }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: questionTitle,
                            fontSize: 14,
                            fontColor: '#b48939'
                        },
                        legend: {
                            labels: {
                                fontSize: 14,
                                fontColor: '#b48939'
                            }
                        }
                    }
                });
                const hr = document.createElement("hr");
                chartContainer.appendChild(hr);
            });
        });
    contentShown = true; // Update the flag to indicate content is now shown
}

function getUserQuestion(event) {
    event.preventDefault(); // Prevent page refresh

    const id = document.getElementById("userId").value;
    const inputElement = document.getElementById("userId");
    const tooltipElement = document.getElementById("tooltip1");

    // Check if the input is empty
    if (id.trim() === '') {
        inputElement.classList.add("invalid-input");
        tooltipElement.innerText = "Please Enter A Number";
        return;
    } else {
        inputElement.classList.remove("invalid-input");
        tooltipElement.innerText = "";
    }
    userCountainer.innerHTML = "";

    fetch(`/api/poll/user_name_question/${id}`)
        .then(response => response.json())
        .then(users => {
            console.log(users);
            // Handle different scenarios based on API response
            if (users === "user doesnt exisit") {
                userCountainer.innerHTML = "User Doesnt Exisit";
            } else if (users === "user didnt answer any question") {
                userCountainer.innerHTML = "User Didnt Answer Any Question";
            }
            else {
                users.forEach(user => {
                    const userName = user.user_name;
                    const numQuestionsAnswered = user.num_questions_answered;

                    const chartContainer = document.createElement("div");
                    chartContainer.classList.add("chart-container");
                    chartContainer.style.display = "inline-block";
                    userCountainer.appendChild(chartContainer);

                    const canvas = document.createElement("canvas");
                    canvas.className = "myChart";
                    chartContainer.appendChild(canvas);

                    const ctx = canvas.getContext("2d");
                    new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: [userName],
                            datasets: [{
                                label: "Number of Questions Answered",
                                backgroundColor: "#b48939",
                                data: [numQuestionsAnswered]
                            }]
                        },
                        options: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: userName,
                                fontColor: "#b48939",
                                fontSize: 18
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        fontColor: '#b48939',
                                        fontSize: 14
                                    },
                                }],
                                yAxes: [{
                                    ticks: {
                                        fontColor: '#b48939',
                                        fontSize: 14
                                    },
                                    gridLines: {
                                        color: '#b48939'
                                    }
                                }]
                            }
                        }
                    });
                });
            }
        })
}

function getUserAnswer(event) {
    event.preventDefault(); // Prevent page refresh

    const id = document.getElementById("userId").value;
    const inputElement = document.getElementById("userId");
    const tooltipElement = document.getElementById("tooltip1");

    // Check if the input is empty
    if (id.trim() === '') {
        inputElement.classList.add("invalid-input");
        tooltipElement.innerText = "Please Enter A Number";
        return;
    } else {
        inputElement.classList.remove("invalid-input");
        tooltipElement.innerText = "";
    }
    userCountainer.innerHTML = "";

    fetch(`/api/poll/user_name_answer/${id}`)
        .then(response => response.json())
        .then(users => {
            // Handle different scenarios based on API response
            if (users === "user doesnt exisit") {
                userCountainer.innerHTML = "User Doesnt Exisit";
            } else if (users === "user didnt answer any question") {
                userCountainer.innerHTML = "User Didnt Answer Any Question";
            }
            else {
                const userName = users[0].user_name
                const chartContainer = document.createElement("div");
                chartContainer.classList.add("chartContainer");
                userCountainer.appendChild(chartContainer);

                const paragraph = document.createElement("h2");
                paragraph.innerHTML = userName
                chartContainer.appendChild(paragraph);

                users.forEach(user => {
                    const paragraph = document.createElement("h3");
                    paragraph.innerHTML = `${user.question_title} ??`
                    chartContainer.appendChild(paragraph);

                    const paragraph2 = document.createElement("p");
                    paragraph2.innerHTML = `Answer : ${user.user_answer}`
                    chartContainer.appendChild(paragraph2);
                })
            }
        })
}

function QuestionCount(event) {
    event.preventDefault(); // Prevent page refresh
    const id = document.getElementById("questionId").value;
    const inputElement = document.getElementById("questionId");
    const tooltipElement = document.getElementById("tooltip");

    // Check if the input is empty
    if (id.trim() === '') {
        inputElement.classList.add("invalid-input");
        tooltipElement.innerText = "Please Enter A Number";
        return;
    } else {
        inputElement.classList.remove("invalid-input");
        tooltipElement.innerText = "";
    }

    questionContainer.innerHTML = ""; // Clear existing content

    // Fetch and display content
    fetch(`/api/poll/user_count/${id}`)
        .then(response => response.json())
        .then(questions => {
            console.log(questions);
            if (questions === "no such question") {
                questionContainer.innerHTML = "No Such Question";
            } else if (questions === "no user answered the question") {
                questionContainer.innerHTML = "No User Answered The Question";
            }
            else {
                questions.forEach(question => {
                    console.log(question);
                    const questionTitle = question.question;
                    const totalUserAnswered = question.total_users_answered;

                    const chartContainer = document.createElement("div");
                    chartContainer.classList.add("chart-container");
                    chartContainer.style.display = "inline-block";
                    questionContainer.appendChild(chartContainer);

                    const canvas = document.createElement("canvas");
                    canvas.className = "myChart";
                    chartContainer.appendChild(canvas);

                    const ctx = canvas.getContext("2d");
                    new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: [questionTitle],
                            datasets: [{
                                label: "Number of Users That Answered This Question",
                                backgroundColor: "#b48939",
                                data: [totalUserAnswered]
                            }]
                        },
                        options: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: questionTitle,
                                fontColor: "#b48939",
                                fontSize: 18
                            },
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        fontColor: '#b48939',
                                        fontSize: 14
                                    },
                                }],
                                yAxes: [{
                                    ticks: {
                                        fontColor: '#b48939',
                                        fontSize: 14
                                    },
                                    gridLines: {
                                        color: '#b48939'
                                    }
                                }]
                            }
                        }
                    });
                });
            }
        });
}

function questionsAnswer(event) {
    event.preventDefault(); // Prevent page refresh

    const id = document.getElementById("questionId").value;
    const inputElement = document.getElementById("questionId");
    const tooltipElement = document.getElementById("tooltip");

    // Check if the input is empty
    if (id.trim() === '') {
        inputElement.classList.add("invalid-input");
        tooltipElement.innerText = "Please Enter A Number";
        return;
    } else {
        inputElement.classList.remove("invalid-input");
        tooltipElement.innerText = "";
    }

    questionContainer.innerHTML = ""; // Clear existing content

    // Fetch and display content
    fetch(`/api/poll/user_answer/${id}`)
        .then(response => response.json())
        .then(questions => {
            console.log(questions);
            if (questions === "question doesnt exisit") {
                questionContainer.innerHTML = "No Such Question";
            } else if (questions === "user didnt answer the question") {
                questionContainer.innerHTML = "User Didnt Answer The Question";
            } else {
                questions.forEach(question => {
                    const questionTitle = question.question;
                    const options = [question.answer_1, question.answer_2, question.answer_3, question.answer_4];
                    const counts = [question.answer_1_count, question.answer_2_count, question.answer_3_count, question.answer_4_count];

                    //displaying the data in charts 
                    const chartContainer = document.createElement("div");
                    chartContainer.classList.add("chart-container");
                    questionContainer.appendChild(chartContainer);

                    const canvas = document.createElement("canvas");
                    canvas.className = "myChart";
                    chartContainer.appendChild(canvas);

                    const ctx = canvas.getContext("2d");
                    new Chart(ctx, {
                        type: "pie",
                        data: {
                            labels: options,
                            datasets: [{
                                backgroundColor: ["#d8b874",
                                    "#edb747",
                                    "#93550e",
                                    "#554a28",
                                    "#b48939"
                                ],
                                data: counts
                            }]
                        },
                        options: {
                            title: {
                                display: true,
                                text: questionTitle,
                                fontSize: 14,
                                fontColor: '#b48939'
                            },
                            legend: {
                                labels: {
                                    fontSize: 14,
                                    fontColor: '#b48939'
                                }
                            }
                        }
                    });

                });
            }
        });
}