import axios from 'axios'

async function upload(data1,data2){
  var data = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": "testing1",
      "keyvalues": {
        "customKey": "customValue",
      }
    },
    "pinataContent": {
      "somekey": "somevalue",
      "data1": data1,
      "data2": data2
    }
  });
  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0'
    },
    data : data
  };
  const res = await axios(config);
  console.log(res.data);
}

upload("ciao","abc")