import * as fs from 'fs';
import { PDFExtract, PDFExtractText } from "pdf.js-extract";
import { map, take } from 'ix/asynciterable/operators/index.js';
import { from } from 'ix/asynciterable';


const giveFiles = (getpath: string): string[] => {
    return fs.readdirSync(getpath).filter(x => x.includes('.pdf'))
};

const listPDf = giveFiles('./src/pdf_copy')

interface res_data {
    'Purchase Order Number': string,
    'Invoice Number': string,
    'Invoice Date': string,
    'Order Date': string,
    'HSN': string,
    'Description': string,
    // 'Discount': string,
    'Taxes': string,
    'Total': string,
}

function tableData1(data: PDFExtractText[], index: any, s1: number, s2 : number) {
    const mapped_data = data.map((each: any) => {
        if(each && Math.floor(each.x) == Math.floor(index.x)) {
            return each;
        }
    }).filter((each) => each)
    
    if(s2)
    {
        return mapped_data.map((each) => each.str).slice(s1, s2).join(" ");
    }
    else
    {
        const filtered = mapped_data.map((each) => each.str)
        return filtered.slice(1).join(" ");
    }
}


function get_data(array: PDFExtractText[]): res_data {

    let newObj: res_data
    let ind1 = array.findIndex((each) => each.str ==  "Order Number")
    let ind12 = array.findIndex((each) => each.str == "Purchase Order Number")
    let ind2 = array.findIndex((each) => each.str == "Invoice Number");
    let ind3 = array.findIndex((each) => each.str == "Invoice Date");
    let ind4 = array.findIndex((each) => each.str == "Order Date");
    let ind5 = array.find((each) => each.str == "Description");
    let ind6 = array.find((each) => each.str == "HSN");
    // console.dir(ind6, {depth: null})
    let ind8 = array.find((each) => each.str == "Discount");
    let ind10 = array.find((each) => each.str == "Taxes");
    let ind11 = array.find((each) => each.str == "Total");
    newObj = {
        "Purchase Order Number": array[ind1 + 2].str || array[ind12 + 2].str,
        "Invoice Number": array[ind2 + 2].str,
        "Invoice Date": array[ind3 + 2].str,
        "Order Date": array[ind4 + 2].str,
        "HSN": tableData1(array, ind6, 1,0),
        "Description": tableData1(array, ind5, 1, 0),
        // "Discount": tableData1(array, ind8, 1, 2),
        "Taxes": tableData1(array, ind10, 1, 2),
        "Total": tableData1(array, ind11, 1, 2),
    } 

    // console.dir(tableData1(array, ind6, 1,0), {depth: null})
    return newObj
}

// function getInfo(objects: {name: string; value: string;} []) {
//     return objects.map(object => `${object.name} ${object.value}`)
// }


// const get_data = (data: PDFExtractText[]) => {
//     let ind1 = data.findIndex((each) => each.str == "Order Number")
//     let ind2 = data.findIndex((each) => each.str == "Invoice Number");
//     const final_data = [
//         {
//             name: "Order Number", value: data[ind1 + 2].str,
//             name1: "Invoice_Number", value1: data[ind2 + 2].str,
//         }

//     ]

//     return final_data
// }



const result = from(listPDf).pipe(
    // take(1),
    map((pdf) => {
        const pdfextract = new PDFExtract()
        const data = pdfextract.extract(`./src/pdf_copy/${pdf}`, {})
        return data
    }),
    map((data) => {
        // console.dir(data, {depth: null})
        const req_data = data.pages[0].content
        return req_data
    }),
    map((x) => {
        return get_data(x)
    })
)

result
  .forEach(item => {
    console.dir(item,{depth: null});
  });