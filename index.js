import { menuArray } from "/data"

const menuList = document.getElementById("feed")
const orderContainer = document.querySelector(".order-container")
const modalContainer = document.querySelector(".modal-container")
const modalForm = document.querySelector(".modal-form")
const orderSuccessMsg = document.querySelector(".order-success-msg")

let orderArray = []

document.addEventListener("click", function(e){
    if (e.target.dataset.add) {
        handleItemOrder(parseInt(e.target.dataset.add))
    } else if (e.target.dataset.remove) {
        removeOrderItem(parseInt(e.target.dataset.remove))
    } else if (e.target.id === "order-button") {
        document.addEventListener('click', closeModalOutside)
        modalContainer.classList.remove("modal-hidden")
    }
})

document.addEventListener("submit", function(e){
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    handlePayment(name)
})

function handleItemOrder(itemId) {
    const orderedItem = menuArray.filter(item => item.id === itemId)[0]
    orderedItem.orderCount += 1 
    if (!orderedItem.isOrdered) {
        orderedItem.isOrdered = true 
        orderArray.push(orderedItem)
    }
    renderOrder(orderedItem, orderArray)
}

function removeOrderItem(itemId) {
    const removedItem = orderArray.filter(item => item.id === itemId)[0]
    removedItem.orderCount -= 1 
    if (!removedItem.orderCount) {
        removedItem.isOrdered = false
        orderArray = orderArray.filter(item => item.isOrdered === true)
    }
    renderOrder(removedItem, orderArray)
}

function handlePayment(name) {
    orderSuccessMsg.classList.remove("msg-hidden")
    modalContainer.classList.add("modal-hidden")
    orderContainer.classList.add("order-hidden")
    menuArray.forEach(item => {
        item.isOrdered = false,
        item.orderCount = 0
    })
    orderSuccessMsg.innerHTML = `<h2>
                                    Thanks, ${name}! Your order is on its way!
                                </h2>`
    setTimeout(function() { orderSuccessMsg.classList.add("msg-hidden") }, 2000)
    modalForm.reset()
    orderArray = []
}

function closeModalOutside(event) {
      if (!modalForm.contains(event.target)) {
        modalContainer.classList.add("modal-hidden")
        document.removeEventListener('click', closeModalOutside)
      }
    }

function renderMenu() {
    const feed = menuArray.map( item => {
        const { 
                name,
                ingredients,
                id,
                price,
                emoji } = item
        return `
                <section class="item-container">
                    <div class="item-info">
                        <p class="menu-item-emoji">${emoji}</p>
                        <div class="item-text">
                            <h2 class="item-title">${name}</h2>
                            <p class="ingredients">${ingredients.join(', ')}</p>
                            <h3 class="price">$ ${price}</h3>
                        </div>
                    </div>
                    <button class="add-item-button" data-add="${id}">+</button>
                </section>
                `
    }).join("")
    menuList.innerHTML = feed
}

function renderOrder(orderedItem, orderArray) {
    orderContainer.classList.remove("order-hidden")
    if (orderArray.length > 0) {
            const orderItems = orderArray.map(item =>
            `
                <div class="order-item-info">
                    <div style="display:flex">
                        <h2 class="order-item-title">${item.name}</h2>
                        <p class="remove-item" data-remove="${item.id}">remove</p>
                    </div>
                    <h3 class="order-item-cost">
                        ${item.orderCount}x $ ${item.price}
                    </h3>
                </div>
            ` 
        ).join(" ")     
        document.querySelector(".order-items").innerHTML = orderItems   
    } else {
        orderContainer.classList.add("order-hidden")
    }
    document.querySelector(".order-total-cost").innerHTML = `$ ${getTotal(orderArray)}`
}

function getTotal(orderArray) {
    let totalCost = 0
    orderArray.forEach(item => totalCost += item.price * item.orderCount)
    return totalCost
}

renderMenu()