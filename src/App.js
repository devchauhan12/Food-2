import './App.css';
import './assets/login.css'
import 'rsuite/dist/rsuite.min.css';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Cart from './components/Cart';
import Products from './components/Products';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { db } from './redux/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { getCart, setProducts } from './redux/Action';
import { Loader } from 'rsuite';

export const authentication = createContext()

function App() {
  const [users, setUsers] = useState([])
  const [login, setLogin] = useState(false)
  const [logedUser, setLogedUser] = useState(null)
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch()
  useEffect(() => {
    getData()
    getProducts()
  }, [])

  const getProducts = async () => {
    const productRef = collection(db, `Products`)
    let productList = await getDocs(productRef);
    let products = productList.docs.map((item) => {
      return { ...item.data(), id: item.id }
    })
    dispatch(setProducts(products))
  }
  const getData = async () => {
    const userRef = doc(db, `LoggedIn/pYqMp57QYmsXBFST9RrL`);
    let user = (await getDoc(userRef)).data().user;

    let cart = (await getDoc(doc(db, `UserCart/${user.uid}`))).data()
    dispatch(getCart(cart.cart))

    if (Object.keys(user).length > 0) {
      setLogedUser(user)
      setLogin(true)
    }
    setLoading(false)
  }
  return (
    <>
      {loading ? (
        <Loader center size="lg" backdrop inverse vertical content="Loding. . ." />
      ) : (
        <BrowserRouter>
          <authentication.Provider value={{ users, setUsers, login, setLogin, logedUser, setLogedUser }}>
            <Header />
            <Routes>
              {
                !login ? (
                  <>
                    <Route path='/' element={<Login />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<SignUp />} />
                    <Route path='/products' element={<Products />} />
                  </>
                ) : (
                  <>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/cart' element={<Cart />} />
                  </>
                )
              }
            </Routes>
          </authentication.Provider>
        </BrowserRouter>
      )}

    </>
  );
}

export default App;
