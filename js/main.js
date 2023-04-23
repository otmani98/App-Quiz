let score = 0;

//get data from json
async function getquizobj() {
  return fetch("./quiz.json")
    .then((response) => response.json())
    .then((result) => result);
}

//datermines the questions by level and makes random indexes array to get random questions
async function datermineQuestions(level) {
  const data = await getquizobj();
  const questions = data[level];
  let randomIndexes = generateRandom(questions);
  return load(questions, randomIndexes);
}

//shows questions
function load(questions, randomIndexes) {
  function* genNumbers() {
    yield* randomIndexes;
  }
  let gen = genNumbers();
  let question = questions[gen.next().value];
  quiz_body = document.querySelector(".quiz_body");
  quiz_body.innerHTML = ``;
  quiz_body.innerHTML += `<p class="q">${question["question"]}</p>`;
  quiz_body.innerHTML += `<div class="options"></div>`;
  options = document.querySelector(".options");
  options.innerHTML += `<div class="option">
  <input type="radio" name="opt" id="A" value="A" />
  <label for="A"
    >${question["A"]}</label
  >
  </div>`;
  options.innerHTML += `<div class="option">
  <input type="radio" name="opt" id="B" value="B" />
  <label for="B"
    >${question["B"]}</label
  >
  </div>`;
  options.innerHTML += `<div class="option">
  <input type="radio" name="opt" id="C" value="C" />
  <label for="C"
    >${question["C"]}</label
  >
  </div>`;
  if (question["D"]) {
    options.innerHTML += `<div class="option">
  <input type="radio" name="opt" id="D" value="D" />
  <label for="D"
    >${question["D"]}</label
  >
  </div>`;
  }
  quiz_body.innerHTML += `<div class="timer">00:<span class="timerp">55</span></div>`;
  timer = document.querySelector(".timerp");

  //timer
  timerofQ(timer);

  //go to the next question after click in any option
  let radio = document.querySelectorAll("[type='radio']");
  radio.forEach((element) => {
    element.addEventListener("change", function (e) {
      if (e.target.checked) {
        if (e.target.value === question["answer"]) {
          score++;
        }
        setTimeout(function () {
          if (randomIndexes.length === 1) {
            return show_result();
          }
          randomIndexes.shift();
          return load(questions, randomIndexes);
        }, 300);
      }
    });
  });
}

//save data and show result
function show_result() {
  quiz_body = document.querySelector(".quiz_body");
  quiz_body.innerHTML = `<p class="q">Your Result:</p>`;
  quiz_body.innerHTML += `<h2 class="resulta">${score * 10}%</h2>`;
  if (score > 5) {
    quiz_body.innerHTML += `<p class="resultap">Your Score Was Good</p>`;
    document.querySelector(".resulta").style.color = "#2c7fdd";
  } else {
    quiz_body.innerHTML += `<p class="resultap">Your Score Was Bad</p>`;
    document.querySelector(".resulta").style.color = "#f44821";
  }
  quiz_body.innerHTML += `<div class="start"><span id="again">Start Again</span></div>`;

  //restart quiz from page of levels option
  let again = document.getElementById("again");
  again.onclick = function () {
    score = 0;
    levelchoosen();
  };
}

//first enter email and start
let quiz_body = document.querySelector(".quiz_body");
let email = document.querySelector("#email");
let start = document.getElementById("start");
start.onclick = function () {
  if (/\w+@\w+\.\w+/.test(email.value)) {
    if (document.querySelector(".invalid").style.display === "inline") {
      document.querySelector(".invalid").style.display = "none";
    }
    levelchoosen();
  } else {
    document.querySelector(".invalid").style.display = "inline";
  }
};

//choosing the level of user
function levelchoosen() {
  quiz_body.innerHTML = `<p class="q">What level do you think you are in?</p>
  <div class="option">
    <input type="radio" name="level" id="b" value="level1" />
    <label for="b">Beginner</label>
  </div>
  <div class="option">
    <input type="radio" name="level" id="i" value="level2" />
    <label for="i">Intermediate</label>
  </div>
  <div class="option">
    <input type="radio" name="level" id="a" value="level3" />
    <label for="a">Advanced</label>
  </div>`;

  document.querySelectorAll("[type='radio']").forEach((element) => {
    element.addEventListener("change", function (e) {
      if (e.target.checked) {
        setTimeout(function () {
          datermineQuestions(e.target.value);
        }, 300);
      }
    });
  });
}

//function to generate 10 random indexes from array
function generateRandom(array) {
  let stash = [];
  while (stash.length < 10) {
    let value = Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0;
    if (stash.includes(value)) {
      continue;
    }
    stash.push(value);
  }
  return stash;
}

//timer
function timerofQ(timerp) {
  input = document.getElementById("A");
  let counter = setInterval(countdown, 1000);
  function countdown() {
    timerp.innerHTML -= 1;
    timerp.innerHTML = timerp.innerHTML.toString().padStart(2, "0");
    if (timerp.innerHTML === "00") {
      input.value = "x";
      input.click();
    }
  }
}
