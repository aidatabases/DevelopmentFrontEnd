import React, {useState, useEffect} from 'react'
import axios from 'axios'


function Tab({level3_key,level2_key}){
  const url = 'http://159.65.150.184:9200/ai_economics_v1_1/_search'
  

  const [temp, setData] = useState([])
  const [list, setlist]=useState([])

  useEffect(() => {
    console.log("data ---",level3_key)
  var query = Qur(level3_key,level2_key)


    axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
				// console.log("data",d.data);
				let data = d.data.hits.hits
				var temp = {}
				for(var x in data){
					let dataobject = data[x]._source
					let key = dataobject.Level4
					if( dataobject.Level5 !== null){
					let l = [dataobject.Level5,dataobject.data]
					temp[key] = temp[key] || [];
          temp[key].push(l)
          }
				}
				
				// console.log("data",data)
				let level4 = d.data.aggregations.level4_feilds.buckets
				let list = level4.map(s => {return {"label" : s.key ,"value" : s.key}})
				
				//console.log(list,"list")
				setlist(list)
        //console.log(temp,"temp")
        setData(temp)
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
  }, [level3_key])


  function Qur(lev3,lev2){
    let query = {
      "query": {
        "bool": {
          "must": [
            {"match": {"Level2.keyword":lev2}}
          ],
          "filter": [
            {"term": {"Level3.keyword": lev3}}
          ]
          
        }
      },
      "aggs": {
        "level4_feilds": {
          "terms": {
            "field": "Level4.keyword"
          }
        }
      },
      "size":10000
    }
    return query;
  }

  const headcreate = (k) => {
    var l = []
    for(let i in temp[k]){
      l.push(<th>{temp[k][i][0]}</th>)
      }
      return l;
  }


  const bodycreate = (k) => {
    for(let i in temp[k])
    {
      var dict=(temp[k][i][1])
      var years = Object.keys(dict)

      var row = []
      var row2 = []
      for(let j in years){
        let year = years[j]
        let h = []
        for(var loop=0;loop<temp[k].length;loop++)
        {
          h.push(<td>{temp[k][loop][1][year]}</td>)
        }
        row2.push(<tr key={j}><td>{year}</td>{h}</tr>)
      }
      break;
    }
    return(row2)
  }


  return (
    <div>
        <h2>{level3_key}</h2>
      <ul style={{listStyleType:"none"}}>
        {list.map(item => (
        <li key={item.value}>
          <h3>{item.value}</h3>
          <table id={item.value}>
            <thead>
              <th>Year</th>
              {headcreate(item.value)}
            </thead>
            <tbody>
              {bodycreate(item.value)}
            </tbody>
            
          </table>
        </li>
        ))}
      </ul>
    </div>
  )
}

export default Tab
