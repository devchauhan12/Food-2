import React, { useContext, useEffect, useState } from 'react'
import { authentication } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { decrementItem, deleteItem, incrementItem } from '../redux/Action'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../redux/firebase'

const Cart = () => {
  const cart = useSelector((state) => state.cart)
  const { logedUser, setLogedUser } = useContext(authentication)
  const [UserCart, setUserCart] = useState()

  const fetchUserCart = async () => {
    const userCartData = (await getDoc(doc(db, `UserCart/${logedUser.uid}`))).data();
    setUserCart(userCartData);
  };
  useEffect(() => {
    fetchUserCart();
  });

  const dispatch = useDispatch();
  let tq = 0;
  let tp = 0;
  cart.map(item => {
    tq += item.qty;
    tp += item.qty * item.price;
  });
  const decreaseQuantity = async (id) => {
    UserCart.cart[id].qty--
    if (UserCart.cart[id].qty === 0) { UserCart.cart.splice([id], 1) }
    dispatch(decrementItem(id));
    await setDoc(doc(db, "UserCart", logedUser.uid), UserCart);
  }
  const increaseQuantity = async (id) => {
    UserCart.cart[id].qty++
    dispatch(incrementItem(id));
    await setDoc(doc(db, "UserCart", logedUser.uid), UserCart);
  }
  const deleteAll = async () => {
    UserCart.cart = []
    dispatch(deleteItem());
    await setDoc(doc(db, "UserCart", logedUser.uid), UserCart);
  }
  return (
    <div>
      <table className="table mt-4 table-striped m-auto text-center">
        <thead>
          <tr>
            <th>Item</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td>
                <img src={item.image} width="50px" height="50px" alt="Item" />
              </td>
              <td>{item.title}</td>
              <td>₹ {item.price}</td>
              <td>
                <button
                  onClick={() => decreaseQuantity(index)}
                  className="border-0 bg-dark text-white"
                >
                  -
                </button>
                <input type="number" className="text-center w-25" name="quantity" value={item.qty} disabled />
                <button onClick={() => increaseQuantity(index)} className="border-0 bg-dark text-white">
                  +
                </button>
              </td>
              <td>₹ {item.qty * item.price}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>TOTAL</th>
            <th></th>
            <th></th>
            <th>{tq}</th>
            <th>₹ {tp}</th>
            <th>
              <button type="submit" onClick={deleteAll} className="border-0">
                Clear All
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default Cart