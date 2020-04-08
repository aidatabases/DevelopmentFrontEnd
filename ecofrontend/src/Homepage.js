import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link} from "react-router-dom"

const Homepage = () => {
  
const url = 'http://159.65.150.184:9200/ai_economics_v1_1/_search'
  const [list, setlist]=useState([])

  useEffect(() => {
    var query = {
      "query": {
        "match_all":{}
      },
      "aggs": {
        "level2_feilds": {
          "terms": {
            "field": "Level2.keyword"
          }
        }
      }
    }
    axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
				var level3 = d.data.aggregations.level2_feilds.buckets
        var list = level3.map(s => {return {"value" : s.key}})
        setlist(list)
        console.log("list",list)
				
			}
			else{
				console.log("err")
			}
		})
		.catch( error => {
			if (error) {
			  console.log(error)
			}
			else{
				console.log("Error!");
			}
    });
  }, [])  
    


  const Listcreate = (item) => {
    
    console.log("entered",item.value)
    const [data, setData] = useState([])
    useEffect(() => {
    var query2 = {
      "query": {
      "match": {
        "Level2.keyword": item.value
      }
      },
      "aggs": {
      "level3_feilds": {
        "terms": {
        "field": "Level3.keyword"
        }
      }
      },
      "size": 0
    }
    axios.post(url, query2)
      .then( d => {
        if(d.status === 200 ){
          var level3 = d.data.aggregations.level3_feilds.buckets
          var data = level3.map(s => {return {"value" : s.key}})
          setData(data)
        }
        else{
          console.log("err")
        }
      })
      .catch( error => {
        if (error) {
          console.log(error)
        }
        else{
          console.log("Error!");
        }
      });
    }, [item.value])
    var l = []
    let i=0
    for(i in data){
      
      
      l.push(<Link to={
        {
          pathname:item.value,
          state:{
            from:data[i].value
          }
        }
      }>{data[i].value}</Link>)
      l.push(<br></br>)
      if(i>7)
      {
      l.push(<a href={item.value}>more..</a>)
      break;
      }
    }

    return l;
  }
  return (
    <div>
      <ul style={{listStyleType:"none"}}>
      <div>
        {list.map(item => (
        <div>
        <li key={item.value}>
          <h4><Link to={item.value} style={{textDecoration:"none"}}>{item.value}</Link></h4>
          <Listcreate value={item.value}/>
        </li>
        </div>
        ))}
        </div>
      </ul>
    </div>
  )
}

export default Homepage
