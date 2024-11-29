// 商品區
const productWrap = document.querySelector('.productWrap');
const productSelect = document.querySelector('.productSelect');

// 購物車區
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const shoppingCartWrap = document.querySelector('.shoppingCart-wrap');
const shoppingCartEmpty = document.querySelector('.shoppingCart-empty');

// 填寫預訂資料區
const orderInfoForm = document.querySelector('.orderInfo-form');
const orderInfoBtn = document.querySelector('.orderInfo-btn');
const customerName = document.querySelector('#customerName');
const customerPhone = document.querySelector('#customerPhone');
const customerEmail = document.querySelector('#customerEmail');
const customerAddress = document.querySelector('#customerAddress');
const tradeWay = document.querySelector('#tradeWay');

// 畫面初始化
function init() {
    getOrderData();
    getCartData();
}

// 取得產品資料 渲染產品列表
function getOrderData() {
    instance.get('/products')
        .then(res => {
            let productData = res.data.products;
            renderData(productData);
            productFilter(productData);
        }).catch(err => {
            console.log(err.response.data.message)
        })
}

// 渲染產品列表
function renderData(data) {
    productWrap.innerHTML = data.map(i =>
        `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src=${i.images}
                alt="${i.title}">
            <a href="#" class="addCartBtn" data-product-id="${i.id}">加入購物車</a>
            <h3>${i.title}</h3>
            <del class="originPrice">NT$${i.origin_price}</del>
            <p class="nowPrice">NT$${i.price}</p>
        </li>`).join('')
}

// 篩選產品列表&渲染
function productFilter(data) {
    productSelect.addEventListener('change', (e) => {
        let filterData = [];
        data.forEach(i => {
            if (e.target.value === i.category) {
                filterData.push(i);
            } else if (e.target.value === '全部') {
                filterData.push(i);
            }
            renderData(filterData);
        })
    })
}

// 取得購物車資料並渲染
function getCartData() {
    instance.get('/carts')
        .then(res => {
            renderCartList(res);
        }).catch(err => {
            console.log(err.response.data.message)
        })
}

// 渲染購物車列表
// 如購物車為0筆資料：顯示購物車沒有商品畫面 & disable送出訂單按鈕
function renderCartList(res) {
    let cartData = res.data;
    let cartDataArr = res.data.carts;
    if (cartDataArr.length === 0) {
        shoppingCartEmpty.classList.remove('display-none');
        shoppingCartWrap.classList.add('display-none');
        orderInfoBtn.classList.add('disabled');
    }
    if (cartDataArr.length !== 0) {
        shoppingCartEmpty.classList.add('display-none');
        shoppingCartWrap.classList.remove('display-none');
        orderInfoBtn.classList.remove('disabled');
        cartList.innerHTML = cartDataArr.map(i =>
            `<tr data-cart-id="${i.id}">
                <td>
                    <div class="cardItem-title">
                        <img src=${i.product.images} alt="${i.product.title}">
                        <p>${i.product.title}</p>
                    </div>
                </td>
                <td>NT$${i.product.price}</td>
                <td><button class='adj-btn' value="reduce">-</button> ${i.quantity} <button class='adj-btn' value="add">+</button></td>
                <td>NT$${i.product.price * i.quantity}</td>
                <td class="discartBtn">
                    <a href="#" class="material-icons delete-cart">
                        clear
                    </a>
                </td>
            </tr>`).join('');
        cartTotal.textContent = `NT$${cartData.finalTotal}`;
    }
}

// btn加入購物車
// 取得購物車資料：如有相同商品 qty+=1，沒有相同商品 qty=1
function addToCart() {
    productWrap.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('addCartBtn')) {
            instance.get('/carts')
                .then(res => {
                    let cartDataArr = res.data.carts;
                    let productId = e.target.getAttribute('data-product-id');
                    let qty = 1;
                    cartDataArr.forEach(i => {
                        i.product.id === productId ? qty = i.quantity += 1 : false;
                    })
                    addToCartApi(productId, qty);
                })
        }
    })
}

// api加入購物車
const addToCartApi = (productId, qty) => {
    instance.post('/carts', {
        "data": {
            "productId": productId, // "產品 ID (String)"
            "quantity": qty,
        }
    }).then(res => {
        renderCartList(res);
    }).catch(err => {
        console.log(err.response.data.message)
    })
}

// 加減調整購物車商品
// click add，forEach找相同cartId的qty+1
// click reduce，forEach找相同cartId，判斷目前數量大於1，qty-1，否則直接刪除cartId
function adjustCart() {
    cartList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.value === 'add') {
            let cartId = e.target.closest('tr').getAttribute('data-cart-id');
            instance.get('/carts')
                .then(res => {
                    let cartDataArr = res.data.carts;
                    cartDataArr.forEach(i => {
                        i.id === cartId ? adjustCartApi(cartId, i.quantity + 1) : false;
                    })
                }).catch(err => {
                    console.log(err.response.data.message)
                })
        }
        if (e.target.value === 'reduce') {
            let cartId = e.target.closest('tr').getAttribute('data-cart-id');
            instance.get('/carts')
                .then(res => {
                    let cartDataArr = res.data.carts;
                    cartDataArr.forEach(i => {
                        if (i.id === cartId) {
                            i.quantity > 1 ? adjustCartApi(cartId, i.quantity - 1) : deleteCartApi(cartId);
                        }
                    })
                }).catch(err => {
                    console.log(err.response.data.message)
                })
        }
    })
}

// api 調整商品數量
function adjustCartApi(cartId, qty) {
    instance.patch('/carts', {
        "data": {
            "id": cartId, //"購物車 ID (String)"
            "quantity": qty
        }
    }).then(res => {
        renderCartList(res);
    }).catch(err => {
        console.log(err.response.data.message)
    })
}

// 刪除購物車單一商品
function deleteCart() {
    cartList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('delete-cart')) {
            let cartId = e.target.closest('tr').getAttribute('data-cart-id');
            deleteCartApi(cartId);
        }
    })
}

// api 刪除購物車單一商品
function deleteCartApi(cartId) {
    instance.delete(`/carts/${cartId}`)
        .then(res => {
            renderCartList(res);
        }).catch(err => {
            console.log(err.response.data.message)
        })
}

// 刪除購物車全部商品
function deleteAllCart() {
    shoppingCartWrap.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('discardAllBtn')) {
            deleteAlert().then(result => {
                if (result.isConfirmed) {
                    instance.delete('/carts')
                        .then(res => {
                            deleteFinished();
                            renderCartList(res);
                        }).catch(err => {
                            console.log(err.response.data.message);
                        })
                }
            })

        }
    })
}

// 訂購表單驗證
function formCheck() {
    let errorsMsg = '';
    const constraints = {
        '姓名': {
            presence: true
        },
        '電話': {
            presence: true,
        },
        'Email': {
            presence: true,
        },
        '寄送地址': {
            presence: true,
        },
    }
    const errors = validate(orderInfoForm, constraints);
    if (errors) {
        errorsMsg = Object.keys(errors);
        Swal.fire({
            title: "請確認訂購資訊",
            text: `請確認 ${errorsMsg} 是否正確填寫`,
            icon: "warning"
        });
    }
    return errorsMsg;
}

// 送出訂單
function placeOrder() {
    orderInfoBtn.addEventListener('click', e => {
        e.preventDefault();
        if (formCheck()) {
            return;
        }
        if (!formCheck()) {
            let orderInfo = {
                "data": {
                    "user": {
                        "name": customerName.value.trim(),
                        "tel": customerPhone.value.trim(),
                        "email": customerEmail.value.trim(),
                        "address": customerAddress.value.trim(),
                        "payment": tradeWay.value,
                    }
                }
            }
            confirmOrder().then(result => {
                if (result.isConfirmed) {
                    instance.post('/orders', orderInfo)
                        .then(() => {
                            getCartData();
                            placeOrderSuccess();
                            orderInfoForm.reset();
                        }).catch(() => {
                            placeOrderError();
                        })
                }
            })
        }
    })
}


// 執行
init();
addToCart();
deleteCart();
adjustCart();
deleteAllCart();
placeOrder();