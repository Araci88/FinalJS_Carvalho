// CARRITO DE COMPRAS "REMES"

const producto = "./json/listaProductos.json";
let carritoDeCompras = [];

if(localStorage.getItem("carrito")){
    carritoDeCompras = JSON.parse(localStorage.getItem("carrito"));
}

const divCards = document.getElementById("divCards");

const cardsProductos = async () => {
    const respuesta = await fetch(producto);
    const productosJson = await respuesta.json();
    productosJson.forEach((productos) => {
        const card = document.createElement("div");
        card.classList.add("col-md-6", "col-sm-12");
        card.innerHTML = `
        <div class="card text-center card_productos">
            <img src="${productos.imgProducto}" class="card-img-top imgProductos" alt="${productos.nombreProducto}">
            <div class="card-body">
                <h5 class="card-title"> ${productos.nombreProducto} </h5>
                <p class="card-text"> ${productos.precioProducto} +iva</p>
                <button class="btn btn-primary text-center" id= "boton${productos.idProducto}"> Comprar </button>
            </div>
        </div>
        `
        divCards.appendChild(card);

        const boton = document.getElementById(`boton${productos.idProducto}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(productos.idProducto);
            Toastify({
                text: "Agregado al carrito",
                duration: 4000,
                gravity: "bottom",
                position: "right",
                style:{
                    background: "#0dcaf0"
                }
            }).showToast();
        })
    });  
}

const agregarAlCarrito = async (idProducto) => {
    const respuesta = await fetch(producto);
    const productosJson = await respuesta.json();
    const productos = productosJson.find((productos) => productos.idProducto === idProducto);
    const productoEnCarrito = carritoDeCompras.find((productos) => productos.idProducto === idProducto);
    if(productoEnCarrito){
        productoEnCarrito.cantidadProducto++;
    }else{
        carritoDeCompras.push(productos);
        localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
    }
    calcularTotalCompra();
    calcularDescuentoCompra();
    calcularCuotasCompra();
}

cardsProductos();

const contenedor_carrito = document.getElementById("contenedor_carrito");

const ver_carrito = document.getElementById("ver_carrito");

ver_carrito.addEventListener("click", () => {
    mostrarCarrito();
});

const mostrarCarrito = () => {
    contenedor_carrito.innerHTML="";
    carritoDeCompras.forEach((productos) => {
        const card = document.createElement("div");
        card.classList.add("col-sm-12");
        card.innerHTML = `
        <div class="card text-center card_carrito">
            <img src="${productos.imgProducto}" class="card-img-top text-center imgProductos" alt="${productos.nombreProducto}">
            <div class="card-body body_carrito">
                <h5 class="card-title tit_carrito"> ${productos.nombreProducto} </h5>
                <p class="card-text txt_carrito"> ${productos.precioProducto} </p>
                <p class="card-text txt_carrito"> ${productos.cantidadProducto} </p>
                <button class="btn btn-danger text-center" id= "eliminar${productos.idProducto}"> Eliminar </button>
            </div>
        </div>
        `
        contenedor_carrito.appendChild(card);

        const boton = document.getElementById(`eliminar${productos.idProducto}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(productos.idProducto);
        })
    })
    calcularTotalCompra();
    calcularDescuentoCompra();
    calcularCuotasCompra();
}

const eliminarDelCarrito = (idProducto) => {
    const productos = carritoDeCompras.find((productos) => productos.idProducto === idProducto);
    const productoEnCarrito = carritoDeCompras.find((productos) => productos.idProducto === idProducto);
    if(productos.cantidadProducto === 1){
        const indice = carritoDeCompras.indexOf(productos);
        carritoDeCompras.splice(indice, 1);
    }else{
        productoEnCarrito.cantidadProducto--;
    }
    mostrarCarrito();
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
}

const vaciar_carrito = document.getElementById("vaciar_carrito");

vaciar_carrito.addEventListener("click", () => {
    Swal.fire({
        title: "¿Estás seguro de vaciar el carrito?",
        icon: "question",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#0d6efd",
        confirmButtonColor: "#0d6efd",
    }).then((result) => {
        if (result.isConfirmed){
            vaciarTodoElCarrito();
            Swal.fire({
                title: "Productos Eliminados",
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#0d6efd",
            })
        }
    })
})

const vaciarTodoElCarrito = () => {
    carritoDeCompras = [];
    mostrarCarrito();
    localStorage.clear();
}

const total_compra = document.getElementById("total_compra");
const descuento_compra = document.getElementById("descuento_compra");
const cuotas_compra = document.getElementById("cuotas_compra");

/*
for (const productos of producto){
    productos.sumaIva();
}*/

const calcularTotalCompra = () => {
    let totalDeCompra = 0;
    carritoDeCompras.forEach((productos) => {
        totalDeCompra = totalDeCompra + productos.precioProducto * productos.cantidadProducto;
    })
    total_compra.innerHTML = `$${totalDeCompra}`;
}

const calcularDescuentoCompra = () => {
    let descuentoCompra = 0;
    carritoDeCompras.forEach((productos) => {
        descuentoCompra = descuentoCompra + productos.precioProducto * productos.cantidadProducto - productos.precioProducto * productos.cantidadProducto * 15 / 100;
    })
    descuento_compra.innerHTML = `$${descuentoCompra.toFixed(2)}`;
}

const calcularCuotasCompra = () => {
    let cuotasCompra = 0;
    carritoDeCompras.forEach((productos) => {
        cuotasCompra = cuotasCompra + (productos.precioProducto * productos.cantidadProducto - productos.precioProducto * productos.cantidadProducto * 15 / 100) / 3;
    })
    cuotas_compra.innerHTML = `$${cuotasCompra.toFixed(2)}`;
}

const comprar = document.getElementById("comprar");
comprar.addEventListener("click", () => {
    Swal.fire({
        title: "Desea ir a pagar?",
        icon: "question",
        backdrop: "#fff",
        confirmButtonText: "Aceptar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#0d6efd",
        confirmButtonColor: "#0d6efd",
    }).then((result) => {
        if (result.isConfirmed){
            Swal.fire({
                title: "Muchas gracias por su compra!!",
                icon: "success",
                backdrop: "#fff",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#0d6efd",
            })
        }else{
            Swal.fire({
                title: "Que pena! Esperamos verte pronto!",
                icon: "warning",
            })
        }
    })
    vaciarTodoElCarrito();
})

class Cliente{
    constructor(nombreCliente, apellidoCliente, mailCliente){
        this.nombreCliente = nombreCliente;
        this.apellidoCliente = apellidoCliente;
        this.mailCliente = mailCliente;
    }
}

const arrayClientes = [];

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombreCliente = document.getElementById("nombreCliente").value;
    const apellidoCliente = document.getElementById("apellidoCliente").value;
    const mailCliente = document.getElementById("mailCliente").value;

    const cliente = new Cliente(nombreCliente, apellidoCliente, mailCliente);
    arrayClientes.push(cliente);

    localStorage.setItem("cliente", JSON.stringify(cliente));

    formulario.reset();
})