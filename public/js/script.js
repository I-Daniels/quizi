document.getElementById("sendButton").onclick = async function () {
  await submitForm();
};

document.addEventListener('DOMContentLoaded', function() {
  const hrButton = document.getElementById('hrButton');
  const lineManagerButton = document.getElementById('lineManagerButton');
  const selectManage = document.getElementById('selectManage');
  const hrQuiz = document.getElementById('hrquiz');
  const LMQuiz = document.getElementById('LMquiz');

  function showHRQuestions() {
      selectManage.parentNode.removeChild(selectManage);
      hrQuiz.style.display = 'flex';
      document.body.style.overflow = 'auto';
      LMQuiz.parentNode.removeChild(LMQuiz);
  }

  function showLineManagerQuestions() {
      selectManage.parentNode.removeChild(selectManage);
      LMQuiz.style.display = 'flex';
      document.body.style.overflow = 'auto';
      hrQuiz.parentNode.removeChild(hrQuiz);
  }

  hrButton.addEventListener('click', function() {
      showHRQuestions();
  });

  lineManagerButton.addEventListener('click', function() {
      showLineManagerQuestions();
  });
});

function updateSendButtonState() {
  var sendButton = document.getElementById("sendButton");
  var sendButtonHR = document.getElementById("sendButtonHR");
  var hrQuiz = document.getElementById("hrquiz");

  if (hrQuiz) {
    var sendButtonHRGroups = ["i_1", "i_2", "i_3", "i_4", "i_5", "i_6", "i_7", "i_8", "i_9", "i_10", "i_11", "i_12", "i_13", "i_14", "i_15", "i_25", "i_26", "i_27", "i_17", "i_28", "i_29", "i_30", "i_31", "i_32", "i_33", "i_41", "i_42", "i_43", "i_44", "i_45", "i_46", "i_47", "i_48", "i_52", "i_53", "i_54", "i_55", "i_56"];

    var sendButtonHRAllChecked = sendButtonHRGroups.every(function(groupName) {
      var groupButtons = document.querySelectorAll('input[type="radio"][name="' + groupName + '"]');
      return Array.from(groupButtons).some(function(radioButton) {
        return radioButton.checked;
      });
    });

    if (sendButtonHRAllChecked) {
      sendButtonHR.removeAttribute("disabled");
    } else {
      sendButtonHR.setAttribute("disabled", "true");
    }
  } else {
    var sendButtonGroups = ["i_18", "i_19", "i_20", "i_21", "i_22", "i_23", "i_24", "i_34", "i_35", "i_36", "i_37", "i_38", "i_39", "i_40", "i_49", "i_50", "i_51"];

    var sendButtonAllChecked = sendButtonGroups.every(function(groupName) {
      var groupButtons = document.querySelectorAll('input[type="radio"][name="' + groupName + '"]');
      return Array.from(groupButtons).some(function(radioButton) {
        return radioButton.checked;
      });
    });

    if (sendButtonAllChecked) {
      sendButton.removeAttribute("disabled");
    } else {
      sendButton.setAttribute("disabled", "true");
    }
  }
}

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
  var radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(function (radioButton) {
    radioButton.addEventListener("change", function () {
      updateSendButtonState();
    });
  });
});

async function submitForm() {
  const lastName = document.getElementById("lastName").value;
  const firstName = document.getElementById("firstName").value;
  const lastNameCd = document.getElementById("lastName-cd").value;
  const firstNameCd = document.getElementById("firstName-cd").value;
  const job = document.getElementById("job-field").value;

  if (lastName.trim() === "" || firstName.trim() === "" || lastNameCd.trim() === "" || firstNameCd.trim() === "" || job.trim() === "") {
    const confirmed = confirm("Не все поля заполнены. Вы уверены, что хотите продолжить?");
    if (!confirmed) {
      return;
    }
  }
  const middleName = document.getElementById("middleName").value;
  const middleNameCd = document.getElementById("middleName-cd").value;
  const comment = document.getElementById("comment-field").value;


  const button = document.getElementById('sendButton');
  button.innerText = '';
  button.classList.add('loading');

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

      button.innerText = 'Скачать результаты';

      button.classList.remove('loading');
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

  if (lastName.trim() === "" || firstName.trim() === "" || lastNameCd.trim() === "" || firstNameCd.trim() === "") {
    const confirmed = confirm("Не все поля заполнены. Вы уверены, что хотите продолжить?");
    if (!confirmed) {
      return;
    }
  }
  const middleName = document.getElementById("middleName").value;
  const middleNameCd = document.getElementById("middleName-cd").value;
  const job = document.getElementById("job-field").value;
  const comment = document.getElementById("comment-field").value;

  const buttonHR = document.getElementById('sendButtonHR');
  buttonHR.innerText = '';
  buttonHR.classList.add('loading');
  
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

      buttonHR.innerText = 'Скачать результаты';

      buttonHR.classList.remove('loading');
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}