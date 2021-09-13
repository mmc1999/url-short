const $form = document.getElementById("formulario"),
    $input = document.querySelector(".input"),
    $insertarEnlace = document.querySelector(".insertarLosEnlaces"),
    $sectionBorrar = document.querySelector(".sectionBorrar");

let expresionRegular = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
    enlaces = [];

/* COPIAR TEXTO */


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
    enlaces = JSON.parse(localStorage.getItem("enlaces") || "[]");
    $insertarEnlace.innerHTML = "";
    if(enlaces === null){
        enlaces = [];
    } 
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

const guardarLS = () => {
    localStorage.setItem("enlaces", JSON.stringify(enlaces))
    mostrarDatos();
};

const validarInput = () => {
    if(expresionRegular.test($input.value)) {
        document.querySelector(".mensajeError").classList.add("desactivar")
        document.querySelector(".input").classList.remove("inputInvalido")
    } else {
        document.querySelector(".mensajeError").classList.remove("desactivar")
        document.querySelector(".input").classList.add("inputInvalido")
        setTimeout(() => {
            document.querySelector(".mensajeError").classList.add("desactivar")
            document.querySelector(".input").classList.remove("inputInvalido")
        }, 4000);  
    }
}

const copiarTexto = () => {
    let content = document.querySelector('.enlacecorto').innerHTML;
    console.log(navigator.clipboard)
    navigator.clipboard.writeText(content)
        .then(() => {
        console.log("Text copied to clipboard...")
    })
        .catch(err => {
        console.log('Something went wrong', err);
    })

    setTimeout(() => {
        document.querySelector(".botonParaCopiar").textContent = "Copied!"
        document.querySelector(".botonParaCopiar").style.backgroundColor = "#3A3054"
        setTimeout(() => {
            document.querySelector(".botonParaCopiar").textContent = "Copy"
            document.querySelector(".botonParaCopiar").style.backgroundColor = "#2BD0D0"
        }, 3000); 
    });
    
}

$form.addEventListener("submit", e => {
    e.preventDefault();
    validarForm()
    guardarLS();
    validarInput();
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
    if(e.target.matches(".botonParaCopiar")) copiarTexto();
})

document.addEventListener("DOMContentLoaded", mostrarDatos);

