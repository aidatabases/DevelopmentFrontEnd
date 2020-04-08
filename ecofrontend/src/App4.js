import React, {useState, useEffect} from 'react'
import axios from 'axios'
import useAxios from 'axios-hooks'
import Tab from "./Tab"
import {useParams,useHistory,useLocation} from "react-router"


var url = 'http://159.65.150.184:9200/ai_economics_v1_1/_search'
function App4({level2_key,match}) {
    const history = useHistory()
    const params = useParams()
    const location = useLocation()

    let level2key=params.level2key


    const [links,changeLinks] = useState([])
    const [level3_key,setLevel3] = useState("")
    var query = {
        "query": {
            "match": {
                "Level2.keyword": level2key
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

    var urlLink = url+'?source_content_type=application/json&source='+JSON.stringify(query)

    const [{ data, loading, error }, refetch] = useAxios(urlLink)

    useEffect(() => {
        // console.log("history",history)
        // console.log("loaction",location.state.from)
        if(data){
            let links_list = data.aggregations.level3_feilds.buckets
            let list = links_list.map(s => s.key)
            changeLinks(list)
            console.log("data-hook")
            
        }
    },[data])

    useEffect(() => {
        if(location.state){
            setLevel3(location.state.from)
        }
    },[])
         

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error!</p>

    
  
  
 
  return (
    <div>
      {/* <button onClick={refetch}>refetch</button> */}
      <h1>{level2key}</h1>
      {/* <pre>{JSON.stringify( links, null, 2)}</pre> */}
      {links.map((link,j) => {
          return <a key={j} herf="" onClick={(e) => setLevel3(e.target.text)}>{link}<br /></a>
      })}
      <Tab level3_key={level3_key} level2_key={level2key}/>
    </div>
  )
}



export default App4
