let products = []; 

async function updateProduct() {
  if (valid() && validImg()) {
    await sendData();
    await removeProduct(editProductId, editCloudinaryPublicId);
    fetchProductsFromDatabase(); 
    Modaleclose();
  }
}
function clearForm() {
  document.getElementById("js-input-model").value = '';
  document.getElementById("js-proc").value = '';
  document.getElementById("js-disk").value = '1';
  document.getElementById("js-op").value = '';
  document.getElementById("js-lan").value = '';
  document.getElementById('productImage').value = '';
  document.getElementById("productId").value = '';
  document.getElementById('oldImagePath').value = '';
  document.getElementById("oldCloudinaryPublicId").value = '';
}
function getAndShowAllProducts() {
  clearForm();
  let sortedProducts = [...products]; 
  const sortCheckbox = document.getElementById("sortcheckbox");
  if (sortCheckbox.checked) {
    sortedProducts.sort((a, b) => a.productDiagonal - b.productDiagonal);
  }
  const dataContainer = document.querySelector(".dataContainer");
  dataContainer.innerHTML = "";
  sortedProducts.forEach((product) => {
    let productCard = document.createElement("div");
    productCard.classList.add("element");
    productCard.innerHTML = `
      <div class="element-data">
        <img src="${product.productImage}" class="element-img">
        <div class="element-name">${product.productName}</div>
        <p class="element-text">Діагональ: <span class="element-volume">${product.productDiagonal}</span></p> 
        <p class="element-text">Розмір матриці: <span class="element-material">${product.productMatrix}</span></p>
        <p class="element-text">Формат зображення: <span class="element-material">${product.productFormat}</span></p> 
        <p class="element-text">Інтерфейс: <span class="element-material">${product.productInterf}</span></p>  
      </div>
      <div class="element-footer">
        <button class="edit-button" onclick="modifyModalToEdit('${product._id}', '${product.productName}', '${product.productDiagonal}', '${product.productFormat}', '${product.productMatrix}', '${product.productInterf}', '${product.productImage}', '${product.cloudinaryPublicId}')">Edit</button><span> </span>
        <button class="delete-button" onclick="removeProduct('${product._id}', '${product.cloudinaryPublicId}')">Delete</button>
      </div>
    `;
    dataContainer.appendChild(productCard);
  });
}
async function fetchProductsFromDatabase() {
  const response = await fetch("/products");
  const data = await response.json();
  products = data;
  getAndShowAllProducts();
}
function handleSortCheckboxChange() {
  getAndShowAllProducts(); // 
}
const sortCheckbox = document.getElementById("sortcheckbox");
sortCheckbox.addEventListener("change", handleSortCheckboxChange);
fetchProductsFromDatabase();
function collectFormData() {
  const productForm = document.forms["productForm"];
  let formData = new FormData(productForm);
  productForm.reset();
  return formData;
}
async function sendData() {
  await fetch('/products', {
    method: 'POST',
    body: collectFormData()
  });
}
async function modalpush() {
  if (valid() && validImg()) {
    await sendData();
    fetchProductsFromDatabase();
    Modaleclose();
  }
}
async function removeProduct(_id, cloudinaryPublicId) {
  const deleteParams = {
    _id: _id,
    cloudinaryPublicId: cloudinaryPublicId,
  };
  await fetch(`/products/${_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deleteParams),
  });
  fetchProductsFromDatabase();
}
let editProductId = "";
let editProductName = "";

let editproducttechno = "";
let editproductformat = "";
let editproductspeed = "";
let editproductresurs = "";

let editproductInterf = "";
let editproductFormat = "";
let editproductMatrix = "";
let editproductDiagonal = "";

let editProductImage = "";
let editCloudinaryPublicId = "";
function modifyModalToEdit(_id, productName, productDiagonal, productFormat, productMatrix, productInterf, productImage, cloudinaryPublicId) {
  editProductId = _id;
  editProductName = productName;
  editproducttechno = productDiagonal;
  editproductformat = productFormat;
  editproductspeed = productMatrix;
  editproductresurs = productInterf;
  editProductImage = productImage;
  editCloudinaryPublicId = cloudinaryPublicId;
  document.getElementById("modalcont").style.display = "block";
  document.getElementById("greybg").style.display = "block";
  document.getElementsByClassName("text-h")[0].innerText = "Змінити принтер";
  document.getElementById("submitBtn").innerText = "Update";
  document.getElementById('productImage').setAttribute("src", productImage);
  document.getElementById("js-input-model").value = productName;
  document.getElementById("js-proc").value = productDiagonal;
  document.getElementById("js-op").value = productMatrix;
  document.getElementById("js-lan").value = productFormat;
  document.getElementById("js-disk").value = productInterf;
  document.getElementById("productId").value = _id;
  document.getElementById('oldImagePath').value = productImage;
  document.getElementById("oldCloudinaryPublicId").value = cloudinaryPublicId;
  const submitButton = document.getElementById("submitBtn");
  submitButton.removeEventListener("click", modalpush);
  submitButton.addEventListener("click", updateProduct);
}
async function updateProduct() {
  const updatedProduct = {
    _id: editProductId,
    productName: editProductName,
    productInterf: editproductInterf,
    productFormat: editproductFormat,
    productMatrix: editproductMatrix,
    productDiagonal: editproductDiagonal,
    productImage: editProductImage,
    cloudinaryPublicId: editCloudinaryPublicId,
  };
  await fetch(`/products/${editProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  });
  fetchProductsFromDatabase();
}
getAndShowAllProducts();
const searchButton = document.querySelector(".green-button");
searchButton.addEventListener("click", handleSearch);
function handleSearch() {
  const searchField = document.querySelector(".searchfield");
  const searchTerm = searchField.value.trim().toLowerCase();
  if (searchTerm === "") {
    getAndShowAllProducts();
    return;
  }
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm)
  );
  if (filteredProducts.length > 0) {
    const dataContainer = document.querySelector(".dataContainer");
    dataContainer.innerHTML = "";
    filteredProducts.forEach((product) => {
      let productCard = document.createElement("div");
      productCard.classList.add("element");
      productCard.innerHTML = `
      <div class="element-data">
      <img src="${product.productImage}" class="element-img">
      <div class="element-name">${product.productName}</div>
      <p class="element-text">Діагональ: <span class="element-volume">${product.productDiagonal}</span></p> 
      <p class="element-text">Розмір матриці: <span class="element-material">${product.productMatrix}</span></p>
      <p class="element-text">Формат зображення: <span class="element-material">${product.productFormat}</span></p> 
      <p class="element-text">Інтерфейс: <span class="element-material">${product.productInterf}</span></p>  
    </div>
    <div class="element-footer">
      <button class="edit-button" onclick="modifyModalToEdit('${product._id}', '${product.productName}', '${product.productDiagonal}', '${product.productFormat}', '${product.productMatrix}', '${product.productInterf}', '${product.productImage}', '${product.cloudinaryPublicId}')">Edit</button><span> </span>
      <button class="delete-button" onclick="removeProduct('${product._id}', '${product.cloudinaryPublicId}')">Delete</button>
    </div>
  `;
      dataContainer.appendChild(productCard);
    });
  } else {
    const dataContainer = document.querySelector(".dataContainer");
    dataContainer.innerHTML = "<p>No products found.</p>";
  }
}
