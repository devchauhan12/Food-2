const initial = {
    products: [],
    cart: []
}

const Reducer = (state = initial, action) => {
    let tempCart = [...state.cart]
    switch (action.type) {
        case 'addItem':
            if (state.cart.length === 0) {
                const newItem = { ...state.products[action.payload], qty: 1 }
                return { ...state, cart: [newItem] };
            }
            else {
                const tempCart = [...state.cart]
                const checkCart = tempCart.some((e) => {
                    if (e.title === state.products[action.payload].title) {
                        e.qty++;
                        return true
                    }
                })

                if (!checkCart) {
                    const newItem = { ...state.products[action.payload], qty: 1 };
                    return { ...state, cart: [...state.cart, newItem] };
                } else {
                    return { ...state, cart: tempCart };
                }
            }

        case 'increment':
            tempCart[action.payload].qty++;
            return { ...state, cart: tempCart };
        case 'decrement':
            tempCart[action.payload].qty--;
            if (tempCart[action.payload].qty === 0) { tempCart.splice([action.payload], 1) }
            return { ...state, cart: tempCart };
        case 'delete':
            tempCart = [];
            return { ...state, cart: tempCart };
        case 'getCart':
            return { ...state, cart: action.payload };
        case 'setProducts':
            return { ...state, products: action.payload };
        default:
            return state
    }
}

export default Reducer