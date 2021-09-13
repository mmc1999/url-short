const $form = document.getElementById("formulario"),
    $input = document.querySelector(".input"),
    $insertarEnlace = document.querySelector(".insertarLosEnlaces"),
    $sectionBorrar = document.querySelector(".sectionBorrar");

let expresionRegular = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    enlaces = [];

const validarForm = async () => {
    try {
        let url = await fetch(`https://api.shrtco.de/v2/shorten?url=${$input.value}`);
        let data = await url.json();
        guardarEnlace(data);
        $form.reset();
        if(!data.ok) throw {respuesta:data.error, codigo:data.error_code}
    } catch (err) {
        console.log(`El error fue ${err.respuesta} y el codigo del error es el ${err.codigo}`)
    }
} 

const guardarEnlace = (data) => {
    if($input.value.trim() === "") return console.log("esta vacio")
    const enlace = {
        id : enlaces.length+1,
        enlaceOriginal : data.result.original_link,
        enlaceCorto : data.result.full_short_link
    }
    enlaces.push(enlace);
}

const mostrarDatos = () => {
    enlaces = JSON.parse(localStorage.getItem("enlaces"));
    $insertarEnlace.innerHTML = "";
    if(enlaces === null){
        enlaces = [];
    } else {
        enlaces.forEach(el => {
        $insertarEnlace.innerHTML+=`
            <div class="divAgregado">
                <p class="enlaceOriginal">${el.enlaceOriginal}</p>
                <div class="divAdentroGenerado">
                    <p class="enlaceOriginal enlacecorto">${el.enlaceCorto}</p>
                    <button class="botonParaCopiar">copy</button>
                </div>
            </div>`;
        })
        if(enlaces.length > 0) {
            $sectionBorrar.style.display = "block";
        } 
    }
}

const guardarLS = () => {
    localStorage.setItem("enlaces", JSON.stringify(enlaces))
    mostrarDatos();
};

$form.addEventListener("submit", e => {
    e.preventDefault();
    validarForm()
    guardarLS();
});

document.addEventListener("click", e => {
    /* MENU MOBILE */
    if (e.target.matches(".iconoMobile")) document.querySelector(".menuMobile").classList.toggle("active")
    /* FIN DE MENU MOBILE */
    if(e.target.matches(".borrarTodo")) {
        $insertarEnlace.innerHTML = "";
        $sectionBorrar.style.display = "none";
        localStorage.clear();
        enlaces = [];
    }
})

document.addEventListener("DOMContentLoaded", mostrarDatos)
