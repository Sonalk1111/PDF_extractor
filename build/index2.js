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
};
const listPDf = giveFiles('./src/pdf_copy');
function tableData1(data, index, s1, s2) {
    const mapped_data = data.map((each) => {
        if (each && Math.floor(each.x) == Math.floor(index.x)) {
            return each;
        }
    }).filter((each) => each);
    if (s2) {
        return mapped_data.map((each) => each.str).slice(s1, s2).join(" ");
    }
    else {
        const filtered = mapped_data.map((each) => each.str);
        return filtered.slice(1).join(" ");
    }
}
function get_data(array) {
    let newObj;
    let req_obj;
    array.map((each) => {
        switch (each) {
            case (each):
                // console.dir(each, {depth: null})
                if (each.str.match('Credit Note Date')) {
                    let ind111 = array.findIndex((each) => each.str.match("Order Number"));
                    let ind211 = array.findIndex((each) => each.str.match('Credit Note Number'));
                    if (array[ind211] == undefined) {
                        ind211 = array.findIndex((each) => each.str.match('Credit Note No'));
                    }
                    let ind31 = array.findIndex((each) => each.str.match('Credit Note Date'));
                    let ind41 = array.findIndex((each) => each.str.match('Order Date'));
                    let ind61 = array.find((each) => each.str == "HSN");
                    let ind51 = array.find((each) => each.str == "Description");
                    let ind7 = array.findIndex((each) => each.str.match('IGST'));
                    let ind8 = array.find((each) => each.str == "Total");
                    let ind9 = array.find((each) => each.str == "Taxes");
                    req_obj = {
                        "Purchase Order Number": array[ind111].str.split(':')[1],
                        "Invoice Number": array[ind211].str,
                        "Invoice Date": array[ind31].str.split('Date:')[1],
                        "Order Date": array[ind41].str.split('Date:')[1],
                        // "Taxable value": data[ind7 - 2].str,
                        "HSN": tableData1(array, ind61, 1, 0),
                        "Description": tableData1(array, ind51, 1, 0),
                        // newArrstring,
                        "Taxes": tableData1(array, ind9, 1, 2).split(':')[1],
                        "Total": tableData1(array, ind8, 1, 2),
                    };
                }
                console.dir(req_obj, { depth: null });
                return req_obj;
            default:
                if (each.str.match("Tax Invoice")) {
                    let ind1 = array.findIndex((each) => each.str == "Order Number");
                    let ind12 = array.findIndex((each) => each.str == "Purchase Order Number");
                    let ind2 = array.findIndex((each) => each.str == "Invoice Number");
                    let ind3 = array.findIndex((each) => each.str == "Invoice Date");
                    let ind4 = array.findIndex((each) => each.str == "Order Date");
                    let ind5 = array.find((each) => each.str == "Description");
                    let ind6 = array.find((each) => each.str == "HSN");
                    let ind10 = array.find((each) => each.str == "Taxes");
                    let ind11 = array.find((each) => each.str == "Total");
                    newObj = {
                        "Purchase Order Number": array[ind1 + 2].str || array[ind12 + 2].str,
                        "Invoice Number": array[ind2 + 2].str,
                        "Invoice Date": array[ind3 + 2].str,
                        "Order Date": array[ind4 + 2].str,
                        "HSN": tableData1(array, ind6, 1, 0),
                        "Description": tableData1(array, ind5, 1, 0),
                        // "Discount": tableData1(array, ind8, 1, 2),
                        "Taxes": tableData1(array, ind10, 1, 2),
                        "Total": tableData1(array, ind11, 1, 2),
                    };
                    console.dir(newObj, { depth: null });
                    return newObj;
                }
        }
    });
}
const result = (0, asynciterable_1.from)(listPDf).pipe(
// take(1),
(0, index_js_1.map)((pdf) => {
    const pdfextract = new pdf_js_extract_1.PDFExtract();
    const data = pdfextract.extract(`./src/pdf_copy/${pdf}`, {});
    return data;
}), (0, index_js_1.map)((data) => {
    // console.dir(data, {depth: null})
    const req_data = data.pages[0].content;
    return req_data;
}), (0, index_js_1.map)((req_data) => {
    return get_data(req_data);
}));
result
    .forEach(item => {
    console.dir(item, { depth: null });
});
