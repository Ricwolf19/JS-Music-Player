const canciones = [
  { nombre: 'Uptown Funk', tiempo: 270 },
  { nombre: 'Shape of You', tiempo: 233 },
  { nombre: 'Despacito', tiempo: 229 },
  { nombre: 'Thinking Out Loud', tiempo: 281 },
  { nombre: 'Blurred Lines', tiempo: 240 },
  { nombre: 'See You Again', tiempo: 230 },
  { nombre: 'Old Town Road', tiempo: 157 },
  { nombre: 'Closer', tiempo: 244 },
  { nombre: 'Sunflower', tiempo: 158 },
  { nombre: 'Havana', tiempo: 217 }
];

let indiceMostrado = -1;
let temporizador;
let historial = [];

const cancionesLista = document.getElementById('canciones-lista');
const cancionEnReproduccion = document.getElementById('cancion-en-reproduccion');

function mostrarCanciones() {
  cancionesLista.innerHTML = '';

  for (let i = 0; i < canciones.length; i++) {
    const cancion = canciones[i];
    const elementoLista = document.createElement('li');
    elementoLista.classList.add('nombre-cancion');
    elementoLista.textContent = `▶ ${cancion.nombre}`;
    elementoLista.addEventListener('click', () => reproducirCancion(i));
    cancionesLista.appendChild(elementoLista);

    const iconoBasura = document.createElement('span');
    iconoBasura.innerHTML = '&#x1F5D1;';  // Unicode para un bote de basura
    iconoBasura.classList.add('boton-eliminar');
    iconoBasura.addEventListener('click', (event) => eliminarCancion(event, i));
    elementoLista.appendChild(iconoBasura);
  }
}

function reproducirCancion(indice) {
  // Restaurar la canción anterior al historial
  if (indiceMostrado !== -1) {
    historial.push(canciones[indiceMostrado]);
  }

  // Detener temporizador si hay uno en curso
  if (temporizador) {
    clearInterval(temporizador);
  }

  // Restaurar el estilo de la canción previamente reproducida
  if (indiceMostrado !== -1) {
    const cancionAnterior = cancionesLista.children[indiceMostrado];
    cancionAnterior.classList.remove('escuchando');
  }

  // Resaltar la canción actual
  const cancionActual = cancionesLista.children[indice];
  cancionActual.classList.add('escuchando');

  // Actualizar la canción en reproducción
  cancionEnReproduccion.textContent = `EN REPRODUCCIÓN: ${canciones[indice].nombre}`;

  // Empezar temporizador
  let tiempoRestante = canciones[indice].tiempo;
  const contadorTiempo = document.createElement('span');
  cancionEnReproduccion.appendChild(contadorTiempo);

  temporizador = setInterval(() => {
    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      contadorTiempo.textContent = '';
      mostrarSiguienteCancion();
    } else {
      contadorTiempo.textContent = ` - Tiempo restante: ${tiempoRestante}s`;
      tiempoRestante--;
    }
  }, 1000);

  // Actualizar el índice mostrado
  indiceMostrado = indice;
}

function mostrarSiguienteCancion() {
  const siguienteIndice = (indiceMostrado + 1) % canciones.length;
  reproducirCancion(siguienteIndice);
}

function eliminarCancion(event, indice) {
  event.stopPropagation();

  swal({
    title: 'Eliminar Canción',
    text: '¿Estás seguro que quieres eliminar esta canción?',
    icon: 'warning',
    buttons: ['Cancelar', 'Eliminar'],
  }).then((willDelete) => {
    if (willDelete) {
      canciones.splice(indice, 1);
      mostrarCanciones();
      swal('Canción eliminada correctamente', {
        icon: 'success',
      });
    }
  });
}

function agregarCancion() {
  swal("Nueva canción", {
    content: "input",
    title: "Ingrese el nombre de la nueva canción:",
    buttons: {
      cancel: "Cancelar",
      confirm: {
        text: "Agregar",
        closeModal: false,
      },
    },
  }).then((value) => {
    if (value === null || value.trim() === "") {
      swal("Nombre inválido", "Por favor, ingrese un nombre válido.", "error");
    } else {
      const nuevoNombre = value;
      swal("Nueva canción", {
        content: "input",
        title: "Ingrese la duración de la nueva canción en segundos:",
        buttons: {
          cancel: "Cancelar",
          confirm: {
            text: "Agregar",
            closeModal: false,
          },
        },
      }).then((value) => {
        if (value === null || isNaN(parseInt(value))) {
          swal("Duración inválida", "Por favor, ingrese una duración numérica para la canción.", "error");
        } else {
          const nuevoTiempo = parseInt(value, 10);
          canciones.push({ nombre: nuevoNombre, tiempo: nuevoTiempo });
          mostrarCanciones();
          swal("Canción agregada", `La canción "${nuevoNombre}" ha sido agregada correctamente.`, "success");
        }
      });
    }
  });
}

function mostrarHistorial() {
  let historyMessage = 'Historial de canciones:\n';
  for (const song of historial) {
    historyMessage += `${song.nombre} - Tiempo: ${song.tiempo}s\n`;
  }

  if (historial.length === 0) {
    historyMessage += 'No hay canciones en el historial.';
  }

  alert(historyMessage);
}

function regresarCancion() {
  if (historial.length > 0) {
    const lastPlayedSong = historial.pop();
    const lastPlayedIndex = canciones.findIndex(song => song.nombre === lastPlayedSong.nombre);
    if (lastPlayedIndex !== -1) {
      reproducirCancion(lastPlayedIndex);
    }
  } else {
    swal('No hay canciones en el historial', '', 'info');
  }
}

mostrarCanciones();
