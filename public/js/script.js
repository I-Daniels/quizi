document.getElementById("sendButton").onclick = async function () {
  await submitForm();
};

document.addEventListener("DOMContentLoaded", function () {
  const hrButton = document.getElementById("hrButton");
  const lineManagerButton = document.getElementById("lineManagerButton");
  const selectManage = document.getElementById("selectManage");
  const hrQuiz = document.getElementById("hrquiz");
  const LMQuiz = document.getElementById("LMquiz");

  function showHRQuestions() {
    selectManage.parentNode.removeChild(selectManage);
    hrQuiz.style.display = "flex";
    document.body.style.overflow = "auto";
    LMQuiz.parentNode.removeChild(LMQuiz);
  }

  function showLineManagerQuestions() {
    selectManage.parentNode.removeChild(selectManage);
    LMQuiz.style.display = "flex";
    document.body.style.overflow = "auto";
    hrQuiz.parentNode.removeChild(hrQuiz);
  }

  hrButton.addEventListener("click", function () {
    showHRQuestions();
  });

  lineManagerButton.addEventListener("click", function () {
    showLineManagerQuestions();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var quizPosts = document.querySelectorAll(".quiz-post");

  quizPosts.forEach(function (quizPost) {
    var quizElementsList = quizPost.querySelectorAll(".quiz-element");
    var resultDiv = quizPost.querySelector(".result");

    quizElementsList.forEach(function (quizElement) {
      var quizElementsListInner = quizElement.querySelectorAll(
        ".quiz-elements, .quiz-elements-align"
      );
      var averageOutputDiv = quizElement.querySelector(".average-value");

      quizElementsListInner.forEach(function (quizElements) {
        var radioButtons = quizElements.querySelectorAll('input[type="radio"]');

        radioButtons.forEach(function (radioButton) {
          radioButton.addEventListener("change", function () {
            updateAverage();
            updateResult();
          });
        });
      });

      function updateAverage() {
        var sumValues = 0;
        var countChecked = 0;

        quizElementsListInner.forEach(function (quizElements) {
          var checkedRadioButton = quizElements.querySelector(
            'input[type="radio"]:checked'
          );
          if (checkedRadioButton) {
            sumValues += parseInt(checkedRadioButton.value);
            countChecked++;
          }
        });

        if (countChecked > 0) {
          var averageValue = Math.round(sumValues / countChecked);
          var averageText;

          if (averageValue >= 0 && averageValue <= 4) {
            averageText = "Ниже ожиданий";
          } else if (averageValue >= 5 && averageValue <= 9) {
            averageText = "Соответствует ожиданиям";
          } else {
            averageText = "Выше ожиданий";
          }

          if (averageOutputDiv) {
            averageOutputDiv.textContent = averageText;
            averageOutputDiv.dataset.value = averageValue;
          }
        } else {
          if (averageOutputDiv) {
            averageOutputDiv.textContent = "Нет данных";
          }
        }
      }

      function updateResult() {
        var totalSum = 0;
        var totalCount = 0;

        quizElementsList.forEach(function (quizElement) {
          var averageOutput = quizElement.querySelector(".average-value");
          var averageValue = parseInt(averageOutput.dataset.value);

          if (!isNaN(averageValue)) {
            totalSum += averageValue;
            totalCount++;
          }
        });

        var averageResult = Math.round(totalSum / totalCount);

        if (!isNaN(averageResult) && resultDiv) {
          resultDiv.textContent = averageResult;
        }
      }
    });
  });
});

async function submitForm() {
  const lastName = document.getElementById("lastName").value;
  const firstName = document.getElementById("firstName").value;
  const lastNameCd = document.getElementById("lastName-cd").value;
  const firstNameCd = document.getElementById("firstName-cd").value;
  const job = document.getElementById("job-field").value;

  if (
    lastName.trim() === "" ||
    firstName.trim() === "" ||
    lastNameCd.trim() === "" ||
    firstNameCd.trim() === "" ||
    job.trim() === ""
  ) {
    const confirmed = confirm(
      "Не все поля заполнены. Вы уверены, что хотите продолжить?"
    );
    if (!confirmed) {
      return;
    }
  }
  const middleName = document.getElementById("middleName").value;
  const middleNameCd = document.getElementById("middleName-cd").value;
  const comment = document.getElementById("comment-field").value;

  const button = document.getElementById("sendButton");
  button.innerText = "";
  button.classList.add("loading");

  const averageValues = [];

  const quizElementsList = document.querySelectorAll(".quiz-element");
  quizElementsList.forEach((quizElement) => {
    const averageOutput = quizElement.querySelector(".average-value");
    const averageValue = averageOutput
      ? averageOutput.textContent
      : "Нет данных";
    averageValues.push(averageValue);
  });
  const resultDivs = [];

  const quizPostList = document.querySelectorAll(".quiz-post");
  quizPostList.forEach((quizElement) => {
    const resultOutput = quizElement.querySelector(".result");
    const resultDiv = resultOutput ? resultOutput.textContent : "Нет данных";
    resultDivs.push(resultDiv);
  });

  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lastName,
      firstName,
      middleName,
      lastNameCd,
      firstNameCd,
      middleNameCd,
      job,
      comment,
      averageValues,
      resultDivs,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blobData) => {
      const blobUrl = URL.createObjectURL(blobData);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${lastNameCd}${firstNameCd}${middleNameCd}_LM.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      button.innerText = "Скачать результаты";

      button.classList.remove("loading");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// ______________________________________________________

document.getElementById("sendButtonHR").onclick = async function () {
  await submitFormHR();
};

async function submitFormHR() {
  const lastName = document.getElementById("lastName").value;
  const firstName = document.getElementById("firstName").value;
  const lastNameCd = document.getElementById("lastName-cd").value;
  const firstNameCd = document.getElementById("firstName-cd").value;

  if (
    lastName.trim() === "" ||
    firstName.trim() === "" ||
    lastNameCd.trim() === "" ||
    firstNameCd.trim() === ""
  ) {
    const confirmed = confirm(
      "Не все поля заполнены. Вы уверены, что хотите продолжить?"
    );
    if (!confirmed) {
      return;
    }
  }
  const middleName = document.getElementById("middleName").value;
  const middleNameCd = document.getElementById("middleName-cd").value;
  const job = document.getElementById("job-field").value;
  const comment = document.getElementById("comment-field").value;

  const buttonHR = document.getElementById("sendButtonHR");
  buttonHR.innerText = "";
  buttonHR.classList.add("loading");

  const averageValues = [];

  const quizElementsList = document.querySelectorAll(".quiz-element");
  quizElementsList.forEach((quizElement) => {
    const averageOutput = quizElement.querySelector(".average-value");
    const averageValue = averageOutput
      ? averageOutput.textContent
      : "Нет данных";
    averageValues.push(averageValue);
  });
  const resultDivs = [];

  const quizPostList = document.querySelectorAll(".quiz-post");
  quizPostList.forEach((quizElement) => {
    const resultOutput = quizElement.querySelector(".result");
    const resultDiv = resultOutput ? resultOutput.textContent : "Нет данных";
    resultDivs.push(resultDiv);
  });

  fetch("/submitHR", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lastName,
      firstName,
      middleName,
      lastNameCd,
      firstNameCd,
      middleNameCd,
      job,
      comment,
      averageValues,
      resultDivs,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob();
    })
    .then((blobData) => {
      const blobUrl = URL.createObjectURL(blobData);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${lastNameCd}${firstNameCd}${middleNameCd}_HR.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      buttonHR.innerText = "Скачать результаты";

      buttonHR.classList.remove("loading");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
