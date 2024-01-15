document.getElementById('sendButton').onclick = async function () {
    await submitForm();

}

document.addEventListener("DOMContentLoaded", function () {
    var quizPosts = document.querySelectorAll('.quiz-post');

    quizPosts.forEach(function (quizPost) {
        var quizElementsList = quizPost.querySelectorAll('.quiz-element');
        var resultDiv = quizPost.querySelector('.result');

        quizElementsList.forEach(function (quizElement) {
            var quizElementsListInner = quizElement.querySelectorAll('.quiz-elements, .quiz-elements-align');
            var averageOutputDiv = quizElement.querySelector('.average-value');

            quizElementsListInner.forEach(function (quizElements) {
                var radioButtons = quizElements.querySelectorAll('input[type="radio"]');

                radioButtons.forEach(function (radioButton) {
                    radioButton.addEventListener('change', function () {
                        updateAverage();
                        updateResult();
                        updateHeadingResult();
                    });
                });
            });


            function updateAverage() {
                var sumValues = 0;
                var countChecked = 0;

                quizElementsListInner.forEach(function (quizElements) {
                    var checkedRadioButton = quizElements.querySelector('input[type="radio"]:checked');
                    if (checkedRadioButton) {
                        sumValues += parseInt(checkedRadioButton.value);
                        countChecked++;
                    }
                });

                if (countChecked > 0) {
                    var averageValue = Math.round(sumValues / countChecked);
                    var averageText;

                    if (averageValue >= 0 && averageValue <= 4) {
                        averageText = 'Ниже ожиданий';
                    } else if (averageValue >= 5 && averageValue <= 9) {
                        averageText = 'Соответствует ожиданиям';
                    } else {
                        averageText = 'Выше ожиданий';
                    }

                    if (averageOutputDiv) {
                        averageOutputDiv.textContent = averageText;
                        averageOutputDiv.dataset.value = averageValue;
                    }
                } else {
                    if (averageOutputDiv) {
                        averageOutputDiv.textContent = 'Нет данных';
                    }
                }
            }

            function updateResult() {
                var totalSum = 0;
                var totalCount = 0;

                quizElementsList.forEach(function (quizElement) {
                    var averageOutput = quizElement.querySelector('.average-value');
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
    }
    )
    var radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', function () {
            updateSendButtonState();
        });
    });

    function updateSendButtonState() {
        var allGroupsHaveSelection = true;

        for (var i = 1; i <= 56; i++) {
            if (i === 16) {
                continue;
            }

            var groupName = 'i_' + i;
            var groupButtons = document.querySelectorAll('input[type="radio"][name="' + groupName + '"]');
            var groupHasSelection = Array.from(groupButtons).some(function (radioButton) {
                return radioButton.checked;
            });

            if (!groupHasSelection) {
                allGroupsHaveSelection = false;
                break;
            }
        }

        var sendButton = document.getElementById('sendButton');

        if (allGroupsHaveSelection) {
            sendButton.removeAttribute('disabled');
        } else {
            sendButton.setAttribute('disabled', 'true');
        }
    }
});


async function submitForm() {
    const lastName = document.getElementById('lastName').value;
    const firstName = document.getElementById('firstName').value;
    const middleName = document.getElementById('middleName').value;
    const lastNameCd = document.getElementById('lastName-cd').value;
    const firstNameCd = document.getElementById('firstName-cd').value;
    const middleNameCd = document.getElementById('middleName-cd').value;
    const job = document.getElementById('job-field').value;
    const comment = document.getElementById('comment-field').value;

    const radioButtonsState = {};
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radioButton => {
        radioButtonsState[radioButton.id] = radioButton.checked;
    });


    const averageValues = [];

    const quizElementsList = document.querySelectorAll('.quiz-element');
    quizElementsList.forEach(quizElement => {
        const averageOutput = quizElement.querySelector('.average-value');
        const averageValue = averageOutput ? averageOutput.textContent : 'Нет данных';
        averageValues.push(averageValue);

    });
    const resultDivs = [];

    const quizPostList = document.querySelectorAll('.quiz-post');
    quizPostList.forEach(quizElement => {
        const resultOutput = quizElement.querySelector('.result');
        const resultDiv = resultOutput ? resultOutput.textContent : 'Нет данных';
        resultDivs.push(resultDiv);

    });


    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
            radioButtonsState,
            averageValues,
            resultDivs,
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    }).then(blobData => {

        const blobUrl = URL.createObjectURL(blobData);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${lastNameCd}${firstNameCd}${middleNameCd}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


}