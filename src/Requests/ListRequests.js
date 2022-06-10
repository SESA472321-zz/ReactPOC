import "../App.css";
import React, {Component, useState, useEffect, useRef} from "react";
import {FaTrashAlt, FaPencilAlt, FaSortDown} from "react-icons/fa";
import { CSVLink } from 'react-csv';
import xlsx from "xlsx";
import { Link, useNavigate } from 'react-router-dom';
import { confirm } from "react-confirm-box";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";

const ListRequests = () => {
  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [countdesc, setCountDesc] = useState(0);
  const [countstatus, setCountStatus] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checked, setChecked] = useState(false);
  const[multiDelete,setItemsId]=useState([])
  
  const lsUser = JSON.parse(localStorage.getItem("User"));
  
  const[isLoading, setLoading]=useState(false);
  const [APIData, setAPIData] = useState([])
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  let jsonReadExcel = "";
  const navigate = useNavigate();

    const fetchRequests = () => {
        setLoading(true);
        console.log(lsUser.access_token);
        axios.get(process.env.REACT_APP_API_ENDPOINT,{
            headers: {
                'Authorization': lsUser.access_token
            }
        })
        .then((res) => res.data)
        .then((json) => {
            setRequests(json["Items"]);    
    })
    .catch((error)=> console.log(error))
    .finally(
        () => { setLoading(false); }
        )
    }

    //Show deletion confirmation
    const showConfirmation = async (id) => {
        const result = await confirm("Are you sure you want to delete request ?");
            if (result) {
                deleteRecord(id);
            }
    };

    //sort requsts by id
    const sortById = (id) => {
        if(count==0){
            const sorted = [...requests].sort((a, b) => {
                return a.RequestID - b.RequestID;
            });
            setRequests(sorted);
            setCount(1);
        }
        else if(count==1){ 
            const sorted = [...requests].sort((a, b) => {
                return b.RequestID - a.RequestID;
            });
            setRequests(sorted);
            setCount(0);
         }  
    }
    //Sort by description
    const soryByDesc = (id) => {
        if(countdesc==0){
          const sortedDesc = [...requests].sort(function(a, b){
            if(a.Description < b.Description) { return -1; }
            if(a.Description > b.Description) { return 1; }
                return 0;
        })
        setRequests(sortedDesc);
        setCountDesc(1);
        }
        else if(countdesc==1){
          const sortedDesc = [...requests].sort(function(a, b){
              if(b.Description < a.Description) { return -1; }
              if(b.Description > a.Description) { return 1; }
              return 0;
        })
        setRequests(sortedDesc);
        setCountDesc(0);
        }
    }

    //Sort by Status
    const sortedbyStatus = (id) => {
        if(countstatus==0){
            const sortedbyStatus = [...requests].sort(function(a, b){
                if(a.Status < b.Status) { return -1; }
                if(a.Status > b.Status) { return 1; }
                return 0;
            })
            setRequests(sortedbyStatus);
            setCountStatus(1);
        }
        else if(countstatus==1){
            const sortedbyStatus = [...requests].sort(function(a, b){
            if(b.Status < a.Status) { return -1; }
            if(b.Status > a.Status) { return 1; }
            return 0;
        })
            setRequests(sortedbyStatus);
            setCountStatus(0);
        }
    }

    //Delete single request
  
    let deleteRecord =(id) =>  {
        axios.delete(process.env.REACT_APP_API_ENDPOINT+"?id="+id, {
            headers: {
                'Authorization': lsUser.access_token
            }
        }).then((res) => {
            if (res.status ==200) {
                setMessage("Record Deleted successfully");
                window.location.reload();
            }else{
            setMessage("Some error occured");
            }
        })
        .catch(err => {console.log(err);})
    }

        //Delete multiple requests
        const deleteMultipleByIds = async (id) => {
            const result = await confirm("Are you sure you want to delete multiple requests ?");
                 if (result) {
                      let arrayids = [multiDelete];
                      multiDelete.forEach(id => {
                          if (id) {
                            deleteRecord(id);
                          }
                      });   
                  }
            };
      

        //Checkbox Onchange
        const handleChange = (e,itemID)=> {
            let isChecked = e.target.checked;
            console.log(e,isChecked);
            if(isChecked===true){
                multiDelete.push(itemID);
            }
            else if(isChecked===false) {
                const index = multiDelete.indexOf(itemID);
                if (index > -1) {
                    multiDelete.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            console.log(multiDelete,'ARRAY');
        }

        //Search ITEMS
        const searchItems = (searchValue) => {
            console.log(searchValue);
            setSearchInput(searchValue)
            if (searchInput !== '') {
                const filteredData = requests.filter((item) => {
                    return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
                })
                setFilteredResults(filteredData)
            }
            else{
                setFilteredResults(requests)
            }
        }
        //Filter Item
        const filteredData = requests.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
        })

    const readUploadFile = (e) => {
        e.preventDefault();
        setLoading(true);
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                jsonReadExcel = xlsx.utils.sheet_to_json(worksheet);
                try {
                    jsonReadExcel.forEach((element) => {
                        console.log(element);
                        let res = axios.post(process.env.REACT_APP_API_ENDPOINT, JSON.stringify(element),
                         {
                            headers: {
                                'Authorization': lsUser.access_token
                            }
                        });
                        return res;
                    });
                }catch (err) {
                   console.log(err);
                }finally{
                    setLoading(false);
                    e.target.value = "";
                    window.location.reload();
                }
            };
            reader.readAsArrayBuffer(e.target.files[0]);
        }
    }

  useEffect(() => {
        if(lsUser == null){
            console.log("Ashwathi: lsUser == null");
            window.location.href = 'http://d12xt3m2ds6e9p.cloudfront.net/Home'
        }else if(Date.now()/1000 > lsUser.expires_at){
            console.log("Ashwathi: Inside " + Date.now()/1000 + " > " + lsUser.expires_at);
            window.location.href = 'http://d12xt3m2ds6e9p.cloudfront.net/Home'
        }
        else{
            console.log("Ashwathi: else");
            fetchRequests();
        }
  },[])

    
return(
    <div className="pagepadding">
        <div>
        <h3>List of Requests</h3>
        <br></br>
        <div style={{float: "right"}}>
        <button className="btn btn-danger btn-sm m-2" onClick={()=> { deleteMultipleByIds(); }} > Delete </button> 
        <button className="btn btn-primary btn-sm m-2" style={{margin: "5px"}} data-toggle="modal" data-target="#myModal">Import Excel</button>
        <div className="modal fade" id="myModal" role="dialog">
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">Import Requests</h4>
                </div>
                <form className="pagepadding" style={{padding: "20px"}}>
                <label htmlFor="upload">Upload File</label>
                <input type="file" name="upload" id="upload" onChange={readUploadFile} /> 
                {isLoading && <CircularProgress />}
                </form>
                <div className="modal-footer"> 
                    {/* <button type="button" id="upload" className="btn btn-default" onClick={readUploadFile}>Upload</button> */} 
                    <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
        <CSVLink data={requests} filename="Requests">
            <button className="btn btn-primary btn-sm m-2"> Export </button>
        </CSVLink>
        <Link to="/FormRequests/0">
        <button className="btn btn-primary btn-sm m-2" style={{margin: "5px"}} onClick='/FormRequests/0'>Add New Request</button>
        </Link>
        </div>
        <input icon='search' style={{width:"20%"}} placeholder='Search...' className="form-control" onChange={(e)=> searchItems(e.target.value)} /> 
        <br></br>
    </div>
    <table className="table table-striped">
        <thead>
        <tr key="Header">
            <th onClick={()=> sortById(0)}>RequestID <FaSortDown onClick={()=> sortById(0)}></FaSortDown>
            </th>
            <th onClick={()=> soryByDesc(0)}>Description <FaSortDown onClick={()=> soryByDesc(0)}></FaSortDown>
            </th>
            <th onClick={()=> sortedbyStatus(0)}>Status <FaSortDown onClick={()=> sortedbyStatus(0)}></FaSortDown>
            </th>
        </tr>
        </thead>
        <tbody> {searchInput.length > 1 ? ( filteredResults.map((item) => { return ( <tr key={item.RequestID}>
            <td onClick={()=> showConfirmation(item.RequestID)}>{item.RequestID}</td>
            <td>{item.Description}</td>
            <td>{item.Status}</td>
            <td>
            <button className="iconbutton" onClick={()=> showConfirmation(item.RequestID)}> <FaTrashAlt onClick={()=> showConfirmation(item.RequestID)}/> </button>
            </td>
            <td>
            <a href={'/FormRequests/'+item.RequestID}>
                <FaPencilAlt />
            </a>
            </td>
            <td>
            <input type="checkbox" onChange={e=> handleChange(e,item.RequestID)} />
            </td>
        </tr> ) }) ) : ( requests.map((item) => { return ( <tr key={item.RequestID}>
            <td>{item.RequestID}</td>
            <td>{item.Description}</td>
            <td>{item.Status}</td>
            <td>
            <button className="iconbutton" onClick={()=> showConfirmation(item.RequestID)}> <FaTrashAlt onClick={()=> showConfirmation(item.RequestID)}/> </button>
            </td>
            <td>
            <a href={'/FormRequests/'+item.RequestID}>
                <FaPencilAlt />
            </a>
            </td>
            <td>
            <input type="checkbox" onChange={e=> handleChange(e,item.RequestID)} />
            </td>
        </tr> ) }) )} </tbody>
    </table> 
    {isLoading && <CircularProgress />}
    </div>
    );
}
                
export default ListRequests;