// 刪除全部alert
function deleteAlert(){
    return Swal.fire({
        title: "刪除全部?",
        text: "請確認是否刪除全部",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確認"
    })
}

// 刪除全部完成msg
function deleteFinished(){
    return Swal.fire({
        title: "刪除成功!",
        icon: "success"
    });
}

// 確認送出訂單alert
function confirmOrder(){
    return Swal.fire({
        title: "確認送出訂單?",
        icon: "question",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確認"
    })
}

// 送出訂單成功msg
function placeOrderSuccess(){
    return Swal.fire({
        title: "送出訂單成功",
        text: "謝謝您的訂購",
        icon: "success"
      });
}

// 送出訂單失敗msg
function placeOrderError(){
    return Swal.fire({
        title: "送出訂單失敗",
        text: "請稍後再試或聯繫客服",
        icon: "error"
      });
}
