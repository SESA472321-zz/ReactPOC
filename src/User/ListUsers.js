import "../App.css";
import React, {Component, useState, useEffect, useRef} from "react";
import {FaTrashAlt, FaPencilAlt} from "react-icons/fa";
import { CSVLink } from 'react-csv';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const ListUsers = () => {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const lsUser = JSON.parse(localStorage.getItem("User"));

    const fetchUsers = () => {
        console.log(lsUser.access_token);
      axios.get(process.env.REACT_APP_USER_API_ENDPOINT,{
        headers: {
            'Authorization': lsUser.access_token
        }
      })
      //.then((res) => res.json())
      .then((res) => res.data)
      .then((json) => {
          setUsers(json["Items"]);
      })
      .catch((error)=> console.log(error))
    }

    let deleteRecord = (id) => {
        console.log(id);
        axios.delete(process.env.REACT_APP_USER_API_ENDPOINT+"?id="+id, {
        headers: {
            'Authorization': lsUser.access_token
          }
        })
        .then(async res => 
            {
                setMessage("Record deleted successfully");
            }
        )
        .catch(err => {console.log(err);})
    }
  useEffect(() => {
    console.log("Ashwathi User.js : " + lsUser)
    if(lsUser == null){
      window.location.href = 'http://d12xt3m2ds6e9p.cloudfront.net/Home'
    }else if(Date.now()/1000 > lsUser.expires_at){
        window.location.href = 'http://d12xt3m2ds6e9p.cloudfront.net/Home'
    }
    else{
        fetchUsers();
    }
  },[])
  
  return(
        <div className="pagepadding">
            <div>
                <h3>List of Users</h3>
                <div  style={{float: "right"}}>
                  
                    <CSVLink data={users} filename="Users">
                        <button className = "btn btn-primary btn-sm m-2">
                            Export
                        </button>
                    </CSVLink>

                    <Link to='/FormUsers/0'><button className = "btn btn-primary btn-sm m-2" style={{margin: "5px"}}
                    onClick='/FormUsers/0'>Add New User</button></Link>
                </div>
            </div>
            <br></br>
            <table className="table table-striped">
                <thead>
                    <tr key="Header">
                    <th>SESA</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                 
                  {users.map(
                      (item)=>(
                              <tr key = {item.SESAId}>
                                  <td>{item.SESAId}</td>
                                  <td>{item.Role}</td>
                                  <td><button className="iconbutton" onClick={() => deleteRecord(item.SESAId)}><FaTrashAlt  onClick={() => deleteRecord(item.SESAId)}/></button></td>
                                  <td><a href={'/FormUsers/'+item.SESAId}><FaPencilAlt /></a></td>
                              </tr>
                      )
                  )}
                    
                </tbody>
            </table>
             
        </div>
  );
}

export default ListUsers;