// 訂單列表區
const orderList = document.querySelector('.order-list');
const orderPageEmpty = document.querySelector('.orderPageEmpty');
const discardAllBtn = document.querySelector('.discardAllBtn');


// 取得訂單資訊 並 渲染訂單列表 及 c3圖表
function getOrderData() {
    adminInstance.get('/orders')
        .then(res => {
            renderOrderList(res);
            renderChart(res);
        }).catch(err => {
            console.log(err.response.data.message)
        })
}

// 渲染 訂單列表
// 如訂單資料為0筆：訂單列表顯示為空畫面 並 disable 清除全部btn
function renderOrderList(res) {
    let orderDataArr = res.data.orders;
    if (orderDataArr.length === 0) {
        orderPageEmpty.classList.remove('display-none');
        orderList.classList.add('display-none');
        discardAllBtn.classList.add('disabled');
    }
    if (orderDataArr.length !== 0) {
        orderList.innerHTML = orderDataArr.map(i =>
            ` <tr data-cart-id=${i.id}>
                <td>${i.id}</td>
                <td>
                    <p>${i.user.name}</p>
                    <p>${i.user.tel}</p>
                </td>
                <td>${i.user.address}</td>
                <td>${i.user.email}</td>
                <td>
                    <ul>
                    ${i.products.map(item => `<li>${item.title} X ${item.quantity}</li>`).join('')}
                    </ul>
                </td>
                <td>${new Date(i.createdAt * 1000).toLocaleString('zh-TW', { hour12: false })}</td>
                <td class="orderStatus">
                    <a href="#">${i.paid ? '<span class="order-status text-green">已處理</span>' : '<span class="order-status text-red">未處理<span>'}</a>
                </td>
                <td>
                    <input type="button" class="delSingleOrder-Btn" value="刪除">
                </td>
        </tr>`).join('')
    }
}

// 修改 訂單狀態
function updateOrderStatus() {
    orderList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('order-status')) {
            adminInstance.put('/orders', {
                "data": {
                    "id": e.target.closest('tr').getAttribute('data-cart-id'),
                    "paid": e.target.textContent === '未處理' ? true : false,
                }
            }).then(res => {
                renderOrderList(res);
            }).catch(err => {
                console.log(err.response.data.message)
            })
        }
    })
}

// 刪除個別訂單
function deleteCart() {
    orderList.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('delSingleOrder-Btn')) {
            let cartId = e.target.closest('tr').getAttribute('data-cart-id');
            adminInstance.delete(`/orders/${cartId}`)
                .then(res => {
                    renderOrderList(res);
                    renderChart(res);
                }).catch(err => {
                    console.log(err.response.data.message)
                })
        }
    })
}

// 刪除全部訂單
function deleteAllCart() {
    discardAllBtn.addEventListener('click', e => {
        e.preventDefault();
        deleteAlert().then((result) => {
            if (result.isConfirmed) {
                adminInstance.delete('/orders')
                    .then(res => {
                        deleteFinished();
                        renderOrderList(res);
                        renderChart(res);
                    }).catch(err => {
                        console.log(err.response.data.message)
                    })
            }
        })
    })
}

// 渲染 c3產品類別營收圖表
function renderChart(res) {
    let orderDataArr = res.data.orders;
    let productCategory = {};
    orderDataArr.forEach(cart => {
        cart.products.forEach(i => {
            productCategory[i.category] ? productCategory[i.category] += i.price * i.quantity : productCategory[i.category] = i.price * i.quantity;
        })
    })
    let productCategoryC3 = Object.entries(productCategory);
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: productCategoryC3,
            colors: {
                "床架": "#DACBFF",
                "收納": "#9D7FEA",
                "窗簾": "#5434A7",
            }
        },
    });
}



// 執行
getOrderData();
updateOrderStatus();
deleteCart();
deleteAllCart();