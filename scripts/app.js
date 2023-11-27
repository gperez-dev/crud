document.addEventListener('DOMContentLoaded', () => {
    const resultsList = document.getElementById('results');
    const alertError = document.getElementById('alert-error');
    const dataModal = new bootstrap.Modal(document.getElementById('dataModal'));

    // Función para mostrar un error en la interfaz
    function showError(message) {
        alertError.textContent = message;
        alertError.classList.remove('fade');
        setTimeout(() => {
            alertError.classList.add('fade');
        }, 5000);
    }

    // Función para realizar una solicitud GET para listar registros
    function listRecords() {
        fetch('https://654a3a13e182221f8d52c406.mockapi.io/users')
            .then((response) => response.json())
            .then((data) => {
                resultsList.innerHTML = ''; // Limpiamos la lista
                data.forEach((record) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `ID: ${record.id}, Nombre: ${record.name}, Apellido: ${record.lastname}`;
                    resultsList.appendChild(listItem);
                });
            })
            .catch((error) => {
                showError('Error al obtener la lista de registros.');
            });
    }

    // Función para realizar una solicitud GET para obtener un registro por ID
    function getRecordById() {
        const inputGet1Id = document.getElementById('inputGet1Id').value;
        const endpoint = `https://654a3a13e182221f8d52c406.mockapi.io/users/${inputGet1Id}`;
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                resultsList.innerHTML = ''; // Limpiamos la lista
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${data.id}, Nombre: ${data.name}, Apellido: ${data.lastname}`;
                resultsList.appendChild(listItem);
            })
            .catch((error) => {
                showError('Error al obtener el registro.');
            });
    }

    // Event listener para el botón "Buscar"
    document.getElementById('btnGet1').addEventListener('click', () => {
        const inputGet1Id = document.getElementById('inputGet1Id').value;
        if (inputGet1Id) {
            getRecordById();
        } else {
            listRecords();
        }
    });

    // Event listener para el botón "Agregar"
    document.getElementById('btnPost').addEventListener('click', () => {
        const inputPostNombre = document.getElementById('inputPostNombre').value;
        const inputPostApellido = document.getElementById('inputPostApellido').value;

        const nuevoRegistro = {
            name: inputPostNombre,
            lastname: inputPostApellido,
        };

        fetch('https://654a3a13e182221f8d52c406.mockapi.io/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoRegistro),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al agregar el registro.');
                }
            })
            .then(() => {
                listRecords(); // Actualizar la lista de registros
            })
            .catch((error) => {
                showError(error.message);
            });
    });

    // Event listener para el botón "Modificar"
    document.getElementById('btnPut').addEventListener('click', () => {
        const inputPutId = document.getElementById('inputPutId').value;

        // Realizar una solicitud GET para obtener el registro por ID
        fetch(`https://654a3a13e182221f8d52c406.mockapi.io/users/${inputPutId}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener el registro para modificar.');
                }
            })
            .then((data) => {
                // Llenar el modal con los valores del registro
                const inputPutNombre = document.getElementById('inputPutNombre');
                const inputPutApellido = document.getElementById('inputPutApellido');

                inputPutNombre.value = data.name;
                inputPutApellido.value = data.lastname;

                // Mostrar el modal
                dataModal.show();
            })
            .catch((error) => {
                showError(error.message);
            });
    });

    // Event listener para el botón "Guardar cambios" dentro del modal
    document.getElementById('btnSendChanges').addEventListener('click', () => {
        const inputPutId = document.getElementById('inputPutId').value;
        const inputPutNombre = document.getElementById('inputPutNombre').value;
        const inputPutApellido = document.getElementById('inputPutApellido').value;

        const registroModificado = {
            name: inputPutNombre,
            lastname: inputPutApellido,
        };

        fetch(`https://654a3a13e182221f8d52c406.mockapi.io/users/${inputPutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registroModificado),
        })
            .then((response) => {
                if (response.ok) {
                    dataModal.hide(); // Cerrar el modal
                    listRecords(); // Actualizar la lista de registros
                } else {
                    throw new Error('Error al guardar los cambios.');
                }
            })
            .catch((error) => {
                showError(error.message);
            });
    });
});
