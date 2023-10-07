import './App.css';
import { useState,useEffect } from 'react';
import {db} from "./firebase-config"
import {collection,getDocs,addDoc,updateDoc,doc,deleteDoc} from "firebase/firestore"

function App() {


  const [newName,setNewname]=useState("");
const [newAge,setNewAge]=useState(0);
const [users,setusers]=useState([]);
const userCollectionRef = collection(db,"users")

const createUser = async()=>{

await addDoc(userCollectionRef,{Name:newName,Age: Number(newAge) })

}

const updateUser = async(id,Age)=>{
const userDoc=doc(db,"users",id);
const newField = {Age:Age+1};
await updateDoc(userDoc,newField);
}
const deleteUser=async(id)=>{
  const userDoc=doc(db,"users",id);
  await deleteDoc(userDoc);
}


useEffect(
  ()=>{
 const getUsers=async()=>{

  const data= await getDocs(userCollectionRef);
  setusers(data.docs.map((doc)=>({...doc.data(),id: doc.id})))
  console.log(data);

 }

 getUsers();
  },[]
)
  return (
    <div className="App">
<input placeholder="Name" onChange={(event)=>{setNewname(event.target.value)}}/>
<input type="number" onChange={(event)=>{setNewAge(event.target.value)}} placeholder="Age"/>

<button onClick={createUser}>Create User</button>
{
  users.map((user)=>{
    return <div>
     
     <div> Name: { user.Name}
       </div>
      Age : {user.Age}
      <button onClick={()=>{
        updateUser(user.id,user.Age)
      }} >Increase Age</button>
      <button onClick={()=>{
        deleteUser(user.id)
      }}>Delete User</button>
   
      </div>
  })
}
    </div>
  )
}


export default App;
