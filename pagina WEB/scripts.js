
// Número de teléfono de WhatsApp (sin el símbolo + y sin espacios)
const numeroWhatsApp = '573146246898'; // Reemplaza con tu número de WhatsApp

// Array para almacenar productos en el carrito
let carrito = [];

// Crear un objeto para mantener el estado de cada galería
const galleries = {
    1: {
        currentIndex: 0,
        images: document.querySelectorAll('#gallery1 .gallery-image')
    },
    2: {
        currentIndex: 0,
        images: document.querySelectorAll('#gallery2 .gallery-image')
    },
    3: {
        currentIndex: 0,
        images: document.querySelectorAll('#gallery3 .gallery-image')
    }
    ,
    4: {
        currentIndex: 0,
        images: document.querySelectorAll('#gallery4 .gallery-image')
    }
};

function showImage(galleryId, index) {
    const gallery = galleries[galleryId];
    gallery.images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

function nextImage(galleryId) {
    const gallery = galleries[galleryId];
    gallery.currentIndex = (gallery.currentIndex + 1) % gallery.images.length;
    showImage(galleryId, gallery.currentIndex);
}

function prevImage(galleryId) {
    const gallery = galleries[galleryId];
    gallery.currentIndex = (gallery.currentIndex - 1 + gallery.images.length) % gallery.images.length;
    showImage(galleryId, gallery.currentIndex);
}

// Mostrar la primera imagen en cada galería al cargar
Object.keys(galleries).forEach(galleryId => {
    showImage(galleryId, galleries[galleryId].currentIndex);
});



/// Función para agregar productos al carrito
function agregarAlCarrito(nombre, precio, formId,galleryId) {
    // Obtener el valor seleccionado del formulario correspondiente
    var selectElement = document.querySelector(`#${formId} select`);
    var seleccion = selectElement.value;
    
    if (seleccion === '') {
        alert('Debes seleccionar una talla');
        return; // Salir si no se ha seleccionado ninguna talla
    }
    
    // Verificar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.nombre === nombre && item.seleccion === seleccion);
    
    if (productoExistente) {
        // Si el producto ya existe, solo actualizamos la cantidad
        productoExistente.cantidad += 1;
        productoExistente.precio = precio; // Actualizar el precio si cambia
    } else {
        // Si el producto no está en el carrito, lo añadimos
        const gallery = document.getElementById(galleryId);
        const imgSrc = gallery.querySelector('.gallery-image').src;
        carrito.push({ nombre, precio, cantidad: 1, seleccion, imgSrc});
    }

    // Limpiar la selección del formulario
    selectElement.selectedIndex = 0;

    // Actualizar el carrito
    actualizarCarrito();
}

// Función para actualizar el carrito en la interfaz
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalElem = document.getElementById('total');
    listaCarrito.innerHTML = '';
    
    let total = 0;
    
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item';
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad} - Talla: ${item.seleccion}`;

        const removeButton = document.createElement('button');
        removeButton.id = 'Eliminar';
        removeButton.textContent = 'Eliminar';
        removeButton.onclick = () => eliminarDelCarrito(index);

        li.appendChild(removeButton);
        listaCarrito.appendChild(li);

        total += item.precio * item.cantidad;
    });
    
    totalElem.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1); // Elimina el producto del array
    actualizarCarrito(); // Actualiza el carrito en la interfaz
}



// Función para manejar el envío del formulario de contacto
document.getElementById('form-contacto').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    this.reset(); // Limpia el formulario después del envío
});

// Seleccionar todos los botones de añadir al carrito
const botonesAgregar = document.querySelectorAll('button[onclick^="agregarAlCarrito"]');

// Función para añadir el efecto de expansión al hacer clic
botonesAgregar.forEach(boton => {
    boton.addEventListener('mousedown', () => {
        boton.classList.add('expandido');
    });

    boton.addEventListener('mouseup', () => {
        boton.classList.remove('expandido');
    });

    boton.addEventListener('mouseleave', () => {
        boton.classList.remove('expandido');
    });    
});
//
// Función para generar el mensaje de WhatsApp
function generarMensajeWhatsApp() {
    const checkboxes = document.querySelectorAll('.gallery')
    let mensaje = 'Hola, me gustaría comprar los siguientes productos:\n\n';
    //let images = '';

    carrito.forEach(item => {
        //const parentDiv = checkbox.closest('.gallery-item');
        //const imgSrc = parentDiv.getAttribute('data-img');
        mensaje += `${item.nombre} - $${item.precio.toFixed(2)} x ${item.cantidad} - Talla: ${item.seleccion}\n`;        
        mensaje += `Imagen: ${item.imgSrc}\n`; // Añadir URL de la imagen

    });

    mensaje += `\nTotal: $${carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2)}`;

    // Codificar el mensaje para incluirlo en una URL
    return encodeURIComponent(mensaje);
}

// Función para enviar el carrito por WhatsApp
function enviarPorWhatsApp() {
    if (carrito.length === 0) {
        alert('Debes elegir al menos un producto para enviar el carrito.');
        return; // Salir de la función si el carrito está vacío
    }

    const mensaje = generarMensajeWhatsApp();
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
}

// Agregar el botón para enviar el carrito por WhatsApp
document.addEventListener('DOMContentLoaded', () => {
    const carritoSection = document.getElementById('carrito');
    const botonWhatsApp = document.createElement('button');
    botonWhatsApp.textContent = 'Enviar carrito por WhatsApp';
    botonWhatsApp.addEventListener('click', enviarPorWhatsApp);
    carritoSection.appendChild(botonWhatsApp);
});
