var fila="<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td></tr>";
var productos=null;

function codigoCat(catstr) {
    var code="null";
    switch(catstr) {
        case "electronics":code="c1";break;
        case "jewelery":code="c2";break;
        case "men's clothing":code="c3";break;
        case "women's clothing":code="c4";break;
    }
    return code;
}

var orden=0;

function listarProductos(productos) {
    var precio=document.getElementById("price"); 
    precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
    var num=productos.length;
    var listado=document.getElementById("listado");
    var ids,titles,prices,descriptions,categories,fotos;
    var tbody=document.getElementById("tbody"),nfila=0;
    tbody.innerHTML="";
    var catcode;
    for(i=0;i<num;i++) tbody.innerHTML+=fila;
    var tr; 
    ids=document.getElementsByClassName("id");
    titles=document.getElementsByClassName("title");
    descriptions=document.getElementsByClassName("description");
    categories=document.getElementsByClassName("category");   
    fotos=document.getElementsByClassName("foto");   
    prices=document.getElementsByClassName("price");   
    if(orden===0) {orden=-1;precio.innerHTML="Precio"}
    else if(orden==1) {ordenarAsc(productos,"price");precio.innerHTML="Precio A";precio.style.color="darkgreen"}
    else if(orden==-1) {ordenarDesc(productos,"price");precio.innerHTML="Precio D";precio.style.color="blue"}

    listado.style.display="block";
    for(nfila=0;nfila<num;nfila++) {
        ids[nfila].innerHTML=productos[nfila].id;
        titles[nfila].innerHTML=productos[nfila].title;
        descriptions[nfila].innerHTML=productos[nfila].description;
        categories[nfila].innerHTML=productos[nfila].category;
        catcode=codigoCat(productos[nfila].category);
        tr=categories[nfila].parentElement;
        tr.setAttribute("class",catcode);
        prices[nfila].innerHTML="$"+productos[nfila].price;
        fotos[nfila].innerHTML="<img src='"+productos[nfila].image+"'>";
        fotos[nfila].firstChild.setAttribute("onclick","window.open('"+productos[nfila].image+"');" );

        // Crear botón de eliminar con referencia al id actual
        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2";
		eliminarBtn.onclick = (function(id) {
			return function(event) {
				event.preventDefault(); // Previene la recarga de la página
				eliminarProducto(id);
			};
		})(productos[nfila].id);

		
        ids[nfila].parentElement.appendChild(eliminarBtn);
    }
}

function obtenerProductos() {
    fetch('https://api-generator.retool.com/Rpe89b/productos')
        .then(res => res.json())
        .then(data => { productos = data; listarProductos(data); })
}

async function agregarProducto() {
    const title = document.getElementById("title").value;
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    const nuevoProducto = { title, price, description, category, image };

    try {
        const response = await fetch('https://api-generator.retool.com/Rpe89b/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (response.ok) {
            obtenerProductos(); // Recarga el listado después de agregar el producto
        } else {
            console.error("Error al agregar producto");
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
}

async function eliminarProducto(id) {
    try {
        console.log("Intentando eliminar producto con id:", id);  // Verifica el ID

        const response = await fetch(`https://api-generator.retool.com/Rpe89b/productos/${id}`, {
            method: 'DELETE'
        });

        // Imprimir el estado completo de la respuesta para depurar
        console.log("Estado de la respuesta:", response.status, response.statusText);
        
        if (response.ok) {
            console.log("Producto eliminado:", id);
            obtenerProductos(); // Recarga el listado después de eliminar el producto
        } else {
            console.error("Error al eliminar producto - Status Code:", response.status); // Muestra el código de error
        }
    } catch (error) {
        //console.error("Error de red:", error);
    }
}



function ordenarDesc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if(a[p_key] > b[p_key]) return -1;
        if(a[p_key] < b[p_key]) return 1;
        return 0;
    });
}

function ordenarAsc(p_array_json, p_key) {
    p_array_json.sort(function (a, b) {
        if(a[p_key] > b[p_key]) return 1;
        if(a[p_key] < b[p_key]) return -1;
        return 0;
    });
}