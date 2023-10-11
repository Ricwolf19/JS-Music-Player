// Arreglo de canciones con nombres y tiempos de duración
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

// Lista para mantener el historial de reproducción
let historial = [];

// Temporizador para contar el tiempo de reproducción
let temporizador;

// Variable para controlar si la reproducción está pausada
let isPaused = false;

// Obtiene elementos del DOM
const cancionesLista = document.getElementById('canciones-lista');
const historialLista = document.getElementById('historial-lista');
const cancionEnReproduccion = document.getElementById('cancion-en-reproduccion');

// Función para mostrar las canciones en la lista
function mostrarCanciones() {
  cancionesLista.innerHTML = '';

  for (let i = 0; i < canciones.length; i++) {
    const cancion = canciones[i];
    const elementoLista = document.createElement('li');
    elementoLista.classList.add('nombre-cancion');
    elementoLista.textContent = `▶ ${cancion.nombre}`;
    elementoLista.addEventListener('click', () => reproducirCancion(i, canciones));
    
    // Agregar icono de bote de basura para eliminar la canción
    const iconoBasura = document.createElement('span');
    iconoBasura.innerHTML = '&#x1F5D1;';  // Unicode para un bote de basura
    iconoBasura.classList.add('boton-eliminar');
    iconoBasura.addEventListener('click', (event) => eliminarCancion(event, i));
    elementoLista.appendChild(iconoBasura);
    
    cancionesLista.appendChild(elementoLista);
  }

  // Agregar botón para agregar nueva canción
  const agregarButton = document.createElement('button');
  agregarButton.textContent = 'Agregar nueva canción';
  agregarButton.addEventListener('click', agregarNuevaCancion);
  cancionesLista.appendChild(agregarButton);
}

// Función para agregar una nueva canción
function agregarNuevaCancion() {
  swal({
    text: 'Ingresa el nombre de la canción:',
    content: 'input',
    button: {
      text: 'Siguiente',
      closeModal: false,
    },
  }).then((nombreCancion) => {
    if (!nombreCancion) {
      swal('Debes ingresar un nombre de canción.', '', 'warning');
      return agregarNuevaCancion();
    }

    swal({
      text: 'Ingresa la duración en segundos:',
      content: 'input',
      button: {
        text: 'Agregar',
        closeModal: false,
      },
    }).then((tiempoCancion) => {
      if (!tiempoCancion || isNaN(tiempoCancion) || tiempoCancion < 0) {
        swal('Debes ingresar un tiempo válido en segundos.', '', 'warning');
        return agregarNuevaCancion();
      }

      const nuevaCancion = {
        nombre: nombreCancion,
        tiempo: parseInt(tiempoCancion),
      };

      // Agregar la nueva canción a la lista de reproducción
      canciones.push(nuevaCancion);
      mostrarCanciones();

      swal('¡Canción agregada!', '', 'success');
    });
  });
}

// Función para eliminar una canción
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

// Función para pausar o reanudar la reproducción
function togglePause() {
  isPaused = !isPaused;

  // Obtén el ícono de pausa y reanudación
  const iconoPausa = document.getElementById('icono-pausa');
  iconoPausa.innerHTML = isPaused ? '▶' : '⏸';  // Cambia el ícono según el estado de pausa

  if (isPaused) {
    clearInterval(temporizador);
  } else {
    reproducir(canciones[historial.length - 1], true);
  }
}

// Función para reproducir una canción
function reproducir(cancion, isResumed = false) {
  if (!isResumed) {
    clearInterval(temporizador);
  }

  let tiempoRestante = cancion.tiempo;
  const contadorTiempo = document.createElement('span');

  temporizador = setInterval(() => {
    if (!isPaused) {
      if (tiempoRestante <= 0) {
        clearInterval(temporizador);
        mostrarSiguienteCancion();
      } else {
        const minutos = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
        const segundos = (tiempoRestante % 60).toString().padStart(2, '0');
        contadorTiempo.textContent = ` - Tiempo restante: ${minutos}:${segundos}`;
        tiempoRestante--;
      }
    }
  }, 1000);

  cancionEnReproduccion.textContent = `EN REPRODUCCIÓN: ${cancion.nombre}`;
  cancionEnReproduccion.appendChild(contadorTiempo);
}

// Función para reproducir una canción específica
function reproducirCancion(indice, lista) {
  historial.push(lista.splice(indice, 1)[0]);
  mostrarCanciones();
  const cancionAnterior = cancionesLista.children[indice];
  if (cancionAnterior) {
    cancionAnterior.classList.remove('escuchando');
  }
  mostrarHistorial();
  reproducir(historial[historial.length - 1]);
}

// Función para mostrar la siguiente canción
function mostrarSiguienteCancion() {
  if (historial.length > 0) {
    const cancionSiguiente = historial.pop();
    canciones.push(cancionSiguiente);
    mostrarCanciones();
    mostrarHistorial();
    if (historial.length > 0) {
      reproducir(historial[historial.length - 1]);
    }
  }
}

// Función para mostrar el historial de reproducción
function mostrarHistorial() {
  historialLista.innerHTML = '';

  for (let i = 0; i < historial.length; i++) {
    const cancion = historial[i];
    const elementoLista = document.createElement('li');
    elementoLista.classList.add('nombre-cancion');
    elementoLista.textContent = `⏪ ${cancion.nombre}`;

    const regresarButton = document.createElement('button');
    regresarButton.textContent = 'Regresar';
    regresarButton.addEventListener('click', () => regresarCancion(i));

    elementoLista.appendChild(regresarButton);
    historialLista.appendChild(elementoLista);
  }
}

// Función para regresar una canción del historial a la lista de reproducción
function regresarCancion(indice) {
  if (historial.length > 0 && indice >= 0 && indice < historial.length) {
    canciones.push(historial.splice(indice, 1)[0]);
    mostrarCanciones();
    mostrarHistorial();
    if (!temporizador && historial.length > 0) {
      reproducir(historial[historial.length - 1]);
    }
  }
}

// Mostrar las canciones al cargar la página
mostrarCanciones();
