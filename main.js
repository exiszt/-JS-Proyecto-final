//Declaración: Formularios, contenedores, variables

let formNombre = document.getElementById("formNombre")
let formPreguntas = document.getElementById("trivia")
let respuestas = document.getElementsByClassName("alternativas")
let contNombre = document.getElementById("contNombre")
let contFormulario = document.getElementById("contFormulario")
let contenido = document.getElementById("contenido")
let contPregunta = document.getElementById("contPregunta")
let puntuaciones = JSON.parse(localStorage.getItem("arregloStorage"))
let puntaje = 0
let jugador
let preguntas
let respCorrectaIndex
let pregIndex = 0
let cantidad = document.getElementById("cantidad")
let categoria = document.getElementById("categoria")
let dificultad = document.getElementById("dificultad")
let tipo = document.getElementById("tipo")

// Interacción con API

const triviaStorage = () => {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("arregloStorage", JSON.stringify(puntuaciones))
  } else {
    console.log("Error de compatibilidad.")
  }
}

// Primera interacción (nombre de usuario)

const guardarJugador = event => {
  event.preventDefault()
  if (document.getElementById("nombreIngresado").value == "") {
    Toastify({
      text: "Por favor, ingrese su nombre.",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "red",
      },
      onClick: function(){}
    }).showToast()
  } else if (puntuaciones === null) {
    puntuaciones = []
    jugador = {
      name: document.getElementById("nombreIngresado").value,
      puntuacion: puntaje,
    }
    puntuaciones.push(jugador)
    triviaStorage()
    contNombre.style.display = "none"
    contFormulario.style.display = "block"

  }
  else {
    let flag = true
    for (let i = 0; i < puntuaciones.length; i++) {
      let nombre = puntuaciones[i].name
      if (nombre === document.getElementById("nombreIngresado").value) {
        flag = false
      }
    }

    if (flag == true) {
      jugador = {
        name: document.getElementById("nombreIngresado").value,
        puntuacion: puntaje,
      }
      puntuaciones.push(jugador)
      triviaStorage()
      contNombre.style.display = "none"
      contFormulario.style.display = "block"

    } else {
      Toastify({
        text: "Ese nombre ya está en uso.",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "red",
        },
        onClick: function(){}
      }).showToast()
    }
  }
}

// Fetch API

const obtenerPreguntas = e => {
  e.preventDefault()
  const url = `https://opentdb.com/api.php?amount=${cantidad.value}&category=${categoria.value}&difficulty=${dificultad.value}&type=${tipo.value}`
  fetch(url)
    .then(res => {
      return res.json()
    })
    .then(data => {
      preguntas = data.results
      proxPregunta()
    })
    .catch(error => {
      console.log(error)
    })
}

// Mostrar preguntas

const proxPregunta = () => {
  if (pregIndex == cantidad.value) {
    mostrarResultado()
    return
  }

  if (preguntas.length > 0) {
    contFormulario.style.display = "none"
    contenido.style.display = "block"
    let pregActual = preguntas[pregIndex]
    document.getElementById("enunciadoPregunta").innerText =
      pregActual.question

    // Preguntas Verdadero/Falso

    if (pregActual.incorrect_answers.length == 1) {
      document.getElementById(1).innerHTML = "True"
      document.getElementById(2).innerHTML = "False"
      document.getElementById(3).style.display = "none"
      document.getElementById(4).style.display = "none"
      if (pregActual.correct_answer === "True") {respCorrectaIndex = 1}
      else { respCorrectaIndex = 2 }
    } else {
      document.getElementById(3).style.display = "inline"
      document.getElementById(4).style.display = "inline"

      respCorrectaIndex = Math.floor(Math.random() * 4) + 1
      document.getElementById(respCorrectaIndex).innerHTML = pregActual.correct_answer

      let j = 0
      for (let i = 1; i <= 4; i++) {
        if (i == respCorrectaIndex) continue
        document.getElementById(i).innerHTML =
          pregActual.incorrect_answers[j]
        j++
      }
    }
  }

  document.getElementById("indicePregunta").innerHTML = pregIndex + 1
  document.getElementById("cantidadPreguntas").innerHTML = cantidad.value

}

// Elegir alternativas (sumar puntos, continuar trivia, notificaciones)

const elegirOpcion = (id) => {
  if (id == respCorrectaIndex) {
    puntaje += 1
    Toastify({
      text: "¡Correcto!",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
      background: "deepskyblue",
      },
      onClick: function(){}
    }).showToast()
    jugador.puntuacion = puntaje
    triviaStorage()
    pregIndex++
  } else {
    puntaje += 0
    Toastify({
      text: "¡Incorrecto!",
      duration: 3000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "red",
      },
      onClick: function(){}
    }).showToast()
    pregIndex++
  }
  proxPregunta()
}

for (let i = 0; i < respuestas.length; i++) {
  const element = respuestas[i]
  element.addEventListener("click", () => elegirOpcion(element.id))
}

// Resultados usuario

const mostrarResultado = () => {
  contPregunta.innerHTML = ""

  let encabezado = document.createElement("div")
  encabezado.innerHTML = `<h2>${jugador.name}, obtuviste: <br> <span class="span-titulo">${puntaje}/${cantidad.value}</span></h2>`
  contPregunta.appendChild(encabezado)

  let tabla = document.createElement("table")
  tabla.setAttribute("id", "tabla-usuarios")
  contPregunta.appendChild(tabla)

  let thead = document.createElement("thead")
  tabla.appendChild(thead)

  let trHead = document.createElement("tr")
  thead.appendChild(trHead)

  let thUsuario = document.createElement("th")
  thUsuario.setAttribute("class", "tabla-head")
  thUsuario.innerText = "Usuario"
  trHead.appendChild(thUsuario)

  let thPuntuaciones = document.createElement("th")
  thPuntuaciones.setAttribute("class", "tabla-head")
  thPuntuaciones.innerText = "Puntos"
  trHead.appendChild(thPuntuaciones)

  let bodyTabla = document.createElement("tbody")
  tabla.appendChild(bodyTabla)

  let filaTabla = document.createElement("tr")
  bodyTabla.appendChild(filaTabla)

  let ordenPuntuaciones = puntuaciones.sort(function (a, b) { return b.puntuacion - a.puntuacion })

  // Tabla puntajes  

  ordenPuntuaciones.forEach(element => {

    let filaTabla = document.createElement("tr")
    bodyTabla.appendChild(filaTabla)

    let tdUsuario = document.createElement("td")
    tdUsuario.setAttribute("class", "tabla-contenido")
    tdUsuario.innerText = element.name

    let tdPuntuaciones = document.createElement("td")
    tdPuntuaciones.setAttribute("class", "tabla-contenido")
    tdPuntuaciones.innerText = element.puntuacion

    filaTabla.appendChild(tdUsuario)
    filaTabla.appendChild(tdPuntuaciones)
  })

  // Botones final (volver a jugar/borrar puntajes)

  let link = document.createElement("a")
  link.setAttribute("href", "index.html")
  contPregunta.appendChild(link)

  let btnReintentar = document.createElement("button")
  btnReintentar.setAttribute("class", "boton reinicio boton-fin")
  btnReintentar.innerText = `Reintentar`
  link.appendChild(btnReintentar)

  let btnLimpiar = document.createElement("button")
  btnLimpiar.setAttribute("class", "boton limpiar boton-fin")
  btnLimpiar.innerText = `Borrar puntajes`
  btnLimpiar.addEventListener("click", function borrarLocalStorage() {
    localStorage.clear()
  })
  link.appendChild(btnLimpiar)
}

// Eventos

formNombre.addEventListener("submit", guardarJugador)
formPreguntas.addEventListener("submit", obtenerPreguntas)