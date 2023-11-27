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
    }, 1000);
})



