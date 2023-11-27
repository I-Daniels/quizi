// const lastName = document.getElementById('lastName')
// const firstName = document.getElementById('firstName')
// const middleName = document.getElementById('middleName')

// const lastNameCD = document.getElementById('lastName-cd')
// const firstNameCD = document.getElementById('firstName-cd')
// const middleNameCD = document.getElementById('middleName-cd')

// const job_field = document.getElementById('job-field')

// const comment = document.getElementById('comment-field')

// console.log("jsPDF loaded");

// function downloadPDF() {
//     var iframe = document.getElementById('iframe');

//     // Сохраняем текущую высоту iframe
//     var originalHeight = iframe.style.height;

//     iframe.onload = function () {
//         if (iframe.contentDocument.readyState === 'complete') {
//             // Устанавливаем высоту iframe в 0
//             iframe.style.height = '0';

//             var iframeContent = iframe.contentWindow.document.body;
//             var pdf = new jsPDF();

//             // Обрабатываем контент в iframe
//             html2canvas(iframeContent).then(function (canvas) {
//                 var imgData = canvas.toDataURL('image/png');
//                 pdf.addImage(imgData, 'PNG', 10, 10, 280, 0);

//                 // Восстанавливаем исходную высоту iframe
//                 iframe.style.height = originalHeight;

//                 // Сохраняем PDF
//                 pdf.save(lastNameCD + firstNameCD + middleNameCD + '.pdf');
//             });
//         }
//     };

//     // Загружаем iframe, если он еще не загружен
//     if (iframe.contentDocument.readyState === 'complete') {
//         iframe.src = iframe.src;
//     }
// }


// document.getElementById('sendButton').onclick = function () {
//     let wspFrame = document.getElementById('iframe').contentWindow;

//     if (lastName.value.trim() === "" || firstName.value.trim() === "" || lastNameCD.value.trim() === "" || firstNameCD.value.trim() === "" || job_field.value.trim() === "") {
//         alert("Вы ввели не все данные...");
//         return;
//     } else {
//         itemSet();
//         saveRadioState();
//         reloadIFrame();
//         downloadPDF();
//     }

//     function reloadIFrame() {
//         document.getElementById('iframe').contentWindow.location.reload();
//     }

//     function itemSet() {
//         localStorage.setItem('lastname', lastName.value);
//         localStorage.setItem('firstname', firstName.value);
//         localStorage.setItem('middlename', middleName.value);

//         localStorage.setItem('lastNameCD', lastNameCD.value);
//         localStorage.setItem('firstNameCD', firstNameCD.value);
//         localStorage.setItem('middleNameCD', middleNameCD.value);

//         localStorage.setItem('job-field', job_field.value);

//         localStorage.setItem('comment', comment.value);
//     }

//     function saveRadioState() {
//         for (var i = 1; i <= 168; i++) {
//             var radioId = "i-" + i;
//             var radioElement = document.getElementById(radioId);

//             if (radioElement) {
//                 localStorage.setItem(radioId, radioElement.checked);
//             }
//         }
//     }
// };

// script.js

// script.js

document.getElementById('sendButton').onclick = async function () {
    await submitForm();
    
}

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
            radioButtonsState
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
