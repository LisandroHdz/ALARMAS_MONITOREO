let alarms = []; // Array para almacenar las alarmas

function setAlarm() {
    const alarmDateInput = document.getElementById('alarm-date').value;
    const alarmTimeInput = document.getElementById('alarm-time').value;
    const alarmMessage = document.getElementById('alarm-message').value;

    console.log("Fecha seleccionada:", alarmDateInput); // Depuración
    console.log("Hora seleccionada:", alarmTimeInput); // Depuración
    console.log("Mensaje ingresado:", alarmMessage); // Depuración

    if (!alarmDateInput || !alarmTimeInput) {
        alert('Por favor, selecciona una fecha y hora para la alarma.');
        return;
    }

    if (!alarmMessage) {
        alert('Por favor, ingresa un mensaje para la alarma.');
        return;
    }

    // Combinar fecha y hora en un solo objeto Date
    const alarmDateTime = new Date(`${alarmDateInput}T${alarmTimeInput}`);
    console.log("Fecha y hora de la alarma (Date):", alarmDateTime); // Depuración

    const now = new Date();
    const timeDiff = alarmDateTime - now;
    console.log("Diferencia de tiempo (ms):", timeDiff); // Depuración

    if (timeDiff < 0) {
        alert('La fecha y hora seleccionadas ya han pasado.');
        return;
    }

    // Agregar la alarma al array
    const alarm = {
        dateTime: alarmDateTime.toLocaleString(), // Formato legible de fecha y hora
        message: alarmMessage,
        timeoutId: setTimeout(() => triggerAlarm(alarm), timeDiff)
    };
    alarms.push(alarm);

    // Actualizar la tabla de alarmas activas
    updateActiveAlarmsTable();

    alert(`Alarma establecida para el ${alarmDateTime.toLocaleString()} con el mensaje: "${alarmMessage}"`);
}

function triggerAlarm(alarm) {
    alert(alarm.message); // Mostrar el mensaje de la alarma
    const audio = new Audio('alarm-sound.mp3');
    audio.play();

    // Mover la alarma a la tabla de alarmas pasadas
    moveAlarmToPast(alarm);
}

function moveAlarmToPast(alarm) {
    // Eliminar la alarma del array de alarmas activas
    alarms = alarms.filter(a => a !== alarm);

    // Actualizar la tabla de alarmas activas
    updateActiveAlarmsTable();

    // Agregar la alarma a la tabla de alarmas pasadas
    const pastAlarmsTable = document.getElementById('past-alarms').getElementsByTagName('tbody')[0];
    const newRow = pastAlarmsTable.insertRow();
    newRow.insertCell().textContent = alarm.dateTime;
    newRow.insertCell().textContent = alarm.message;
}

function updateActiveAlarmsTable() {
    const activeAlarmsTable = document.getElementById('active-alarms').getElementsByTagName('tbody')[0];
    activeAlarmsTable.innerHTML = ''; // Limpiar la tabla

    // Agregar cada alarma activa a la tabla
    alarms.forEach(alarm => {
        const newRow = activeAlarmsTable.insertRow();
        newRow.insertCell().textContent = alarm.dateTime;
        newRow.insertCell().textContent = alarm.message;

        // Botón para eliminar la alarma manualmente
        const actionCell = newRow.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.onclick = () => {
            clearTimeout(alarm.timeoutId); // Cancelar el temporizador
            alarms = alarms.filter(a => a !== alarm); // Eliminar la alarma del array
            updateActiveAlarmsTable(); // Actualizar la tabla
        };
        actionCell.appendChild(deleteButton);
    });
}