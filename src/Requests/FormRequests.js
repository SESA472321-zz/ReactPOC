import "../App.css";
import React, {Component, useState, useEffect} from "react";
import {FaPencilAlt, FaDownload} from "react-icons/fa";
import { useParams, useNavigate   } from "react-router-dom";
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
//import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { saveAs } from "file-saver";
import { Link } from 'react-router-dom';
import MultiSelect from  'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'

const AddEditRequests = props => {
  const params = useParams();
  const id = parseInt(params.id);
  const [request, setRequest] = useState({});
  const navigate=useNavigate();
  const[isLoading, setLoading]=useState(false);
  const[fileToUpload, setFileToUpload] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedoption, setvalue] = useState('')
  const lsUser = JSON.parse(localStorage.getItem("User"));
  let onAttachmentChange = (e) => {
    setFileToUpload(e.target.files[0])
  }

  const options = [
    { label: "Fire Extinguisher", value: "Fire Extinguisher" },
    { label: "Safety Helmets", value: "Safety Helmets" },
    { label: "Safety Shoes", value: "Safety Shoes"},
    ];

  let onDownloadClick = () => {
    axios(
      "https://h43f339izh-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/default/awss3getfile?fileName=" 
          + request.attachment
    ).then(response => {
      const url = response.data.fileUploadURL;
      console.log(url);
      saveAs(url);   
    })
  }

useEffect(()=> {
  if(id!=0){
    axios.get(process.env.REACT_APP_API_ENDPOINT+"?id="+ id,
    {
      headers: {
          'Authorization': lsUser.access_token
      }
    }
  )
  //.then(res => res.json())
  .then((res) => res.data)
  .then(
      (result) => {
      setRequest(result.Item);
      handleOnchange(result.Item.SafetyEquipment);
    }
  )
  .catch(
  )
}
},[]);

let handleSubmit = async (status) => {
  axios(
      "https://l74p44yu57-vpce-09be63e6f1f2d3917.execute-api.eu-west-1.amazonaws.com/default/awss3?fileName=" +
      fileToUpload.name
  ).then(response => {
      const url = response.data.fileUploadURL;
      console.log("Presigned URL received" + response);
      axios({
              method: "PUT",
              url: url,
              data: fileToUpload,
              headers: {
                  "Content-Type": "multipart/form-data"
              }
          })
          .then(res => {
              axios.post(
                      process.env.REACT_APP_API_ENDPOINT, 
                      {
                        RequestID: parseInt(request.RequestID),
                        RequestType: request.RequestType,
                        Description: request.Description,
                        SafetyEquipment: selectedoption,//request.SafetyEquipment,
                        loto: request.loto,
                        entryTime: request.entryTime,
                        exitTime: request.exitTime,
                        Status: status,
                        attachment: fileToUpload.name
                      },{
                          headers: {
                              'Authorization': lsUser.access_token
                          }
                      }).then(res => {
                      if (res.status === 200) {
                          console.log("Record created successfully");
                          navigate('/ListRequests');
                      } else {
                          console.log("Some error occured");
                      }
                  })
                  .catch(
                      (err) => {
                          console.log(err);
                      }
                  )

          })
          .catch(err => {
              console.log(err);
          });
  });
}

const handleOnchange = (val) => {
  console.log(val,'OOOOOO');
  setvalue(val);
  
  }

  function changeData(e){
    if(e.target.name === "loto"){
      setRequest({
        ...request,
        [e.target.name]: e.target.checked
      });
    }
    else{
      setRequest({
        ...request,
        [e.target.name]: e.target.value
      });
    }
  }

  return (
    <div  className="pagepadding container">
      <h3>Add/Edit Requests</h3><br></br>

      <label>Request : {request.RequestID}</label>  
      <span style={{margin:"5px"}} className="label label-info">{request.Status}</span>
      
      <div  style={{float:"right"}}>
        {isDisabled && <button style={{margin:"5px"}} type="button" form="requestForm" className="btn btn-default btn-sm m-2" onClick={() => setIsDisabled(false)}><FaPencilAlt /> Edit</button>}
        <button style={{margin:"5px"}} type="button" form="requestForm" className="btn btn-success btn-sm m-2"value="Approved" onClick={() => handleSubmit("Approved")}>Approve</button>
        <button form="requestForm" type="button" className="btn btn-danger btn-sm m-2" value="Rejected" onClick={() => handleSubmit("Rejected")}>Reject</button>
      </div>

    <br></br><br></br>
    <form id="requestForm" className = "form-horizontal well">

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="RequestType">Request Type :</label>
                <div className="col-sm-4">
                <select name="RequestType" disabled={isDisabled}  className="form-control" id = "RequestType" value={request.RequestType} onChange={changeData}>
                  <option value="Hot Work Permit">Hot Work Permit</option>
                  <option value="Confined Space">Confined Space</option>
                  <option value="Electrical Work Permit">Electrical Work Permit</option>
                  <option value="Work ar Height Permit">Work ar Height Permit</option>
                  <option value="Cold Work Permit">Cold Work Permit</option>
                </select>
                </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" htmlFor="loto">Loto :</label>
              <div className="col-sm-4">
              <Switch
                id = "loto"
                name = "loto"
                checked={request.loto}
                onChange={changeData}
                disabled={isDisabled} 
                inputProps={{ 'aria-label': 'controlled' }}
              />
              </div>
            </div>
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="desc">Description :</label>
                <div className="col-sm-8" >
                  <textarea type="text" disabled={isDisabled} name="Description" rows="3" id = "desc" className="form-control" value={request.Description} onChange={changeData}></textarea>
                </div>
            </div>

            <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="desc">Safety Equipments :</label>
              <div className="col-sm-6">
              <MultiSelect onChange={handleOnchange} disabled={isDisabled}  options={options} defaultValue={selectedoption} />
              </div>
            </div>

            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="entryTime">Entry Time : </label>
                <div className="col-sm-4">
                  <input type="datetime-local" disabled={isDisabled}  id = "entryTime" name="entryTime" className="form-control" value={request.entryTime} onChange={changeData}></input>
                </div>
            </div>
           
            <div className="form-group">
                <label className="control-label col-sm-2" htmlFor="exitTime">Exit Time : </label> 
                <div className="col-sm-4">
                  <input type="datetime-local" disabled={isDisabled}  id = "exitTime" name="exitTime" className="form-control" value={request.exitTime} onChange={changeData}></input>
                </div>
            </div>
            <div className="form-group">
              <label htmlFor="attachment" className="control-label col-sm-2">Document :</label>
              <div className="col-sm-6">
                <input id="attachment" name="attachment" disabled={isDisabled}  className="form-control" type="file" onChange={onAttachmentChange}></input>
              </div>
              <div className="col-sm-2">
                <button id="download" name="download" className="btn btn-default btn-sm m-2" type="button" onClick={onDownloadClick}><FaDownload /> {request.attachment} </button>
              </div>
            </div>
            <div className="form-group">        
              <div className="col-sm-offset-2 col-sm-10">
                <button form="requestForm" type="button" disabled={isDisabled} className="btn btn-default btn-sm m-2" value="New" onClick={() => handleSubmit("New")}>Submit</button>
                <Link to="/ListRequests"><button form="requestForm" type="button" style={{margin:"5px"}} className="btn btn-default btn-sm m-2">Cancel</button></Link>
              </div>
            </div>
      </form>
      
    </div>
  );
}

export default AddEditRequests;