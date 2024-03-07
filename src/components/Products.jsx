import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add } from '../redux/Action'
import { authentication } from '../App'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../redux/firebase'
import { useNavigate } from 'react-router'
import '../assets/product.css'
import Swal from 'sweetalert2'


const Products = () => {
  const products = useSelector((state) => state.products)
  // const cart = useSelector((state) => state.cart)
  const { logedUser, setLogedUser } = useContext(authentication)
  const [dishes, setDishes] = useState(products)
  const [cart, setCart] = useState([])
  const [originalDishes, setOriginalDishes] = useState([]);
  const [searchDish, setSearchDish] = useState('')
  const [selectedType, setSelectedType] = useState('');
  const [sortByPrice, setSortByPrice] = useState(false);
  const [noRecord, setNoRecord] = useState(false)
  const navigate = useNavigate()

  // console.log(dishes);

  useEffect(() => {
    if (dishes.length === 0) {
      setNoRecord(true)
    } else {
      setNoRecord(false)
    }
  }, [dishes])

  const handleSearch = (e) => {
    setSearchDish(e.target.value)
  }

  const handleSort = () => {
    setSortByPrice(!sortByPrice);
  }

  const handleFilterByType = (type) => {
    setSelectedType(type);
    if (type === "All") {
      setDishes(originalDishes);
    } else {
      setSelectedType(type);
      const filteredDishes = originalDishes.filter((dish) =>
        dish.type.toLowerCase().includes(type.toLowerCase())
      );
      setDishes(filteredDishes);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const querySnapshot = await getDocs(collection(db, "Food"));
        const allDishes = products
        setOriginalDishes(allDishes);

        let filteredDishes = allDishes;

        if (selectedType !== 'All') {
          filteredDishes = allDishes.filter((dish) =>
            dish.type.toLowerCase().includes(selectedType.toLowerCase())
          );
        }

        filteredDishes = filteredDishes.filter((dish) =>
          dish.name.toLowerCase().includes(searchDish.toLowerCase())
        );

        let sortedDishes = [...filteredDishes];

        if (sortByPrice) {
          sortedDishes = sortedDishes.sort((a, b) => a.price - b.price);
        }

        setDishes(sortedDishes);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchData()
  }, [searchDish, setDishes, selectedType, sortByPrice])


  // const handleAddToCart = async (selectedDish) => {
  //   console.log(selectedDish);
  //   if (logedUser) {
  //     // If user is logged in, update the cart
  //     try {
  //       console.log(selectedDish.unique);

  //       const newCart = [...cart];

  //       const existingItemIndex = newCart.findIndex((item) => item.unique === selectedDish.unique);
  //       console.log(existingItemIndex);

  //       if (existingItemIndex !== -1) {
  //         // If the item already exists in the cart, update its quantity
  //         newCart[existingItemIndex].quantity += 1;
  //       } else {
  //         // If the item is not in the cart, add a new item
  //         newCart.push({ ...selectedDish, quantity: 1 });
  //       }

  //       const userCartRef = doc(db, 'carts', logedUser.uid);
  //       await setDoc(userCartRef, { cart: newCart }, { merge: true });
  //       setCart(newCart)
  //     } catch (error) {
  //       console.error('error Updating cart : ', error)
  //     }

  //   } else {
  //     Swal.fire({
  //       title: "Please Login !",
  //       text: "Login To Add to Platter",
  //       icon: "info",
  //       showConfirmButton: false,
  //       timer: 2100
  //     });
  //     navigate('/login')
  //   }
  // };
  return (
    <>
      <h1 className="heading py-3">Exquisite Meals</h1>
      <div className="filter-area bg-body-secondary rounded-5 mt-4 mb-5 py-2 px-5">
        <div className="d-flex container align-items-center justify-content-between">
          <input type="text" className='form-control w-25' placeholder='Search Dish...' value={searchDish} onChange={handleSearch} />
          <div className="sortbyname">
            <div className="d-flex align-items-center justify-content-Evenly gap-2">
              <button className={`btn btn-outline-danger ${selectedType === 'All' ? 'active' : ''}`} onClick={() => handleFilterByType('All')}>
                All
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Burger' ? 'active' : ''}`} onClick={() => handleFilterByType('Burger')}>
                Burger
              </button>
              <button className={`btn btn-outline-danger ${selectedType === 'Wrap' ? 'active' : ''}`} onClick={() => handleFilterByType('Wrap')}>
                Wrap
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
      <div className="container1 d-flex justify-content-around">
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
          <div class="grid grid--3-cols margin-right-md">
            <div class="meal">
              <img
                src="https://t4.ftcdn.net/jpg/05/85/29/13/360_F_585291338_0J8Q8vYbKDCu8yqqwAO8PsQZ4ESP2zd8.jpg"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegetarian</span>
                </div>
                <p class="meal-title">Japanese Gyozas</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>

            <div class="meal">
              <img
                src="https://freepngimg.com/save/10723-burger-free-png-image/1100x878"
                class="meal-img"
                alt="Avocado Salad"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Avocado Salad</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>

            <div class="meal">
              <img
                src="https://www.cfacdn.com/img/order/menu/Online/Entrees/2022Veggie_Wrp_1080x1080.png"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>
            <div class="meal">
              <img
                src="https://kfc.ee/wp-content/uploads/2022/09/VEGGIE-TWISTER.png"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>
            <div class="meal">
              <img
                src="https://static.vecteezy.com/system/resources/previews/032/325/466/original/french-fries-with-cheese-and-bacon-isolated-on-transparent-background-file-cut-out-ai-generated-png.png"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>
            <div class="meal">
              <img
                src="https://png.pngtree.com/png-clipart/20240212/original/pngtree-french-fries-on-plate-png-image_14297094.png"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>
            <div class="meal">
              <img
                src="https://images.ctfassets.net/o19mhvm9a2cm/2c7tQ0UDXqyJueB23vGEV7/1bd89889514b84d8d4c56ca23b5c4730/Website_LTO_May2022_Beverage_Lemonade_Peach.png?&q=80&w=200"
                class="meal-img"
                alt="Japanese Gyozas"
              />
              <div class="meal-content">
                <div class="meal-tags">
                  <span class="tag tag--vegan">Vegan</span>
                </div>
                <p class="meal-title">Thai Red Curry</p>
                <button type="button" class="btn btn-sm btn-default">Order Now</button>
              </div>
            </div>
          </div>
        </section>

        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
      </div>
    </>
  )
}

export default Products