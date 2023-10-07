import './App.css';
import { useState,useEffect } from 'react';
import {db} from "./firebase-config"
import {collection,getDocs,addDoc,updateDoc,doc,deleteDoc} from "firebase/firestore"

// ... (previous imports)

function App() {
  const [newName, setNewname] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(userCollectionRef, { Name: newName, Age: Number(newAge) });
    setNewname(""); // Clear input fields after creating user
    setNewAge(0);
    getUsers(); // Update the list of users after creating a new one
  };

  const updateUser = async (id, Age) => {
    const userDoc = doc(db, "users", id);
    const newField = { Age: Age + 1 };
    await updateDoc(userDoc, newField);
    getUsers(); // Update the list of users after updating a user
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers(); // Update the list of users after deleting a user
  };

  const getUsers = async () => {
    const data = await getDocs(userCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getUsers();
  }, []); // Fetch users when the component mounts

  return (
    <div className="App">
      <input
        placeholder="Name"
        value={newName}
        onChange={(event) => {
          setNewname(event.target.value);
        }}
      />
      <input
        type="number"
        value={newAge}
        onChange={(event) => {
          setNewAge(event.target.value);
        }}
        placeholder="Age"
      />
      <button onClick={createUser}>Create User</button>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>Name: {user.Name}</div>
            Age: {user.Age}
            <button
              onClick={() => {
                updateUser(user.id, user.Age);
              }}
            >
              Increase Age
            </button>
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
            >
              Delete User
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
