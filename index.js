import axios from 'axios'
import shell from 'shelljs'
import fs from 'fs';
import * as IPFS from 'ipfs-core';
import crypto from 'crypto';
import { base64 } from "multiformats/bases/base64"
import { base32 } from "multiformats/bases/base32"
import { CID } from 'multiformats/cid'

var auth='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0'

var config = {
    method: 'get',
    url: 'https://api.pinata.cloud/data/pinList',
    headers: { 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYmJmNzhjYS04N2Y4LTQzNjctYTcyMi0yZWZiZTQ1ZWM2ODEiLCJlbWFpbCI6InByb2plY3RibG9ja2NoYWluMjAyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGYxNzE1ZTdlMTU0ZWYzM2NlNzAiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDM1YWZmNjY4NmUzOWYyNmNmOGU1MmQ4YjE1NWE4YjFkNTc1ZTM5OWI2NDEwNGIzMDkxYjhiZGU3NzM1MTU4IiwiaWF0IjoxNjc0NTU3ODEyfQ.ZBC2rQPDgbLx3jvo1BT2wpREFOWcV92W4n0gbz3XIa0'
    }
  };

//const res = await axios(config)
//console.log(res)

var maradonaHash='QmRPYny7G1WmAVFWNe6dzgq9tF6xLKXmkgN3knR4E9Sbz3'
var txtHash='QmbQp9xXLAU81dfcuJYUEbWyQpJ97X78CkDz6gZBojWxvW'
var jsonHash='bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze'

async function main() {

    const node = await IPFS.create()
    
    const chunks = []
    for await (const chunk of node.cat("bafkreicjmxc2drbgxtoidx6xfatbffyx46oiyo6ktipss6dhdermwtsoze", {timeout: 1000})) {
      chunks.push(chunk)
    }
    var dict=Buffer.concat(chunks).toString();
    //var dictstring = JSON.stringify(dict);
    fs.writeFile("JSONs/thing.json", dict, function(err, result) {
        if(err) console.log('error', err);
    });
    
    
}
main();
