import * as fs from 'fs';
import { PDFExtract, PDFExtractText } from 'pdf.js-extract';
import { map, filter, take } from 'ix/asynciterable/operators/index.js';
import { from } from 'ix/asynciterable';
import * as XLSX from 'xlsx'


const giveFiles = (getpath: string): string[] => {
    return fs.readdirSync(getpath).filter(x => x.includes('.pdf'))
};


const listPDf = giveFiles('./src/pdf_copy')


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

function cgst_val(array:  PDFExtractText[]) {

    let ind10 = array.find((each) => each.str == "Taxes");
    let val1
    const newArr: string[] = [];
    array.map((each) => {
        if(each.str.match("OTHER CHARGES") && each.str.match("CGST")){
        // (each.str.match("CGST")){
            val1 = tableData1(array, ind10, 3, 4)
            newArr.push("CGST")
            newArr.push(val1)
            // console.log(newArr, "sonal")
        }
        else if(each.str.match("CGST")){
            val1 = tableData1(array, ind10, 1, 0).split("Rs")
            newArr.push("CGST")
            let val2 = val1[val1.length - 1]
            newArr.push('Rs')
            newArr.push(val2)
        
        }
        else if(each.str.match("IGST")){
            val1 = tableData1(array, ind10, 1, 2)
            // newArr.push("IGST") 
            newArr.push(val1)
        }

    })
    // array.map((each) => {
    // switch(each.str){  
  
    //     case "OTHER CHARGES":  
    //     val1 = tableData1(array, ind10, 3, 4)
    //     newArr.push("CGST")
    //     newArr.push(val1)
    //     console.log(newArr, "sonal")
    //     break;  //optional  
              
    //     default:  
    //     // console.log("CGST")
    //         break;  //optional  
    //     }  
    // })
    // console.log(newArr)
    return newArr.filter((item, 
        index) => newArr.indexOf(item) === index).join(" ")
}


function get_data(array: PDFExtractText[]) {
    // let req_data11 = {}
    let req_obj = {}
    array.map((each) => {
        // console.dir(each, {depth: null})
        if(each.str == "Credit Note"){
            // console.log("sonal")
            let ind1 = array.findIndex((each) => each.str.match("Order Number"))
            // console.log(array[ind1])
            let ind21 = array.findIndex((each) => each.str.match('Credit Note Number'))
            if(array[ind21] == undefined){
                ind21 = array.findIndex((each) => each.str.match('Credit Note No'))
            }
            let ind3 = array.findIndex((each) => each.str.match('Credit Note Date'))
            let ind4 = array.findIndex((each) => each.str.match('Order Date'))
            let ind6 = array.find((each) => each.str == "HSN");
            let ind5 = array.find((each) => each.str == "Description");
            let ind7 = array.findIndex((each) => each.str.match('IGST'))
            let ind8 = array.find((each) => each.str == "Total");
            let ind9 = array.find((each) => each.str == "Taxes");

            req_obj= {
                "Purchase Order Number": array[ind1].str.split(':')[1],
                "Invoice Number": array[ind21].str.split(':')[1],
                "Invoice Date": array[ind3].str.split('Date:')[1],
                "Order Date": array[ind4].str.split('Date:')[1],
                // "Taxable value": array[ind7 - 2].str,
                "HSN": tableData1(array, ind6, 1,0),
                "Description":  tableData1(array, ind5, 1, 0),
                // newArrstring,
                "Taxes": tableData1(array, ind9, 1, 2),
                "Total": tableData1(array, ind8, 1, 2),
            } 
            // console.dir(req_obj, {depth: null})
            // return req_obj
        }
        else if(each.str == "Tax Invoice"){
            let ind1 = array.findIndex((each) => each.str ==  "Order Number")
            let ind12 = array.findIndex((each) => each.str == "Purchase Order Number")
            let ind2 = array.findIndex((each) => each.str == "Invoice Number");
            let ind3 = array.findIndex((each) => each.str == "Invoice Date");
            let ind4 = array.findIndex((each) => each.str == "Order Date");
            let ind5 = array.find((each) => each.str == "Description");
            let ind6 = array.find((each) => each.str == "HSN");
            let ind10 = array.find((each) => each.str == "Taxes");
            let ind11 = array.find((each) => each.str == "Total");


            req_obj = {
                "Purchase Order Number": array[ind1 + 2].str || array[ind12 + 2].str,
                "Invoice Number": array[ind2 + 2].str,
                "Invoice Date": array[ind3 + 2].str,
                "Order Date": array[ind4 + 2].str,
                "HSN": tableData1(array, ind6, 1,0),
                "Description": tableData1(array, ind5, 1, 0),
                // "Discount": tableData1(array, ind8, 1, 2),
                "Taxes": cgst_val(array),
                // tableData1(array, ind10, 1, 2) ,
                "Total": tableData1(array, ind11, 1, 2),
            }

            // console.log(req_obj)
            // return req_obj
        }
        
    })

    return req_obj
}

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

const result = from(listPDf).pipe(
    // take(1),
    // filter(p => p === 'jorwp232929.pdf'),
    map((pdf ) => {
        const pdfextract = new PDFExtract()
        const data = pdfextract.extract(`./src/pdf_copy/${pdf}`, {})
        return data
    }),
    map((data) => {
        // console.dir(data, {depth: null})
        const req_data = data.pages[0].content
        return req_data
    }),
    map((req_data) => {
        return get_data(req_data)
    }),
)

const newArr1:any = [];

result
  .forEach(item => {
    // console.dir(item,{depth: null});
    // newArr1.push(item)  
});



  
let excelData = newArr1.map((item: any) => {Object.values(item)});
// console.dir(newArr1, {depth: null})
// // Create a new workbook
let wb = XLSX.utils.book_new();

// // Add the data to the workbook
let ws = XLSX.utils.aoa_to_sheet(excelData);
// console.log(ws)
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

// // Download the Excel file
XLSX.writeFile(wb, "data.xlsx");
