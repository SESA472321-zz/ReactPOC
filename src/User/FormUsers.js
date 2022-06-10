import "../App.css";
import React, {Component, useState, useEffect} from "react";
import { useParams, useNavigate   } from "react-router-dom";
import axios from "axios";

const AddEditUsers = props => {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
  const lsUser = JSON.parse(localStorage.getItem("User"));

useEffect(()=> {
  if(id!=0){
    axios.get(process.env.REACT_APP_USER_API_ENDPOINT+"?id="+ id,{
    headers: {
      'Authorization': lsUser.access_token
    }
    })
  //.then(res => res.json())
  .then((res) => res.data)
  .then(
      (result) => {
      setUser(result.Item);
    }
  )
  .catch(
  )
}
},[]);


 let handleSubmit = async (e) => {
   e.preventDefault();
   var data = {
    SESAId: user.SESAId,
    Role: user.Role
   }
   try {
      let res = await axios.post(process.env.REACT_APP_USER_API_ENDPOINT, data, {
        headers: {
          'Authorization': lsUser.access_token
        }
      });
      //let resJson = await res.json();
      let resJson = await res.data;
      if (res.status === 200) {
        setMessage("Record created successfully");
        navigate('/ListUsers');
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
   }
 };

  function changeData(e){
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div  className="pagepadding container">
    <h3>Add/Edit User</h3><br></br>

    {/* <Box sx={{ minWidth: 520 }}> */}

    <form onSubmit={handleSubmit}  className = "form-horizontal well" >
            <div className="message">{message ? <p>{message}</p> : null}</div>
            
            <div className="form-group">
              <label className="control-label col-sm-2" for="SESAId">SESA ID :</label>
              <div className="col-sm-4">
                <input type="text" id="SESAId" name="SESAId" className="form-control" value={user.SESAId} onChange={changeData}></input>
              </div>
            </div>

            <div className="form-group">
              <label className="control-label col-sm-2" for="Role">Role :</label>
              <div className="col-sm-4">
                <select name="Role" className="form-control" id = "Role" value={user.Role} onChange={changeData}>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </div>
            </div> 
            <br />

            <div class="form-group">        
              <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default btn-sm m-2">Submit</button>
              </div>
            </div>
      </form>
    </div>
  );
}

export default AddEditUsers;