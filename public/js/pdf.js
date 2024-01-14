var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
var formattedDate = dd + '.' + mm + '.' + yyyy;
const dateNow = document.getElementById('dateNow');
dateNow.innerHTML = formattedDate;

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    const lastName = urlParams.get('lastName');
    const firstName = urlParams.get('firstName');
    const middleName = urlParams.get('middleName');
    const lastNameCd = urlParams.get('lastNameCd');
    const firstNameCd = urlParams.get('firstNameCd');
    const middleNameCd = urlParams.get('middleNameCd');
    const job = urlParams.get('job');
    const comment = urlParams.get('comment');
    const averageValuesJSON = urlParams.get('averageValues');
    const resultDivsJSON = urlParams.get('resultDivs');

    document.getElementById('fullname-hr').innerText = `${lastName} ${firstName} ${middleName}`;
    document.getElementById('fullname-cd').innerText = `${lastNameCd} ${firstNameCd} ${middleNameCd}`;
    document.getElementById('job').innerText = job;
    document.getElementById('comment').innerText = comment;

    const radioButtonsStateJSON = urlParams.get('radioButtonsState');
    const radioButtonsState = JSON.parse(radioButtonsStateJSON);

    console.log('Received data on the second page:');
    console.log('radioButtonsState:', radioButtonsState);

    setTimeout(function () {
        for (const radioButtonId in radioButtonsState) {
            const radioButton = document.getElementById(radioButtonId);
            if (radioButton) {
                radioButton.checked = radioButtonsState[radioButtonId];
            }
        }

        const averageValuesElements = document.querySelectorAll('.average-values');

        averageValuesElements.forEach((averageValuesElement, index) => {
            const tableInformationElements = document.querySelectorAll('.table-information');
            const tableInformationElement = tableInformationElements[index];

            if (averageValuesElement.innerText.trim() === "Выше ожиданий") {
                if (tableInformationElement) {
                    tableInformationElement.style.display = 'block';
                }
            } else {
                if (tableInformationElement) {
                    tableInformationElement.style.display = 'none';
                }
            }
        });
    }, 1000);

    // Вставка данных
    const averageValues = JSON.parse(averageValuesJSON);
    const averageValuesElements = document.querySelectorAll('.average-values');
    updateElements(averageValuesElements, averageValues, 'average-values');

    const resultDivs = JSON.parse(resultDivsJSON);
    const resultDivsElements = document.querySelectorAll('.result');
    updateElements(resultDivsElements, resultDivs, 'result');
});

function updateElements(elements, values, className) {
    if (elements.length === values.length) {
        elements.forEach((element, index) => {
            element.innerText = `${values[index]}`;
        });
    } else {
        console.error(`Mismatch in the number of elements with class '${className}' and the length of values array.`);
    }
}

function logToServer(data, message) {
    const logData = {
        data: data,
        message: message,
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/logToServer', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log('Log data sent successfully.');
        } else {
            console.error('Error sending log data.');
        }
    };

    xhr.send(JSON.stringify(logData));
}
