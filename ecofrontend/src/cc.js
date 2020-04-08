import React, {useState, useEffect} from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import XYAxis from './XYaxis';
import Line from './line';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { transition } from 'd3-transition';
import axios from 'axios'
import {useParams} from 'react-router-dom'

function Chart() {
    const params=useParams()
    var lev2=params.lev2;
    console.log(params)
    var lev3=params.lev3;
    var lev4=params.lev4;
    var lev5=params.lev5;
  const [data,setdata]=useState([])

 
//   const data=[{ name: 'Jan', value: 30 },
//     { name: 'Feb', value: 10 },
//     { name: 'Mar', value: 50 },
//     { name: 'Apr', value: 20 },
//     { name: 'May', value: 80 },
//     { name: 'Jun', value: 30 },
//     { name: 'July', value: 0 },
//     { name: 'Aug', value: 20 },
//     { name: 'Sep', value: 100 },
//     { name: 'Oct', value: 55 },
//     { name: 'Nov', value: 60 },
//     { name: 'Dec', value: 80 },]
  useEffect(() => {
    var query = {
        "query": {
          "bool":{
            "must":[
              {"match": {"Level2.keyword": lev2}},
              {"match": {"Level3.keyword": lev3}},
              {"match": {"Level4.keyword": lev4}},
              {"match": {"Level5.keyword": lev5}}
              ]
          }
        }
      }
    const url = 'http://159.65.150.184:9200/ai_economics_v1_1/_search'



    axios.post(url, query)
		.then( d => {
			if(d.status === 200 ){
				let data = d.data.hits.hits[0]._source.data

				
        let list = []

        for (let [key, value] of Object.entries(data)) {
          // console.log(`${key}: ${value}`);
          let dict = {name : `${key}`,value : value}
          list.push(dict)
        }
				
        console.log(list,"list")

        setdata(list)
        
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
    }, [lev2,lev3,lev4,lev5]) 

    const parentWidth = 500;

    const margins = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    };

    const width = parentWidth - margins.left - margins.right;
    const height = 200 - margins.top - margins.bottom;

    const ticks = 5;
    const t = transition().duration(1000);

    const xScale = scaleBand()
       .domain(data.map(d => d.name))
       .rangeRound([0, width]).padding(0.1);

    const yScale = scaleLinear()
      .domain(extent(data, d => d.value))
      .range([height, 0])
      .nice();

    const lineGenerator = line()
      .x(d => xScale(d.name))
      .y(d => yScale(d.value))
      .curve(curveMonotoneX);

    
    return (
      <div><svg
          className="lineChartSvg"
          width={width + margins.left + margins.right}
          height={height + margins.top + margins.bottom}
        >
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            <XYAxis {...{ xScale, yScale, height, ticks, t }} />
            <Line data={data} xScale={xScale} yScale={yScale} lineGenerator={lineGenerator} width={width} height={height} />
          </g>
        </svg>
      </div>
    );
  }
export default Chart