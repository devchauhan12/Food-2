import React, { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '../redux/Action'
import { authentication } from '../App'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../redux/firebase'
import { useNavigate } from 'react-router'
import '../assets/product.css'


const Products = () => {
  const products = useSelector((state) => state.products)
  const cart = useSelector((state) => state.cart)
  const { logedUser, setLogedUser } = useContext(authentication)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleAdd = async (id) => {
    if (logedUser) {
      const UserCart = (await getDoc(doc(db, `UserCart/${logedUser.uid}`))).data()

      const check = UserCart.cart.some(e => {
        if (e.id === products[id].id) {
          e.qty += 1;
          return true
        }
      })
      if (!check) {
        UserCart.cart.push({ ...products[id], qty: 1 })
      }
      await setDoc(doc(db, "UserCart", logedUser.uid), UserCart);
      dispatch(add(id));
    } else {
      navigate('/login')
    }
  }





  const [searchDish, setSearchDish] = useState('')
  const [selectedType, setSelectedType] = useState('');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [noRecord, setNoRecord] = useState(false)
  // const navigate = useNavigate()

  const handleSearch = (e) => {
    setSearchDish(e.target.value)
  }

  const handleSort = () => {
    setSortByPrice(!sortByPrice);
  }

  const handleFilterByType = (type) => {
    setSelectedType(type);
    if (type === "All") {
      // setDishes(originalDishes);
    } else {
      setSelectedType(type);
      // const filteredDishes = originalDishes.filter((dish) =>
      //   dish.type.toLowerCase().includes(type.toLowerCase())
      // );
      // setDishes(filteredDishes);
    }
  };


  return (
    <>
      <h1 className="heading">Exquisite Meals</h1>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between my-4">
          <input type="text" className='form-control w-25' placeholder='Search Dish...' value={searchDish} onChange={handleSearch} />
          <div className="sortbyname">
            <div className="d-flex align-items-center justify-content-Evenly gap-2">
              <button className={`btn btn-outline-danger ${selectedType === 'All' ? 'active' : ''}`} onClick={() => handleFilterByType('All')}>
                All
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Combo' ? 'active' : ''}`} onClick={() => handleFilterByType('Combo')}>
                Combo
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Burger' ? 'active' : ''}`} onClick={() => handleFilterByType('Burger')}>
                Burger
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Wrap' ? 'active' : ''}`} onClick={() => handleFilterByType('Wrap')}>
                Wrap
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Chicken' ? 'active' : ''}`} onClick={() => handleFilterByType('Chicken')}>
                Chicken
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Fries' ? 'active' : ''}`} onClick={() => handleFilterByType('Fries')}>
                Fries
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Beverages' ? 'active' : ''}`} onClick={() => handleFilterByType('Beverages')}>
                Beverages
              </button>
              <button className='btn btn-success' onClick={handleSort}>Sort Price</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container d-flex justify-content-around">
        {/* {products && products.map((item, id) => {
          return (
            <div className="card" key={id}>
              <div className="imgBox">
                <img src={item.image} alt="mouse corsair" className="mouse" />
              </div>

              <div className="contentBox">
                <h3>{item.title}</h3>
                <h2 className="price">₹{item.price}</h2>
                <button href="#" className="buy" onClick={() => handleAdd(id)}>Buy Now</button>
              </div>
            </div>
          )
        })} */}
        <section class="section-meals">
          <div class="container grid grid--3-cols margin-right-md">
            <div class="meal">
              <img src="https://github.com/erenburuk/html-css-course/blob/1aacbb283eed0f760ab9f905e4ad5099cfa11204/07-Omnifood-Desktop/img/meals/meal-1.jpg?raw=true" class="meal-img" alt="Japanese Gyozas" />
              <div class="meal-content active">
                <div class="meal-tags">
                  <span class="tag tag--vegetarian">Vegetarian</span>
                </div>
                <p class="meal-title">Japanese Gyozas</p>
                <button type="button" class="btn btn-sm btn-default fs-5  ">Add to Cart</button>
              </div>
            </div>

            <div class="meal">
              <img src="https://github.com/erenburuk/html-css-course/blob/main/07-Omnifood-Desktop/img/meals/meal-2.jpg?raw=true" class="meal-img" alt="Avocado Salad" />
              <div class="meal-content active">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                  <span class="tag tag--paleo">Paleo</span>
                </div>
                <p class="meal-title">Avocado Salad</p>
                <button type="button" class="btn btn-sm btn-default fs-5  ">Add to Cart</button>
              </div>
            </div>

            <div class="meal">
              <img src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" class="meal-img" alt="Japanese Gyozas" />
              <div class="meal-content active">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>

                <button type="button" class="btn btn-sm btn-default fs-5  ">Add to Cart</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Products