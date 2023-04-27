//get quiz_body element
let quiz_body = document.querySelector(".quiz_body");
//score of quiz test
let score = 0;
//counter for bullets styling
let counter = 1;
//number of questions
let questions_counter = 10;

//first enter email and start
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
  let levels = ["Beginner", "Intermediate", "Advanced"];
  quiz_body.innerHTML = '<p class="q">What level do you think you are in?</p>';
  for (let i = 0; i < levels.length; i++) {
    quiz_body.innerHTML += `<div class="option">
    <input type="radio" name="level" id="${levels[i]}" value="level${i + 1}" />
    <label for="${levels[i]}">${levels[i]}</label>
  </div>`;
  }

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

//get data from json
async function getquizobj() {
  return fetch("./quiz.json")
    .then((response) => response.json())
    .then((result) => result);
}

//datermine the questions by level and make random indexes array to get random questions
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
  quiz_body.innerHTML = `<div class="bulltes"> ${"<span></span>".repeat(
    questions_counter
  )}</div>`;
  quiz_body.innerHTML += `<p class="q">${question["question"]}</p>`;
  quiz_body.innerHTML += `<div class="options"></div>`;
  options = document.querySelector(".options");

  //clear styling to avoid any styling still exist
  clearbullets();
  //add styling for new question
  stylingbullets();

  for (const key in question) {
    if (key === "answer" || key === "question") {
      continue;
    }
    options.innerHTML += `<div class="option">
  <input type="radio" name="opt" id="${key}" value="${key}" />
  <label for="${key}"
    >${question[key]}</label
  >
  </div>`;
  }
  quiz_body.innerHTML += `<div class="timer">00:<span class="timerp">55</span></div>`;

  //timer
  let timerp = document.querySelector(".timerp");
  let input = document.getElementById("A");
  timer(timerp, input);

  //go to the next question after click on any option
  let radio = document.querySelectorAll("[type='radio']");
  radio.forEach((element) => {
    element.addEventListener("change", function (e) {
      if (e.target.checked) {
        //clear styling
        clearbullets();
        counter++;
        if (e.target.value === question["answer"]) {
          score++;
        }
        setTimeout(function () {
          if (randomIndexes.length === 1) {
            return show_result();
          }
          randomIndexes.shift();
          load(questions, randomIndexes);
        }, 300);
      }
    });
  });
}

//save data and show result
function show_result() {
  quiz_body.innerHTML = `<p class="q">Your Result:</p>`;
  quiz_body.innerHTML += `<h2 class="resulta">${score * 10}%</h2>`;
  if (score >= 5) {
    quiz_body.innerHTML += `<p class="resultap">Your Score Was Good</p>`;
    document.querySelector(".resulta").style.color = "#2c7fdd";
  } else {
    quiz_body.innerHTML += `<p class="resultap">Your Score Was Bad</p>`;
    document.querySelector(".resulta").style.color = "#f44821";
  }
  quiz_body.innerHTML += `<div class="start"><span id="again">Start Again</span></div>`;

  //restart quiz from page of level options
  let again = document.getElementById("again");
  again.onclick = function () {
    score = 0;
    counter = 1;
    levelchoosen();
  };
}

//function to generate 10 random indexes from array it's used for create random questions
function generateRandom(array) {
  let stash = [];
  while (stash.length < questions_counter) {
    let value = Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0;
    if (stash.includes(value)) {
      continue;
    }
    stash.push(value);
  }
  return stash;
}

//timer for each question
function timer(timerp, input, x = 1000) {
  setInterval(function () {
    timerp.innerHTML -= 1;
    timerp.innerHTML = timerp.innerHTML.toString().padStart(2, "0");
    if (timerp.innerHTML === "00") {
      input.value = "";
      input.click();
    }
  }, x);
}

//styling bullets
function stylingbullets() {
  let style = document.createElement("style");
  style.id = "forbullet";
  style.innerHTML = `
  .bulltes span:nth-of-type(${counter}) {
    height: 20px;
    width: 20px;
    background-color: #2c7fdd;
  }
  `;
  document.head.appendChild(style);
}

//clear styling from bulltes
function clearbullets() {
  if (!!document.getElementById("forbullet")) {
    document.getElementById("forbullet").remove();
  }
}
