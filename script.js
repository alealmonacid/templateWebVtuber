document.addEventListener('DOMContentLoaded', () => {
    // Navegación
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        // Ocultar todas las páginas
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Desactivar todos los botones
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Mostrar la página seleccionada
        const selectedPage = document.getElementById(pageId);
        const selectedButton = document.querySelector(`[data-page="${pageId}"]`);
        
        if (selectedPage && selectedButton) {
            selectedPage.classList.add('active');
            selectedButton.classList.add('active');
        }
    }

    // Agregar event listeners a los botones
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            showPage(pageId);
        });
    });
});

// ====================

const productos = [
    { id: 1, nombre: "Producto 1", descripcion: "Descripción corta 1", precio: 1000, imagen: "img1.jpg" },
    { id: 2, nombre: "Producto 2", descripcion: "Descripción corta 2", precio: 2000, imagen: "img2.jpg" },
    { id: 3, nombre: "Producto 3", descripcion: "Descripción corta 3", precio: 3000, imagen: "img3.jpg" }
];

function renderProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: $${producto.precio}</p>
            <input type="number" id="cantidad-${producto.id}" min="1" value="1" />
            <button onclick="agregarAlCarro(${producto.id})">Agregar al carro</button>
        `;
        contenedor.appendChild(div);
    });
}

function agregarAlCarro(id) {
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const producto = productos.find(p => p.id === id);
    
    const index = carrito.findIndex(p => p.id === id);
    if (index !== -1) {
        carrito[index].cantidad += cantidad;
    } else {
        carrito.push({ ...producto, cantidad });
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    actualizarBotonCarrito();
}

function actualizarCarrito() {
    const modalContenido = document.getElementById("carrito-contenido");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    modalContenido.innerHTML = "";
    if (carrito.length === 0) {
        modalContenido.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }
    carrito.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${p.nombre} (x${p.cantidad}) - $${p.precio * p.cantidad}</p>
            <button onclick="eliminarDelCarrito(${p.id})">❌</button>
        `;
        modalContenido.appendChild(div);
    });
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(p => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
    actualizarBotonCarrito();
}

function actualizarBotonCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const totalUnidades = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    document.getElementById("carrito-boton").innerHTML = `🛒 (${totalUnidades})`;
}

function mostrarCarrito() {
    document.getElementById("modal-carrito").style.right = "0";
    actualizarCarrito();
}

function cerrarCarrito() {
    document.getElementById("modal-carrito").style.right = "-300px";
}

function borrarCarrito() {
    localStorage.removeItem("carrito");
    actualizarCarrito();
    actualizarBotonCarrito();
}

function solicitarProductos() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) return;
    let mensaje = "Hola, estoy interesado en los siguientes productos:%0A";
    carrito.forEach(p => {
        mensaje += `- ${p.nombre} (x${p.cantidad})%0A`;
    });
    const url = `https://wa.me/XXXXXXXXXXX?text=${mensaje}`;
    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    renderProductos();
    actualizarBotonCarrito();
});
