"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const pdf_js_extract_1 = require("pdf.js-extract");
const index_js_1 = require("ix/asynciterable/operators/index.js");
const asynciterable_1 = require("ix/asynciterable");
const giveFiles = (getpath) => {
    return fs.readdirSync(getpath).filter(x => x.includes('.pdf'));
    // const abc = fs.readFileSync(getpath)
    // return abc
};
// let otherPresent = false;
// let otherY = 0;
// function tableData1(data: PDFExtractText[], index: any, s1: number, s2 : number) {
//     const mapped_data = data.map((each: any) => {
//         if(each && Math.floor(each.x) == Math.floor(index.x)) {
//             return each;
//         }
//     }).filter((each) => each)
//     if(s2)
//     {
//         return mapped_data.map((each) => each.str).slice(s1, s2).join(" ");
//     }
//     else
//     {
//         const filtered = mapped_data.map((each) => each.str)
//         return otherPresent ? filtered.slice(1, filtered.length-1).join(" ") : filtered.slice(1).join(" ");
//     }
// }
// interface res_data {
//     'Purchase Order Number': string,
//     'Invoice Number': string,
//     'Invoice Date': string,
//     'Order Date': string,
//     'HSN': string,
//     'Description': string,
//     'Taxes': string,
//     // 'Taxable value': string,
//     'Total': string,
// }
// // interface x_y {
// //     "x": number,
// //     "y": number
// // }
// // function desc(data: PDFExtractText[]): string[] {
// //     const newArr: string[] = [];
// //     data.map((each) => {
// //         if(each.x == 63.57){
// //             newArr.push(each.str)
// //         }
// //     })
// //     // console.log(newArr)
// //     return newArr
// // }
// function get_req_data(data: PDFExtractText[]): res_data {
//     let req_obj: res_data
//     let ind5: any = data.map((each) => {
//         if(each.str == "Description"){
//             return each.x
//         }
//     }).filter((each) => each);
//     const newArr: string[] = [];
//     data.map((each) => {
//         // if(each.x == 63.57 || each.x == 66.95){
//         if(each.x == ind5){
//             newArr.push(each.str)
//         }
//     })
//     const newArrstring = newArr.join(' ')
//     let ind1 = data.findIndex((each) => each.str.match("Order Number"))
//     let ind2 = data.findIndex((each) => each.str.match('Credit Note Number'))
//     if(data[ind2] == undefined){
//         ind2 = data.findIndex((each) => each.str.match('Credit Note No'))
//     }
//     // console.log(data[ind2])
//     let ind3 = data.findIndex((each) => each.str.match('Credit Note Date'))
//     let ind4 = data.findIndex((each) => each.str.match('Order Date'))
//     let ind6 = data.find((each) => each.str == "HSN");
//     let ind7 = data.findIndex((each) => each.str.match('IGST'))
//     let ind11 = data.find((each) => each.str == "Total");
//     let ind10 = data.find((each) => each.str == "Taxes");
//     req_obj = {
//         "Purchase Order Number": data[ind1].str.split(':')[1],
//         "Invoice Number": data[ind2].str.split(':')[1] ,
//         "Invoice Date": data[ind3].str.split('Date:')[1],
//         "Order Date": data[ind4].str.split('Date:')[1],
//         // "Taxable value": data[ind7 - 2].str,
//         "HSN": tableData1(data, ind6, 1,0),
//         "Description": newArrstring,
//         "Taxes": tableData1(data, ind10, 1, 2).split(':')[1],
//         "Total": tableData1(data, ind11, 1, 2),
//     } 
//     return req_obj
// }
const listPDf = giveFiles('./src/pdf_copy2');
const result = (0, asynciterable_1.from)(listPDf).pipe(
// take(1),
(0, index_js_1.map)((pdf) => {
    const pdfextract = new pdf_js_extract_1.PDFExtract();
    const data = pdfextract.extract(`./src/pdf_copy2/${pdf}`, {});
    console.log(data);
    return data;
}), (0, index_js_1.map)((data) => {
    // console.dir(data, {depth: null})
    const req_data = data.pages[0].content;
    return req_data;
}));
result
    .forEach(item => {
    console.dir(item, { depth: null });
});
