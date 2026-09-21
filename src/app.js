const API_URL = String(window.API_URL || "").replace(/\/+$/, "");

const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");
const mensaje = document.getElementById("mensaje");
const historial = document.getElementById("historial");

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo ? "mensaje " + tipo : "mensaje";
}

async function cargar() {
    historial.innerHTML = "";
    try {
        const res = await fetch(API_URL + "/api/historial");
        if (res.status === 503) {
            mostrarMensaje("Historial no disponible en este momento.", "aviso");
            return;
        }
        if (!res.ok) {
            mostrarMensaje("No se pudo cargar el historial (" + res.status + ").", "aviso");
            return;
        }
        const datos = await res.json();
        if (!datos.operaciones.length) {
            historial.innerHTML = "<li>Sin operaciones todavía.</li>";
            return;
        }
        for (const op of datos.operaciones) {
            const li = document.createElement("li");
            li.textContent = op.a + " " + op.operacion + " " + op.b + " = " + op.resultado;
            const fecha = document.createElement("span");
            fecha.className = "fecha";
            fecha.textContent = "  ·  " + op.creado_en;
            li.appendChild(fecha);
            historial.appendChild(li);
        }
    } catch (error) {
        mostrarMensaje("No se pudo contactar la API.", "aviso");
    }
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();
    mostrarMensaje("");
    resultado.textContent = "Calculando...";

    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const operacion = document.getElementById("operacion").value;

    try {
        const res = await fetch(API_URL + "/api/calcular", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ a: a, b: b, operacion: operacion })
        });
        const datos = await res.json();
        if (!res.ok) {
            resultado.textContent = "Resultado: —";
            mostrarMensaje(datos.detail || "Error " + res.status);
            return;
        }
        resultado.textContent = "Resultado: " + datos.resultado;
        recargarHistorial();
    } catch (error) {
        resultado.textContent = "Resultado: —";
        mostrarMensaje("No se pudo contactar la API.");
    }
});

function recargarHistorial() {
    document.getElementById("a").value = "";
    document.getElementById("b").value = "";
    document.getElementById("a").focus();
    cargar();
}

cargar();