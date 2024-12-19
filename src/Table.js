import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faUser, faCubes, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { db } from "./firebase"; 
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { auth } from "./firebase"; 
import { onAuthStateChanged } from "firebase/auth";

const Table = () => {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ item: "", stock: "", price: "" });
  const [editItem, setEditItem] = useState({ id: null, item: "", stock: "", price: "" });
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); 
  const navigate = useNavigate();
  const [username, setUsername] = useState(null); 
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false); 
  const [userInfo, setUserInfo] = useState({}); 
  const collectionRef = collection(db, "inventory");
  

  {/* Fetches  */}
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsername(user.email); 
  
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid)); 
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const birthdate = new Date(userData.birthdate); 
            const formattedBirthdate = birthdate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            
            setUserInfo({
              name: userData.name || "No Name Provided", 
              birthdate: formattedBirthdate || "No Birthdate Provided",
              email: user.email,
            });
            
          } else {
            console.error("No user document found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user info from Firestore:", error);
        }
      }
    });
  
  
  
    // Fetch inventory data
    fetchData();
  
    return () => unsubscribe(); 
  }, []); 
  

  // Fetch data from Firestore
  const fetchData = async () => {
    const snapshot = await getDocs(collectionRef);
    const inventory = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        if (data.userId) { 
          const userRef = doc(db, "users", data.userId);
          const userSnapshot = await getDoc(userRef);
          const name = userSnapshot.exists() ? userSnapshot.data().name : "Unknown";
          return { id: doc.id, ...data, user: name };
        }
        return { id: doc.id, ...data };
      })
    );
    setData(inventory);
    setFilteredData(inventory); 
  };

  // Add new item to Firestore
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const total = newItem.stock * newItem.price;
    const userRef = doc(db, "users", auth.currentUser.uid); 
    const userSnapshot = await getDoc(userRef); 
    const name = userSnapshot.exists() ? userSnapshot.data().name : "Unknown"; 
    await addDoc(collectionRef, { ...newItem, total, user: name });
    
    fetchData(); // Refresh data
    setIsAddModalOpen(false);
    setNewItem({ item: "", stock: "", price: "" });
  };

  // Edit item in Firestore
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const total = editItem.stock * editItem.price;
    const itemRef = doc(db, "inventory", editItem.id);
    await updateDoc(itemRef, { item: editItem.item, stock: editItem.stock, price: editItem.price, total });
    fetchData(); // Refresh data
    setIsEditModalOpen(false);
    setEditItem({ id: null, item: "", stock: "", price: "" });
  };

  // Delete item from Firestore
  const handleDelete = async (id) => {
    const itemRef = doc(db, "inventory", id);
    await deleteDoc(itemRef);
    fetchData(); // Refresh data
  };

  // Open edit modal with item details
  const openEditModal = (item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  // Search functionality
  const handleSearch = () => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = data.filter((item) =>
      item.item.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  };



{/* Dashboard */}
{/* Background and The Logo of Dashboard/Sidebar */}
  return (
    <div className="flex flex-wrap min-h-screen bg-customGrey">
      <aside className="w-1/5 bg-customBlue p-4 flex flex-col items-center">
        <div className="text-center mb-8">
          <img
            src="/ADV%20HARDWARE.png"
            alt="ADV Hardware Logo"
            className="w-[400px] h-[200px] mx-auto mb-[50px]"
          />
        </div>


{/*Current user*/}
        <div className="text-center text-black font-bold  absolute mt-[180px]">
  <p className="text-lg">Current User</p>
  <p className="text-xl">{username || "No User Logged In"}</p>
</div>


 {/*Account Info*/}
        <nav className="w-full flex flex-col space-y-4 mb-auto">
        <a
  href="#"
  onClick={() => setIsAccountModalOpen(true)} // Open modal
  className="block py-2 px-4 text-center flex items-center justify-start space-x-2 text-black font-bold text-[25px] rounded-[10px] hover:bg-DarkerGray"
>
  <FontAwesomeIcon icon={faUser} />
  <span>ACCOUNT</span>
</a>

{/*Inventory Text inside the Dashboard/Sidebar*/}
          <a
            href="#"
            className="block py-2 px-4 text-center flex items-center justify-start space-x-2 bg-DarkerGray font-bold text-[25px] text-gray-800 rounded-[10px]"
          >
            <FontAwesomeIcon icon={faCubes} />
            <span>Inventory</span>
          </a>
        </nav>

        {/*Button for Sign out*/}
        <button
      className="mt-4 text-Black text-[30px] font-bold px-4 py-2 rounded "
      onClick={() => navigate("/")}
    >
      Sign out
    </button>
      </aside>
      <main className="w-4/5 p-6">

      {/*Beside Searchbar Inventory*/}
  <header className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>

     {/*Search Bar*/}
    <div className="flex items-center mr-[900px] space-x-2">
      <input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter(
      (item) =>
        item.item.toLowerCase().includes(query) || // Match item names
        (item.user && item.user.toLowerCase().includes(query)) // Match usernames
    );
    setFilteredData(filtered);
  }}
  className="border border-gray-300 ml-[20px] rounded-[10px] p-2"
  
/>

 {/*Search Bar Icon */}
      <button
        onClick={handleSearch}
        className="bg-customBlue text-black font-bold px-4 py-2 rounded-[10px] hover:bg-DarkerGray"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
      </button>


       {/*Add New Item Button*/}
    <div className="flex items-center ">
      <button
        className="bg-customBlue text-black font-bold ml-[900px] px-4 h-[50px] w-[150px] py-2 rounded-[10px] hover:bg-DarkerGray"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New Item
      </button>
    </div>
    </div>

     
  </header>

      {/*Table*/}
        <table className="table-auto w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-customGray text-left">
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Stocks</th>
              <th className="px-4 py-2">Price per Unit</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-2">{row.item}</td>
                <td className="px-4 py-2">{row.stock}</td>
                <td className="px-4 py-2">{row.price}php</td>
                <td className="px-4 py-2">{row.total}php</td>
                <td className="px-4 py-2">{row.user}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => openEditModal(row)}
                  >
                    <FontAwesomeIcon icon={faEdit} size="lg" />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(row.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>


      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="item" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="item"
                  value={newItem.item}
                  onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price per Unit
                </label>
                <input
                  type="number"
                  id="price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/*ACcount Info Modal*/}
{isAccountModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
      <h2 className="text-[40px] font-bold mb-4">Account Information</h2>
      <p className="mb-2 text-[20px]"><strong>Name:</strong> {userInfo.name}</p>
      <p className="mb-2 text-[20px]"><strong>Email:</strong> {userInfo.email}</p>
      <p className="mb-2 text-[20px]"><strong>Birthdate:</strong> {userInfo.birthdate}</p>
      <button
        onClick={() => setIsAccountModalOpen(false)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
)}

      {/* Edit Table Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
            <form onSubmit={handleEditFormSubmit}>
              <div className="mb-4">
                <label htmlFor="item" className="block text-sm font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  id="item"
                  value={editItem.item}
                  onChange={(e) => setEditItem({ ...editItem, item: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  value={editItem.stock}
                  onChange={(e) => setEditItem({ ...editItem, stock: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price per Unit
                </label>
                <input
                  type="number"
                  id="price"
                  value={editItem.price}
                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
