import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';

const Pagination = () => {

  const [requests, setRequests] = useState([])
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [countdesc, setCountDesc] = useState(0);
  const [countstatus, setCountStatus] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checked, setChecked] = useState(false);
  const[multiDelete,setItemsId]=useState([])
  
  const[isLoading, setLoading]=useState(false);
  const [APIData, setAPIData] = useState([])
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  let jsonReadExcel = "";
  //const navigate = useNavigate();

    const [postsPerPage] = useState(5);
    const [offset, setOffset] = useState(1);
    const [posts, setAllPosts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const lsUser = JSON.parse(localStorage.getItem("User"));

    const fetchRequests = async () => {
      const res = await axios.get(process.env.REACT_APP_API_ENDPOINT,{
          headers: {
              'Authorization': lsUser.access_token
          }
      })
      const data = res.data["Items"];
      const slice = data.slice((offset - 1) * 5 , (offset - 1) * 5 + postsPerPage)
      setAllPosts(slice)
      setPageCount(Math.ceil(data.length / postsPerPage))
    }
    
    const handlePageClick = (event) => {
      const selectedPage = event.selected;
      setOffset(selectedPage + 1)
    };
    
    useEffect(() => {
      fetchRequests()
    }, [offset])
    

    return(
      <div className="pagepadding">
          <div>
          <h3>List of Requests</h3>
          <br></br>
          </div>
      <table className="table table-striped">
          <thead>
          <tr key="Header">
              <th>RequestID</th>
              <th>Description</th>
              <th>Status</th>
          </tr>
          </thead>
          <tbody> {
          ( posts.map((item) => { return ( <tr key={item.RequestID}>
              <td>{item.RequestID}</td>
              <td>{item.Description}</td>
              <td>{item.Status}</td>
            </tr> ) }) )
          } </tbody>
      </table> 
      {/* Using React Paginate */}
      <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
           />
      </div>
  );   
}
                
export default Pagination;